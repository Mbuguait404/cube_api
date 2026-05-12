import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { BadgesService } from '../badges/badges.service';
import { CommunitiesService } from '../communities/communities.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { UniflowService } from '../integrations/uniflow/uniflow.service';
import { CmsBridgeService } from '../integrations/cms-bridge/cms-bridge.service';
import { AuthService } from '../auth/auth.service';
import { BulkEmailDto, CreateMemberDto, ListUsersQueryDto } from './dto/admin.dto';
import { CreateBadgeDto } from '../badges/dto/create-badge.dto';
import { CreateCommunityDto } from '../communities/dto/create-community.dto';
import { CreateAnnouncementDto } from '../announcements/dto/create-announcement.dto';
export declare class AdminService {
    private userModel;
    private usersService;
    private badgesService;
    private communitiesService;
    private announcementsService;
    private uniflowService;
    private cmsBridgeService;
    private authService;
    constructor(userModel: Model<UserDocument>, usersService: UsersService, badgesService: BadgesService, communitiesService: CommunitiesService, announcementsService: AnnouncementsService, uniflowService: UniflowService, cmsBridgeService: CmsBridgeService, authService: AuthService);
    listUsers(query: ListUsersQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<UserDocument>;
    updateUserStatus(id: string, status: UserStatus): Promise<{
        message: string;
        tempPassword: string;
    } | {
        message: string;
        user: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    approveApplication(userId: string): Promise<{
        message: string;
        tempPassword: string;
    }>;
    deactivateUser(id: string): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    reactivateUser(id: string): Promise<{
        message: string;
        user: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    createMember(dto: CreateMemberDto): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateUserRole(userId: string, role: UserRole): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    createBadge(dto: CreateBadgeDto): Promise<import("../badges/schemas/badge.schema").BadgeDocument>;
    listBadges(): Promise<import("../badges/schemas/badge.schema").BadgeDocument[]>;
    assignBadgeToUser(userId: string, badgeId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteBadge(badgeId: string): Promise<{
        message: string;
    }>;
    createCommunity(dto: CreateCommunityDto): Promise<import("../communities/schemas/community.schema").CommunityDocument>;
    listCommunities(): Promise<import("../communities/schemas/community.schema").CommunityDocument[]>;
    assignUserToCommunity(userId: string, communityId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeUserFromCommunity(userId: string, communityId: string): Promise<{
        message: string;
    }>;
    createAnnouncement(dto: CreateAnnouncementDto, adminId: string): Promise<import("../announcements/schemas/announcement.schema").AnnouncementDocument>;
    listAnnouncements(): Promise<import("../announcements/schemas/announcement.schema").AnnouncementDocument[]>;
    deleteAnnouncement(id: string): Promise<{
        message: string;
    }>;
    toggleAnnouncement(id: string): Promise<import("mongoose").Document<unknown, {}, import("../announcements/schemas/announcement.schema").AnnouncementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../announcements/schemas/announcement.schema").Announcement & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    sendBulkEmail(dto: BulkEmailDto): Promise<{
        sent: number;
        failed: number;
        total: number;
    }>;
    getCmsApplications(page?: number, limit?: number, search?: string, status?: string): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getCmsMemberships(page?: number, limit?: number, search?: string, status?: string): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getCmsApplicationById(id: string): Promise<any>;
    importCmsApplication(id: string): Promise<{
        success: boolean;
        userId: Types.ObjectId;
        email: string;
        tempPassword: string;
    }>;
    getDashboardStats(): Promise<{
        totalMembers: number;
        active: number;
        pending: number;
        inactive: number;
        communityBreakdown: {
            community: import("../communities/schemas/community.schema").CommunityDocument;
            count: number;
        }[];
        recentSignups: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}
