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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
let ProjectsService = class ProjectsService {
    projectModel;
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async create(dto, createdBy) {
        const { programId, teamLeadId, memberIds, ...rest } = dto;
        const data = { ...rest, createdBy };
        const members = memberIds || dto.members;
        const teamLead = teamLeadId || dto.teamLead;
        const program = programId || dto.program;
        if (members)
            data.members = members.map((m) => new mongoose_2.Types.ObjectId(m));
        if (teamLead)
            data.teamLead = new mongoose_2.Types.ObjectId(teamLead);
        if (program)
            data.program = new mongoose_2.Types.ObjectId(program);
        return this.projectModel.create(data);
    }
    async findAll(filters = {}) {
        const query = {};
        if (filters.status)
            query.status = filters.status;
        if (filters.priority)
            query.priority = filters.priority;
        if (filters.programId)
            query.program = new mongoose_2.Types.ObjectId(filters.programId);
        if (filters.memberId)
            query.members = new mongoose_2.Types.ObjectId(filters.memberId);
        return this.projectModel
            .find(query)
            .populate('program', 'name status')
            .populate('teamLead', 'firstName lastName email profilePhoto')
            .populate('members', 'firstName lastName email profilePhoto designation')
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        const project = await this.projectModel
            .findById(id)
            .populate('program', 'name status startDate endDate')
            .populate('teamLead', 'firstName lastName email profilePhoto designation')
            .populate('members', 'firstName lastName email profilePhoto designation')
            .populate('createdBy', 'firstName lastName email');
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async findByIdForMember(id, userId) {
        const project = await this.findById(id);
        const isMember = project.members.some((m) => m._id?.toString() === userId || m.toString() === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('You are not a member of this project');
        return project;
    }
    async findByMember(userId) {
        return this.projectModel
            .find({ members: new mongoose_2.Types.ObjectId(userId) })
            .populate('program', 'name')
            .populate('teamLead', 'firstName lastName profilePhoto')
            .select('title description status priority deadline coverColor tags')
            .sort({ deadline: 1 })
            .exec();
    }
    async update(id, dto) {
        const { programId, teamLeadId, memberIds, ...rest } = dto;
        const updateData = { ...rest };
        const members = memberIds || dto.members;
        const teamLead = teamLeadId || dto.teamLead;
        const program = programId || dto.program;
        if (members)
            updateData.members = members.map((m) => new mongoose_2.Types.ObjectId(m));
        if (teamLead)
            updateData.teamLead = new mongoose_2.Types.ObjectId(teamLead);
        if (program)
            updateData.program = new mongoose_2.Types.ObjectId(program);
        const project = await this.projectModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async delete(id) {
        const project = await this.projectModel.findByIdAndDelete(id);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return { message: 'Project deleted' };
    }
    async addMembers(id, dto) {
        const memberObjectIds = dto.memberIds.map((m) => new mongoose_2.Types.ObjectId(m));
        const project = await this.projectModel.findByIdAndUpdate(id, { $addToSet: { members: { $each: memberObjectIds } } }, { new: true }).populate('members', 'firstName lastName email profilePhoto designation');
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async removeMember(projectId, userId) {
        const project = await this.projectModel.findByIdAndUpdate(projectId, { $pull: { members: new mongoose_2.Types.ObjectId(userId) } }, { new: true }).populate('members', 'firstName lastName email profilePhoto designation');
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async isMember(projectId, userId) {
        const project = await this.projectModel.findById(projectId).select('members');
        if (!project)
            return false;
        return project.members.some((m) => m.toString() === userId);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map