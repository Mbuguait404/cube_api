import { UserRole } from '../../users/schemas/user.schema';
export declare class CreateMemberDto {
    firstName: string;
    lastName: string;
    email: string;
    role?: UserRole;
}
export declare class BulkEmailDto {
    communityId: string;
    subject: string;
    message: string;
}
export declare class AssignCommunityDto {
    communityId: string;
}
export declare class ListUsersQueryDto {
    search?: string;
    status?: string;
    community?: string;
    page?: number;
    limit?: number;
}
