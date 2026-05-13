import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    findAll(query: any, limit?: number, skip?: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("./schemas/log.schema").LogDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/log.schema").Log & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./schemas/log.schema").Log>;
    clearLogs(): Promise<void>;
}
