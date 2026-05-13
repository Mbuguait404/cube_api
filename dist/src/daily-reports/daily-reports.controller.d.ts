import { DailyReportsService } from './daily-reports.service';
import { CreateDailyReportDto, UpdateDailyReportDto } from './dto/daily-report.dto';
export declare class AdminDailyReportsController {
    private readonly reportsService;
    constructor(reportsService: DailyReportsService);
    findAll(projectId?: string, authorId?: string, status?: string, from?: string, to?: string): Promise<import("./schemas/daily-report.schema").DailyReportDocument[]>;
    findOne(id: string): Promise<import("./schemas/daily-report.schema").DailyReportDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export declare class MemberDailyReportsController {
    private readonly reportsService;
    constructor(reportsService: DailyReportsService);
    create(dto: CreateDailyReportDto, user: any): Promise<import("./schemas/daily-report.schema").DailyReportDocument>;
    getMyReports(user: any): Promise<import("./schemas/daily-report.schema").DailyReportDocument[]>;
    findOne(id: string): Promise<import("./schemas/daily-report.schema").DailyReportDocument>;
    update(id: string, dto: UpdateDailyReportDto, user: any): Promise<import("./schemas/daily-report.schema").DailyReportDocument>;
}
