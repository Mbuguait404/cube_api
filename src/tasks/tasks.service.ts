import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(
    projectId: string,
    dto: CreateTaskDto,
    createdBy: string,
  ): Promise<TaskDocument> {
    const { assigneeIds, assignees, ...rest } = dto;
    const ids = assigneeIds || assignees || [];

    const data: any = {
      ...rest,
      project: new Types.ObjectId(projectId),
      createdBy: new Types.ObjectId(createdBy),
      assignees: ids.map((a) => new Types.ObjectId(a)),
    };
    return this.taskModel.create(data);
  }

  async findByProject(projectId: string): Promise<TaskDocument[]> {
    return this.taskModel
      .find({ project: new Types.ObjectId(projectId) })
      .populate('assignees', 'firstName lastName email profilePhoto')
      .populate('createdBy', 'firstName lastName')
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  /** Tasks assigned to a specific member (optionally filtered by project) */
  async findByAssignee(
    userId: string,
    projectId?: string,
  ): Promise<TaskDocument[]> {
    const query: any = { assignees: new Types.ObjectId(userId) };
    if (projectId) query.project = new Types.ObjectId(projectId);

    return this.taskModel
      .find(query)
      .populate('project', 'title coverColor')
      .populate('assignees', 'firstName lastName profilePhoto')
      .sort({ dueDate: 1, priority: -1 })
      .exec();
  }

  async findById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findById(id)
      .populate('project', 'title coverColor members')
      .populate('assignees', 'firstName lastName email profilePhoto')
      .populate('createdBy', 'firstName lastName');
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskDocument> {
    const { assigneeIds, assignees, ...rest } = dto;
    const updates: any = { ...rest };

    if (assigneeIds || assignees) {
      const ids = assigneeIds || assignees || [];
      updates.assignees = ids.map((a) => new Types.ObjectId(a));
    }

    const task = await this.taskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  /** Member can only update status of tasks assigned to them */
  async updateStatusByMember(
    id: string,
    dto: UpdateTaskStatusDto,
    userId: string,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task not found');

    const isAssignee = task.assignees.some((a) => a.toString() === userId);
    if (!isAssignee) throw new ForbiddenException('Task not assigned to you');

    const updates: any = { status: dto.status };
    if (dto.status === TaskStatus.DONE) updates.completedAt = new Date();

    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) throw new NotFoundException('Task not found');
    return updatedTask;
  }

  async delete(id: string): Promise<{ message: string }> {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (!task) throw new NotFoundException('Task not found');
    return { message: 'Task deleted' };
  }

  /** Summary counts for a project (for dashboard widgets) */
  async getProjectTaskStats(projectId: string): Promise<Record<string, number>> {
    const results = await this.taskModel.aggregate([
      { $match: { project: new Types.ObjectId(projectId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const stats: Record<string, number> = {
      todo: 0, in_progress: 0, in_review: 0, done: 0, blocked: 0,
    };
    results.forEach((r) => { stats[r._id] = r.count; });
    return stats;
  }
}
