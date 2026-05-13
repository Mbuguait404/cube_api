import { Model } from 'mongoose';
import { TaskDocument } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './dto/task.dto';
export declare class TasksService {
    private taskModel;
    constructor(taskModel: Model<TaskDocument>);
    create(projectId: string, dto: CreateTaskDto, createdBy: string): Promise<TaskDocument>;
    findByProject(projectId: string): Promise<TaskDocument[]>;
    findByAssignee(userId: string, projectId?: string): Promise<TaskDocument[]>;
    findById(id: string): Promise<TaskDocument>;
    update(id: string, dto: UpdateTaskDto): Promise<TaskDocument>;
    updateStatusByMember(id: string, dto: UpdateTaskStatusDto, userId: string): Promise<TaskDocument>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getProjectTaskStats(projectId: string): Promise<Record<string, number>>;
}
