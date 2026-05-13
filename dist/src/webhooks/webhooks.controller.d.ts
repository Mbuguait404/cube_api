import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
export declare class WebhooksController {
    private config;
    private userModel;
    private readonly logger;
    constructor(config: ConfigService, userModel: Model<UserDocument>);
    receiveCmcApplication(secret: string, payload: any): Promise<{
        received: boolean;
        created: boolean;
        existing?: undefined;
    } | {
        received: boolean;
        created: boolean;
        existing: boolean;
    }>;
    receiveUniflowStatus(payload: any): Promise<{
        received: boolean;
    }>;
}
