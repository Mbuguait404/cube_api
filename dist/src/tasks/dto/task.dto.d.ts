import { TaskStatus, TaskPriority } from '../schemas/task.schema';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    assignees?: string[];
    assigneeIds?: string[];
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    order?: number;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    assignees?: string[];
    assigneeIds?: string[];
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    order?: number;
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
}
