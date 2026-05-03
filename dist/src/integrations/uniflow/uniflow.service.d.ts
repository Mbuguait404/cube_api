import { ConfigService } from '@nestjs/config';
export declare class UniflowService {
    private config;
    private readonly logger;
    private client;
    constructor(config: ConfigService);
    sendApprovalEmail(email: string, fullName: string, tempPassword: string): Promise<any>;
    sendPasswordResetEmail(email: string, fullName: string, token: string): Promise<any>;
    sendBulkEmail(recipients: string[], subject: string, message: string): Promise<{
        sent: number;
        failed: number;
        total: number;
    }>;
    sendSms(phone: string, message: string): Promise<any>;
    private send;
    private buildApprovalEmailHtml;
    private buildPasswordResetHtml;
}
