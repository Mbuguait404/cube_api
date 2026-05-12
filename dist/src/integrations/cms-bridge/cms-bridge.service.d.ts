import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AuthService } from '../../auth/auth.service';
import { UserDocument } from '../../users/schemas/user.schema';
export declare class CmsBridgeService {
    private config;
    private userModel;
    private authService;
    private readonly logger;
    private client;
    private tenantId;
    private accessToken;
    private tokenExpiry;
    constructor(config: ConfigService, userModel: Model<UserDocument>, authService: AuthService);
    private getToken;
    private authHeaders;
    getApplications(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getMemberships(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getApplicationById(id: string): Promise<any>;
    getMembershipById(id: string): Promise<any>;
    importApplication(id: string, type?: 'admission' | 'membership'): Promise<{
        success: boolean;
        userId: import("mongoose").Types.ObjectId;
        email: string;
        tempPassword: string;
    }>;
    getEvents(params?: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getEventsForUser(email: string): Promise<any>;
    getBanners(): Promise<any>;
    getResources(params?: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getBlogPosts(params?: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: number;
            totalPages: any;
        };
    }>;
}
