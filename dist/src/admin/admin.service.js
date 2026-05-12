"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("../users/schemas/user.schema");
const users_service_1 = require("../users/users.service");
const badges_service_1 = require("../badges/badges.service");
const communities_service_1 = require("../communities/communities.service");
const announcements_service_1 = require("../announcements/announcements.service");
const uniflow_service_1 = require("../integrations/uniflow/uniflow.service");
const cms_bridge_service_1 = require("../integrations/cms-bridge/cms-bridge.service");
const auth_service_1 = require("../auth/auth.service");
let AdminService = class AdminService {
    userModel;
    usersService;
    badgesService;
    communitiesService;
    announcementsService;
    uniflowService;
    cmsBridgeService;
    authService;
    constructor(userModel, usersService, badgesService, communitiesService, announcementsService, uniflowService, cmsBridgeService, authService) {
        this.userModel = userModel;
        this.usersService = usersService;
        this.badgesService = badgesService;
        this.communitiesService = communitiesService;
        this.announcementsService = announcementsService;
        this.uniflowService = uniflowService;
        this.cmsBridgeService = cmsBridgeService;
        this.authService = authService;
    }
    async listUsers(query) {
        const { search, status, community, page = 1, limit = 20 } = query;
        const filter = {};
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { institution: { $regex: search, $options: 'i' } },
            ];
        }
        if (community) {
            filter.communities = new mongoose_2.Types.ObjectId(community);
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
    async getUserById(id) {
        const user = await this.usersService.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateUserStatus(id, status) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (status === user_schema_1.UserStatus.ACTIVE) {
            if (user.status === user_schema_1.UserStatus.PENDING) {
                return this.approveApplication(id);
            }
            return this.reactivateUser(id);
        }
        if (status === user_schema_1.UserStatus.INACTIVE) {
            return this.deactivateUser(id);
        }
        throw new common_1.BadRequestException(`Cannot set status to ${status}`);
    }
    async approveApplication(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.status === user_schema_1.UserStatus.ACTIVE) {
            throw new common_1.ConflictException('User is already approved and active');
        }
        return this.authService.sendTemporaryPassword(userId);
    }
    async deactivateUser(id) {
        const user = await this.userModel.findByIdAndUpdate(id, { status: user_schema_1.UserStatus.INACTIVE }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { message: 'User deactivated', user };
    }
    async reactivateUser(id) {
        const user = await this.userModel.findByIdAndUpdate(id, { status: user_schema_1.UserStatus.ACTIVE }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { message: 'User reactivated', user };
    }
    async createMember(dto) {
        const existing = await this.userModel.findOne({ email: dto.email });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const user = await this.userModel.create({
            ...dto,
            password: await bcrypt.hash('PENDING_RESET', 12),
            status: user_schema_1.UserStatus.PENDING,
            mustChangePassword: true,
        });
        await this.authService.sendTemporaryPassword(user._id.toString());
        return user;
    }
    async updateUserRole(userId, role) {
        const user = await this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async deleteUser(id) {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.communities && user.communities.length > 0) {
            await Promise.all(user.communities.map((cId) => this.communitiesService.incrementMemberCount(cId.toString(), -1)));
        }
        return { message: 'User deleted successfully' };
    }
    async createBadge(dto) {
        return this.badgesService.create(dto);
    }
    async listBadges() {
        return this.badgesService.findAll();
    }
    async assignBadgeToUser(userId, badgeId) {
        await this.badgesService.findById(badgeId);
        return this.usersService.assignBadge(userId, badgeId);
    }
    async deleteBadge(badgeId) {
        return this.badgesService.delete(badgeId);
    }
    async createCommunity(dto) {
        return this.communitiesService.create(dto);
    }
    async listCommunities() {
        return this.communitiesService.findAll();
    }
    async assignUserToCommunity(userId, communityId) {
        await this.communitiesService.findById(communityId);
        const user = await this.usersService.assignCommunity(userId, communityId);
        await this.communitiesService.incrementMemberCount(communityId, 1);
        return user;
    }
    async removeUserFromCommunity(userId, communityId) {
        await this.usersService.removeCommunity(userId, communityId);
        await this.communitiesService.incrementMemberCount(communityId, -1);
        return { message: 'User removed from community' };
    }
    async createAnnouncement(dto, adminId) {
        return this.announcementsService.create(dto, adminId);
    }
    async listAnnouncements() {
        return this.announcementsService.findAll();
    }
    async deleteAnnouncement(id) {
        return this.announcementsService.delete(id);
    }
    async toggleAnnouncement(id) {
        return this.announcementsService.toggleActive(id);
    }
    async sendBulkEmail(dto) {
        let recipients = [];
        if (dto.communityId === 'all') {
            const users = await this.userModel
                .find({ status: user_schema_1.UserStatus.ACTIVE })
                .select('email')
                .exec();
            recipients = users.map((u) => u.email);
        }
        else {
            const users = await this.userModel
                .find({
                status: user_schema_1.UserStatus.ACTIVE,
                communities: new mongoose_2.Types.ObjectId(dto.communityId),
            })
                .select('email')
                .exec();
            recipients = users.map((u) => u.email);
        }
        if (recipients.length === 0) {
            throw new common_1.BadRequestException('No active users found in this community');
        }
        return this.uniflowService.sendBulkEmail(recipients, dto.subject, dto.message);
    }
    async getCmsApplications(page = 1, limit = 20, search, status) {
        return this.cmsBridgeService.getApplications({ page, limit, search, status });
    }
    async getCmsMemberships(page = 1, limit = 20, search, status) {
        return this.cmsBridgeService.getMemberships({ page, limit, search, status });
    }
    async getCmsApplicationById(id) {
        return this.cmsBridgeService.getApplicationById(id);
    }
    async importCmsApplication(id) {
        return this.cmsBridgeService.importApplication(id);
    }
    async getDashboardStats() {
        const [totalMembers, active, pending, inactive] = await Promise.all([
            this.userModel.countDocuments(),
            this.userModel.countDocuments({ status: user_schema_1.UserStatus.ACTIVE }),
            this.userModel.countDocuments({ status: user_schema_1.UserStatus.PENDING }),
            this.userModel.countDocuments({ status: user_schema_1.UserStatus.INACTIVE }),
        ]);
        const communities = await this.communitiesService.findAll();
        const recentSignups = await this.userModel
            .find({ status: user_schema_1.UserStatus.PENDING })
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        badges_service_1.BadgesService,
        communities_service_1.CommunitiesService,
        announcements_service_1.AnnouncementsService,
        uniflow_service_1.UniflowService,
        cms_bridge_service_1.CmsBridgeService,
        auth_service_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map