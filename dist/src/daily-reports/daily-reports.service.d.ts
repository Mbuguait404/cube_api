import { Model } from 'mongoose';
import { DailyReportDocument } from './schemas/daily-report.schema';
import { CreateDailyReportDto, UpdateDailyReportDto } from './dto/daily-report.dto';
export declare class DailyReportsService {
    private reportModel;
    constructor(reportModel: Model<DailyReportDocument>);
    create(dto: CreateDailyReportDto, authorId: string): Promise<DailyReportDocument>;
    findByAuthor(authorId: string): Promise<DailyReportDocument[]>;
    findAll(filters?: {
        projectId?: string;
        authorId?: string;
        status?: string;
        from?: string;
        to?: string;
    }): Promise<DailyReportDocument[]>;
    findById(id: string): Promise<DailyReportDocument>;
    update(id: string, dto: UpdateDailyReportDto, userId: string): Promise<DailyReportDocument>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
