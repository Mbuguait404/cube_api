import { AdminService } from './admin.service';
import { UserRole, UserStatus } from '../users/schemas/user.schema';
import { BulkEmailDto, CreateMemberDto, ListUsersQueryDto, AssignCommunityDto } from './dto/admin.dto';
import { CreateBadgeDto } from '../badges/dto/create-badge.dto';
import { CreateCommunityDto } from '../communities/dto/create-community.dto';
import { CreateAnnouncementDto } from '../announcements/dto/create-announcement.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalMembers: number;
        active: number;
        pending: number;
        inactive: number;
        communityBreakdown: {
            community: import("../communities/schemas/community.schema").CommunityDocument;
            count: number;
        }[];
        recentSignups: (import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    listUsers(query: ListUsersQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    getUser(id: string): Promise<import("../users/schemas/user.schema").UserDocument>;
    createMember(dto: CreateMemberDto): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateUserStatus(id: string, status: UserStatus): Promise<{
        message: string;
        tempPassword: string;
    } | {
        message: string;
        user: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateRole(id: string, role: UserRole): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    assignCommunity(userId: string, dto: AssignCommunityDto): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeCommunity(userId: string, communityId: string): Promise<{
        message: string;
    }>;
    listBadges(): Promise<import("../badges/schemas/badge.schema").BadgeDocument[]>;
    createBadge(dto: CreateBadgeDto): Promise<import("../badges/schemas/badge.schema").BadgeDocument>;
    assignBadge(userId: string, badgeId: string): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteBadge(id: string): Promise<{
        message: string;
    }>;
    listCommunities(): Promise<import("../communities/schemas/community.schema").CommunityDocument[]>;
    createCommunity(dto: CreateCommunityDto): Promise<import("../communities/schemas/community.schema").CommunityDocument>;
    listAnnouncements(): Promise<import("../announcements/schemas/announcement.schema").AnnouncementDocument[]>;
    createAnnouncement(dto: CreateAnnouncementDto, user: any): Promise<import("../announcements/schemas/announcement.schema").AnnouncementDocument>;
    deleteAnnouncement(id: string): Promise<{
        message: string;
    }>;
    toggleAnnouncement(id: string): Promise<import("mongoose").Document<unknown, {}, import("../announcements/schemas/announcement.schema").AnnouncementDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../announcements/schemas/announcement.schema").Announcement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
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
    getCmsApplications(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getCmsApplication(id: string): Promise<any>;
    importCmsApplication(id: string): Promise<{
        success: boolean;
        userId: import("mongoose").Types.ObjectId;
        email: string;
        tempPassword: string;
    }>;
}
