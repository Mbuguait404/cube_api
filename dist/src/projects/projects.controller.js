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
exports.MemberProjectsController = exports.AdminProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const tasks_service_1 = require("../tasks/tasks.service");
const daily_reports_service_1 = require("../daily-reports/daily-reports.service");
const project_dto_1 = require("./dto/project.dto");
const task_dto_1 = require("../tasks/dto/task.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
let AdminProjectsController = class AdminProjectsController {
    projectsService;
    tasksService;
    reportsService;
    constructor(projectsService, tasksService, reportsService) {
        this.projectsService = projectsService;
        this.tasksService = tasksService;
        this.reportsService = reportsService;
    }
    create(dto, user) {
        return this.projectsService.create(dto, user._id.toString());
    }
    findAll(status, priority, programId, memberId) {
        return this.projectsService.findAll({ status, priority, programId, memberId });
    }
    findOne(id) {
        return this.projectsService.findById(id);
    }
    update(id, dto) {
        return this.projectsService.update(id, dto);
    }
    remove(id) {
        return this.projectsService.delete(id);
    }
    addMembers(id, dto) {
        return this.projectsService.addMembers(id, dto);
    }
    removeMember(id, userId) {
        return this.projectsService.removeMember(id, userId);
    }
    createTask(projectId, dto, user) {
        return this.tasksService.create(projectId, dto, user._id.toString());
    }
    getProjectTasks(projectId) {
        return this.tasksService.findByProject(projectId);
    }
    getTaskStats(projectId) {
        return this.tasksService.getProjectTaskStats(projectId);
    }
    getProjectReports(projectId, authorId, from, to) {
        return this.reportsService.findAll({ projectId, authorId, from, to });
    }
};
exports.AdminProjectsController = AdminProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all projects (filterable)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'priority', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'programId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'memberId', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('priority')),
    __param(2, (0, common_1.Query)('programId')),
    __param(3, (0, common_1.Query)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full project detail' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Add members to a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_dto_1.AddProjectMembersDto]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "addMembers", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a member from a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiParam)({ name: 'userId' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)(':id/tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a task in this project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)(':id/tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks in a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "getProjectTasks", null);
__decorate([
    (0, common_1.Get)(':id/tasks/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task status counts for a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "getTaskStats", null);
__decorate([
    (0, common_1.Get)(':id/daily-reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all daily reports for a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiQuery)({ name: 'authorId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('authorId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminProjectsController.prototype, "getProjectReports", null);
exports.AdminProjectsController = AdminProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Admin / Projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, common_1.Controller)('admin/projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService,
        tasks_service_1.TasksService,
        daily_reports_service_1.DailyReportsService])
], AdminProjectsController);
let MemberProjectsController = class MemberProjectsController {
    projectsService;
    tasksService;
    reportsService;
    constructor(projectsService, tasksService, reportsService) {
        this.projectsService = projectsService;
        this.tasksService = tasksService;
        this.reportsService = reportsService;
    }
    getMyProjects(user) {
        return this.projectsService.findByMember(user._id.toString());
    }
    getProjectDetail(id, user) {
        return this.projectsService.findByIdForMember(id, user._id.toString());
    }
    async getProjectTasks(projectId, user) {
        await this.projectsService.findByIdForMember(projectId, user._id.toString());
        return this.tasksService.findByProject(projectId);
    }
    async getProjectReports(projectId, user) {
        await this.projectsService.findByIdForMember(projectId, user._id.toString());
        return this.reportsService.findAll({ projectId });
    }
};
exports.MemberProjectsController = MemberProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my assigned projects' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MemberProjectsController.prototype, "getMyProjects", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a project I am a member of' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MemberProjectsController.prototype, "getProjectDetail", null);
__decorate([
    (0, common_1.Get)(':id/tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks in a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemberProjectsController.prototype, "getProjectTasks", null);
__decorate([
    (0, common_1.Get)(':id/daily-reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all daily reports for a project' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemberProjectsController.prototype, "getProjectReports", null);
exports.MemberProjectsController = MemberProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Member / Projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('member/projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService,
        tasks_service_1.TasksService,
        daily_reports_service_1.DailyReportsService])
], MemberProjectsController);
//# sourceMappingURL=projects.controller.js.map