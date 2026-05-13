import { ProjectsService } from './projects.service';
import { TasksService } from '../tasks/tasks.service';
import { DailyReportsService } from '../daily-reports/daily-reports.service';
import { CreateProjectDto, UpdateProjectDto, AddProjectMembersDto } from './dto/project.dto';
import { CreateTaskDto } from '../tasks/dto/task.dto';
export declare class AdminProjectsController {
    private readonly projectsService;
    private readonly tasksService;
    private readonly reportsService;
    constructor(projectsService: ProjectsService, tasksService: TasksService, reportsService: DailyReportsService);
    create(dto: CreateProjectDto, user: any): Promise<import("./schemas/project.schema").ProjectDocument>;
    findAll(status?: string, priority?: string, programId?: string, memberId?: string): Promise<import("./schemas/project.schema").ProjectDocument[]>;
    findOne(id: string): Promise<import("./schemas/project.schema").ProjectDocument>;
    update(id: string, dto: UpdateProjectDto): Promise<import("./schemas/project.schema").ProjectDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addMembers(id: string, dto: AddProjectMembersDto): Promise<import("./schemas/project.schema").ProjectDocument>;
    removeMember(id: string, userId: string): Promise<import("./schemas/project.schema").ProjectDocument>;
    createTask(projectId: string, dto: CreateTaskDto, user: any): Promise<import("../tasks/schemas/task.schema").TaskDocument>;
    getProjectTasks(projectId: string): Promise<import("../tasks/schemas/task.schema").TaskDocument[]>;
    getTaskStats(projectId: string): Promise<Record<string, number>>;
    getProjectReports(projectId: string, authorId?: string, from?: string, to?: string): Promise<import("../daily-reports/schemas/daily-report.schema").DailyReportDocument[]>;
}
export declare class MemberProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getMyProjects(user: any): Promise<import("./schemas/project.schema").ProjectDocument[]>;
    getProjectDetail(id: string, user: any): Promise<import("./schemas/project.schema").ProjectDocument>;
}
