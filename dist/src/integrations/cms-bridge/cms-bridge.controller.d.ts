import { CmsBridgeService } from './cms-bridge.service';
export declare class CmsBridgeController {
    private cmsService;
    constructor(cmsService: CmsBridgeService);
    checkHealth(): Promise<{
        status: string;
        message: string;
    }>;
    getEvents(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getBanners(): Promise<any>;
    getResources(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getBlog(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: number;
            totalPages: any;
        };
    }>;
    getApplications(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getMemberships(page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: any;
            limit: any;
            totalPages: any;
        };
    }>;
    getApplicationById(id: string): Promise<any>;
    importApplication(id: string): Promise<{
        success: boolean;
        userId: import("mongoose").Types.ObjectId;
        email: string;
        tempPassword: string;
    }>;
    importMembership(id: string): Promise<{
        success: boolean;
        userId: import("mongoose").Types.ObjectId;
        email: string;
        tempPassword: string;
    }>;
}
