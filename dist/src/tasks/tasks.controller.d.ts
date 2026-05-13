import { TasksService } from './tasks.service';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/task.dto';
export declare class AdminTasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findOne(id: string): Promise<import("./schemas/task.schema").TaskDocument>;
    update(id: string, dto: UpdateTaskDto): Promise<import("./schemas/task.schema").TaskDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export declare class MemberTasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getMyTasks(user: any, projectId?: string): Promise<import("./schemas/task.schema").TaskDocument[]>;
    findOne(id: string): Promise<import("./schemas/task.schema").TaskDocument>;
    updateStatus(id: string, dto: UpdateTaskStatusDto, user: any): Promise<import("./schemas/task.schema").TaskDocument>;
}
