"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./schemas/task.schema");
let TasksService = class TasksService {
    taskModel;
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async create(projectId, dto, createdBy) {
        const { assigneeIds, assignees, ...rest } = dto;
        const ids = assigneeIds || assignees || [];
        const data = {
            ...rest,
            project: new mongoose_2.Types.ObjectId(projectId),
            createdBy: new mongoose_2.Types.ObjectId(createdBy),
            assignees: ids.map((a) => new mongoose_2.Types.ObjectId(a)),
        };
        return this.taskModel.create(data);
    }
    async findByProject(projectId) {
        return this.taskModel
            .find({ project: new mongoose_2.Types.ObjectId(projectId) })
            .populate('assignees', 'firstName lastName email profilePhoto')
            .populate('createdBy', 'firstName lastName')
            .sort({ order: 1, createdAt: -1 })
            .exec();
    }
    async findByAssignee(userId, projectId) {
        const query = { assignees: new mongoose_2.Types.ObjectId(userId) };
        if (projectId)
            query.project = new mongoose_2.Types.ObjectId(projectId);
        return this.taskModel
            .find(query)
            .populate('project', 'title coverColor')
            .populate('assignees', 'firstName lastName profilePhoto')
            .sort({ dueDate: 1, priority: -1 })
            .exec();
    }
    async findById(id) {
        const task = await this.taskModel
            .findById(id)
            .populate('project', 'title coverColor members')
            .populate('assignees', 'firstName lastName email profilePhoto')
            .populate('createdBy', 'firstName lastName');
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    async update(id, dto) {
        const { assigneeIds, assignees, ...rest } = dto;
        const updates = { ...rest };
        if (assigneeIds || assignees) {
            const ids = assigneeIds || assignees || [];
            updates.assignees = ids.map((a) => new mongoose_2.Types.ObjectId(a));
        }
        const task = await this.taskModel.findByIdAndUpdate(id, updates, { new: true });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    async updateStatusByMember(id, dto, userId) {
        const task = await this.taskModel.findById(id);
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const isAssignee = task.assignees.some((a) => a.toString() === userId);
        if (!isAssignee)
            throw new common_1.ForbiddenException('Task not assigned to you');
        const updates = { status: dto.status };
        if (dto.status === task_schema_1.TaskStatus.DONE)
            updates.completedAt = new Date();
        const updatedTask = await this.taskModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedTask)
            throw new common_1.NotFoundException('Task not found');
        return updatedTask;
    }
    async delete(id) {
        const task = await this.taskModel.findByIdAndDelete(id);
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return { message: 'Task deleted' };
    }
    async getProjectTaskStats(projectId) {
        const results = await this.taskModel.aggregate([
            { $match: { project: new mongoose_2.Types.ObjectId(projectId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
        const stats = {
            todo: 0, in_progress: 0, in_review: 0, done: 0, blocked: 0,
        };
        results.forEach((r) => { stats[r._id] = r.count; });
        return stats;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map