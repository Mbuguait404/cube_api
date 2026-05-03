import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { calculateProfileCompletion } from './helpers/profile-completion.helper';
import { CmsBridgeService } from '../integrations/cms-bridge/cms-bridge.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cmsBridge: CmsBridgeService,
  ) {}

  // ─── Lookups ──────────────────────────────────────────────────────────────
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .populate('communities', 'name tag slug')
      .populate('badges', 'name iconUrl color description')
      .exec();
  }

  async findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+password').exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password +refreshToken')
      .exec();
  }

  // ─── Profile ──────────────────────────────────────────────────────────────
  async getMyProfile(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);

    // Recalculate completion %
    user.profileCompletion = calculateProfileCompletion(user.toObject());

    await user.save();
    return this.findById(userId);
  }

  // ─── Events (fetched from CMS) ────────────────────────────────────────────
  async getMyEvents(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Fetch from CMS using user email as identifier
    try {
      return await this.cmsBridge.getEventsForUser(user.email);
    } catch {
      return { events: [], message: 'Could not reach CMS — try again later' };
    }
  }

  // ─── Badges ───────────────────────────────────────────────────────────────
  async getMyBadges(userId: string) {
    return this.userModel
      .findById(userId)
      .select('badges')
      .populate('badges', 'name description iconUrl color trigger')
      .exec();
  }

  // ─── Announcements/Channels ───────────────────────────────────────────────
  async getMyCommunityIds(userId: string): Promise<Types.ObjectId[]> {
    const user = await this.userModel.findById(userId).select('communities');
    return (user?.communities as Types.ObjectId[]) || [];
  }

  // ─── Internal helpers (used by Admin / Auth) ──────────────────────────────
  async updatePassword(userId: string, hashedPassword: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      mustChangePassword: false,
      tempPasswordExpiry: null,
    });
  }

  async setTemporaryPassword(userId: string, hashedPassword: string) {
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    return this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      mustChangePassword: true,
      isFirstLogin: true,
      tempPasswordExpiry: expiry,
      status: UserStatus.ACTIVE,
    });
  }

  async assignBadge(userId: string, badgeId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const id = new Types.ObjectId(badgeId);
    if (user.badges.some((b) => b.toString() === badgeId)) return user;
    user.badges.push(id);
    return user.save();
  }

  async assignCommunity(userId: string, communityId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const id = new Types.ObjectId(communityId);
    if (!user.communities.some((c) => c.toString() === communityId)) {
      user.communities.push(id);
      await user.save();
    }
    return user;
  }

  async removeCommunity(userId: string, communityId: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { communities: new Types.ObjectId(communityId) },
    });
  }
}
