"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const profile_completion_helper_1 = require("./helpers/profile-completion.helper");
const cms_bridge_service_1 = require("../integrations/cms-bridge/cms-bridge.service");
let UsersService = class UsersService {
    userModel;
    cmsBridge;
    constructor(userModel, cmsBridge) {
        this.userModel = userModel;
        this.cmsBridge = cmsBridge;
    }
    async findById(id) {
        return this.userModel
            .findById(id)
            .populate('communities', 'name tag slug')
            .populate('badges', 'name iconUrl color description')
            .exec();
    }
    async findByIdWithPassword(id) {
        return this.userModel.findById(id).select('+password').exec();
    }
    async findByEmailWithPassword(email) {
        return this.userModel
            .findOne({ email: email.toLowerCase() })
            .select('+password +refreshToken')
            .exec();
    }
    async getMyProfile(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        Object.entries(dto).forEach(([key, value]) => {
            if (value !== undefined) {
                user[key] = value;
            }
        });
        user.profileCompletion = (0, profile_completion_helper_1.calculateProfileCompletion)(user.toObject());
        await user.save();
        return this.findById(userId);
    }
    async getMyEvents(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        try {
            return await this.cmsBridge.getEventsForUser(user.email);
        }
        catch {
            return { events: [], message: 'Could not reach CMS — try again later' };
        }
    }
    async getMyBadges(userId) {
        return this.userModel
            .findById(userId)
            .select('badges')
            .populate('badges', 'name description iconUrl color trigger')
            .exec();
    }
    async getMyCommunityIds(userId) {
        const user = await this.userModel.findById(userId).select('communities');
        return user?.communities || [];
    }
    async updatePassword(userId, hashedPassword) {
        return this.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            mustChangePassword: false,
            tempPasswordExpiry: null,
        });
    }
    async setTemporaryPassword(userId, hashedPassword) {
        const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
        return this.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            mustChangePassword: true,
            isFirstLogin: true,
            tempPasswordExpiry: expiry,
            status: user_schema_1.UserStatus.ACTIVE,
        });
    }
    async assignBadge(userId, badgeId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const id = new mongoose_2.Types.ObjectId(badgeId);
        if (user.badges.some((b) => b.toString() === badgeId))
            return user;
        user.badges.push(id);
        return user.save();
    }
    async assignCommunity(userId, communityId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const id = new mongoose_2.Types.ObjectId(communityId);
        if (!user.communities.some((c) => c.toString() === communityId)) {
            user.communities.push(id);
            await user.save();
        }
        return user;
    }
    async removeCommunity(userId, communityId) {
        return this.userModel.findByIdAndUpdate(userId, {
            $pull: { communities: new mongoose_2.Types.ObjectId(communityId) },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cms_bridge_service_1.CmsBridgeService])
], UsersService);
//# sourceMappingURL=users.service.js.map