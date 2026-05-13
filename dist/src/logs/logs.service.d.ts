import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';
export declare class LogsService {
    private logModel;
    constructor(logModel: Model<LogDocument>);
    create(logData: Partial<Log>): Promise<Log>;
    findAll(query?: any, options?: {
        limit?: number;
        skip?: number;
        sort?: any;
    }): Promise<{
        items: (import("mongoose").Document<unknown, {}, LogDocument, {}, import("mongoose").DefaultSchemaOptions> & Log & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
    }>;
    findOne(id: string): Promise<Log | null>;
    clearLogs(): Promise<void>;
}
