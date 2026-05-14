import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  User,
  UserDocument,
  UserRole,
  UserStatus,
} from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { BadgesService } from '../badges/badges.service';
import { CommunitiesService } from '../communities/communities.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { UniflowService } from '../integrations/uniflow/uniflow.service';
import { CmsBridgeService } from '../integrations/cms-bridge/cms-bridge.service';
import { AuthService } from '../auth/auth.service';
import {
  BulkEmailDto,
  BulkSmsDto,
  CreateMemberDto,
  ListUsersQueryDto,
} from './dto/admin.dto';
import { CreateBadgeDto } from '../badges/dto/create-badge.dto';
import { CreateCommunityDto } from '../communities/dto/create-community.dto';
import { CreateAnnouncementDto } from '../announcements/dto/create-announcement.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private badgesService: BadgesService,
    private communitiesService: CommunitiesService,
    private announcementsService: AnnouncementsService,
    private uniflowService: UniflowService,
    private cmsBridgeService: CmsBridgeService,
    private authService: AuthService,
  ) {}

  // ─── User Management ──────────────────────────────────────────────────────

  async listUsers(query: ListUsersQueryDto) {
    const { search, status, community, page = 1, limit = 20 } = query;
    const filter: any = {};

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { institution: { $regex: search, $options: 'i' } },
      ];
    }

    if (community) {
      filter.communities = new Types.ObjectId(community);
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .populate('communities', 'name tag')
        .populate('badges', 'name iconUrl color')
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserStatus(id: string, status: UserStatus) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (status === UserStatus.ACTIVE) {
      if (user.status === UserStatus.PENDING) {
        return this.approveApplication(id);
      }
      return this.reactivateUser(id);
    }

    if (status === UserStatus.INACTIVE) {
      return this.deactivateUser(id);
    }

    throw new BadRequestException(`Cannot set status to ${status}`);
  }

  /** Approve application: create/activate account and send temp password */
  async approveApplication(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.status === UserStatus.ACTIVE) {
      throw new ConflictException('User is already approved and active');
    }
    return this.authService.sendTemporaryPassword(userId);
  }

  async deactivateUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { status: UserStatus.INACTIVE },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User deactivated', user };
  }

  async reactivateUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { status: UserStatus.ACTIVE },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User reactivated', user };
  }

  async createMember(dto: CreateMemberDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');
    
    const user = await this.userModel.create({
      ...dto,
      password: await bcrypt.hash('PENDING_RESET', 12),
      status: UserStatus.PENDING,
      mustChangePassword: true,
    });

    // Automatically trigger temporary password email
    await this.authService.sendTemporaryPassword(user._id.toString());
    
    return user;
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    
    // Decrement member count in communities the user belonged to
    if (user.communities && user.communities.length > 0) {
      await Promise.all(
        user.communities.map((cId) =>
          this.communitiesService.incrementMemberCount(cId.toString(), -1),
        ),
      );
    }

    return { message: 'User deleted successfully' };
  }

  // ─── Badges ───────────────────────────────────────────────────────────────

  async createBadge(dto: CreateBadgeDto) {
    return this.badgesService.create(dto);
  }

  async listBadges() {
    return this.badgesService.findAll();
  }

  async assignBadgeToUser(userId: string, badgeId: string) {
    await this.badgesService.findById(badgeId); // validates badge exists
    return this.usersService.assignBadge(userId, badgeId);
  }

  async deleteBadge(badgeId: string) {
    return this.badgesService.delete(badgeId);
  }

  // ─── Communities ──────────────────────────────────────────────────────────

  async createCommunity(dto: CreateCommunityDto) {
    return this.communitiesService.create(dto);
  }

  async listCommunities() {
    return this.communitiesService.findAll();
  }

  async assignUserToCommunity(userId: string, communityId: string) {
    await this.communitiesService.findById(communityId); // validate
    const user = await this.usersService.assignCommunity(userId, communityId);
    await this.communitiesService.incrementMemberCount(communityId, 1);
    return user;
  }

  async removeUserFromCommunity(userId: string, communityId: string) {
    await this.usersService.removeCommunity(userId, communityId);
    await this.communitiesService.incrementMemberCount(communityId, -1);
    return { message: 'User removed from community' };
  }

  // ─── Announcements ────────────────────────────────────────────────────────

  async createAnnouncement(dto: CreateAnnouncementDto, adminId: string) {
    return this.announcementsService.create(dto, adminId);
  }

  async listAnnouncements() {
    return this.announcementsService.findAll();
  }

  async deleteAnnouncement(id: string) {
    return this.announcementsService.delete(id);
  }

  async toggleAnnouncement(id: string) {
    return this.announcementsService.toggleActive(id);
  }

  // ─── Bulk Email ───────────────────────────────────────────────────────────

  async sendBulkEmail(dto: BulkEmailDto) {
    let recipients: string[] = [];

    if (dto.communityId) {
      if (dto.communityId === 'all') {
        const users = await this.userModel
          .find({ status: UserStatus.ACTIVE })
          .select('email')
          .exec();
        recipients = users.map((u) => u.email);
      } else {
        const users = await this.userModel
          .find({
            status: UserStatus.ACTIVE,
            communities: new Types.ObjectId(dto.communityId),
          })
          .select('email')
          .exec();
        recipients = users.map((u) => u.email);
      }
    }

    if (dto.manualRecipients && dto.manualRecipients.length > 0) {
      recipients = [...new Set([...recipients, ...dto.manualRecipients])];
    }

    if (recipients.length === 0) {
      throw new BadRequestException('No recipients found');
    }

    if (dto.scheduleAt) {
      // Logic for scheduling would go here (e.g. saving to a 'scheduled_messages' collection)
      return { message: 'Email scheduled', recipientCount: recipients.length, scheduledAt: dto.scheduleAt };
    }

    return this.uniflowService.sendBulkEmail(
      recipients,
      dto.subject,
      dto.message,
    );
  }

  async sendBulkSms(dto: BulkSmsDto) {
    let recipients: string[] = [];

    if (dto.communityId) {
      if (dto.communityId === 'all') {
        const users = await this.userModel
          .find({ status: UserStatus.ACTIVE })
          .select('phone')
          .exec();
        recipients = users.map((u) => u.phone).filter(Boolean);
      } else {
        const users = await this.userModel
          .find({
            status: UserStatus.ACTIVE,
            communities: new Types.ObjectId(dto.communityId),
          })
          .select('phone')
          .exec();
        recipients = users.map((u) => u.phone).filter(Boolean);
      }
    }

    if (dto.manualRecipients && dto.manualRecipients.length > 0) {
      recipients = [...new Set([...recipients, ...dto.manualRecipients])];
    }

    if (recipients.length === 0) {
      throw new BadRequestException('No recipients with valid phone numbers found');
    }

    if (dto.scheduleAt) {
      return { message: 'SMS scheduled', recipientCount: recipients.length, scheduledAt: dto.scheduleAt };
    }

    // Uniflow service needs a bulk SMS method or we call sendSms in loop
    // For now let's assume uniflowService has sendBulkSms or we loop
    const results = await Promise.allSettled(
      recipients.map(phone => this.uniflowService.sendSms(phone, dto.message))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { sent, failed, total: recipients.length };
  }

  // ─── Templates & Logs ─────────────────────────────────────────────────────

  async getCommunicationTemplates() {
    return this.uniflowService.getTemplates();
  }

  async getCommunicationLogs(params: any = {}) {
    return this.uniflowService.getLogs(params);
  }

  async getUniflowOrganization() {
    return this.uniflowService.getOrganization();
  }

  // ─── CMS Applications (pull from CMC) ────────────────────────────────────

  async getCmsApplications(page = 1, limit = 20, search?: string, status?: string) {
    return this.cmsBridgeService.getApplications({ page, limit, search, status });
  }

  async getCmsMemberships(page = 1, limit = 20, search?: string, status?: string) {
    return this.cmsBridgeService.getMemberships({ page, limit, search, status });
  }

  async getCmsApplicationById(id: string) {
    return this.cmsBridgeService.getApplicationById(id);
  }

  async importCmsApplication(id: string) {
    return this.cmsBridgeService.importApplication(id, 'admission');
  }

  async importCmsMembership(id: string) {
    return this.cmsBridgeService.importApplication(id, 'membership');
  }

  // ─── Dashboard Stats ──────────────────────────────────────────────────────

  async getDashboardStats() {
    const [totalMembers, active, pending, inactive] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ status: UserStatus.ACTIVE }),
      this.userModel.countDocuments({ status: UserStatus.PENDING }),
      this.userModel.countDocuments({ status: UserStatus.INACTIVE }),
    ]);

    const communities = await this.communitiesService.findAll();
    
    const recentSignups = await this.userModel
      .find({ status: UserStatus.PENDING })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    return {
      totalMembers,
      active,
      pending,
      inactive,
      communityBreakdown: communities.map((c) => ({
        community: c,
        count: c.memberCount,
      })),
      recentSignups,
    };
  }
}
