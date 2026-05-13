import { ReportMood, ReportStatus } from '../schemas/daily-report.schema';
export declare class CreateDailyReportDto {
    projectId: string;
    date?: string;
    accomplishments?: string;
    challenges?: string;
    nextSteps?: string;
    tasksWorkedOn?: string[];
    hoursLogged?: number;
    mood?: ReportMood;
    status?: ReportStatus;
}
export declare class UpdateDailyReportDto {
    accomplishments?: string;
    challenges?: string;
    nextSteps?: string;
    tasksWorkedOn?: string[];
    hoursLogged?: number;
    mood?: ReportMood;
    status?: ReportStatus;
}
