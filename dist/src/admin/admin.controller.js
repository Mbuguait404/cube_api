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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const admin_dto_1 = require("./dto/admin.dto");
const create_badge_dto_1 = require("../badges/dto/create-badge.dto");
const create_community_dto_1 = require("../communities/dto/create-community.dto");
const create_announcement_dto_1 = require("../announcements/dto/create-announcement.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getStats() {
        return this.adminService.getDashboardStats();
    }
    listUsers(query) {
        return this.adminService.listUsers(query);
    }
    getUser(id) {
        return this.adminService.getUserById(id);
    }
    createMember(dto) {
        return this.adminService.createMember(dto);
    }
    updateUserStatus(id, status) {
        return this.adminService.updateUserStatus(id, status);
    }
    updateRole(id, role) {
        return this.adminService.updateUserRole(id, role);
    }
    assignCommunity(userId, dto) {
        return this.adminService.assignUserToCommunity(userId, dto.communityId);
    }
    removeCommunity(userId, communityId) {
        return this.adminService.removeUserFromCommunity(userId, communityId);
    }
    listBadges() {
        return this.adminService.listBadges();
    }
    createBadge(dto) {
        return this.adminService.createBadge(dto);
    }
    assignBadge(userId, badgeId) {
        return this.adminService.assignBadgeToUser(userId, badgeId);
    }
    deleteBadge(id) {
        return this.adminService.deleteBadge(id);
    }
    listCommunities() {
        return this.adminService.listCommunities();
    }
    createCommunity(dto) {
        return this.adminService.createCommunity(dto);
    }
    listAnnouncements() {
        return this.adminService.listAnnouncements();
    }
    createAnnouncement(dto, user) {
        return this.adminService.createAnnouncement(dto, user._id.toString());
    }
    deleteAnnouncement(id) {
        return this.adminService.deleteAnnouncement(id);
    }
    toggleAnnouncement(id) {
        return this.adminService.toggleAnnouncement(id);
    }
    sendBulkEmail(dto) {
        return this.adminService.sendBulkEmail(dto);
    }
    getCmsApplications(page = 1, limit = 20) {
        return this.adminService.getCmsApplications(+page, +limit);
    }
    getCmsApplication(id) {
        return this.adminService.getCmsApplicationById(id);
    }
    importCmsApplication(id) {
        return this.adminService.importCmsApplication(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List all members & applicants with filters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.ListUsersQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually create a member account' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateMemberDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createMember", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user status (approve, deactivate, or reactivate)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Change user role (SuperAdmin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Post)('users/:id/communities'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign user to a community' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.AssignCommunityDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "assignCommunity", null);
__decorate([
    (0, common_1.Delete)('users/:id/communities/:communityId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove user from a community' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('communityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "removeCommunity", null);
__decorate([
    (0, common_1.Get)('badges'),
    (0, swagger_1.ApiOperation)({ summary: 'List all badges' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listBadges", null);
__decorate([
    (0, common_1.Post)('badges'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new badge' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_badge_dto_1.CreateBadgeDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createBadge", null);
__decorate([
    (0, common_1.Post)('users/:id/badges'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a badge to a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('badgeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "assignBadge", null);
__decorate([
    (0, common_1.Delete)('badges/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a badge' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteBadge", null);
__decorate([
    (0, common_1.Get)('communities'),
    (0, swagger_1.ApiOperation)({ summary: 'List all communities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listCommunities", null);
__decorate([
    (0, common_1.Post)('communities'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new community group' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_community_dto_1.CreateCommunityDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCommunity", null);
__decorate([
    (0, common_1.Get)('announcements'),
    (0, swagger_1.ApiOperation)({ summary: 'List all announcements' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listAnnouncements", null);
__decorate([
    (0, common_1.Post)('announcements'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a targeted announcement (empty communities = broadcast)',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_announcement_dto_1.CreateAnnouncementDto, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.Delete)('announcements/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an announcement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteAnnouncement", null);
__decorate([
    (0, common_1.Patch)('announcements/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle announcement active status' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleAnnouncement", null);
__decorate([
    (0, common_1.Post)('communications/bulk-email'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send bulk email to a community via Uniflow (use communityId="all" for everyone)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.BulkEmailDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sendBulkEmail", null);
__decorate([
    (0, common_1.Get)('cms/applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Pull applications from CMC' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCmsApplications", null);
__decorate([
    (0, common_1.Get)('cms/applications/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific CMC application by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCmsApplication", null);
__decorate([
    (0, common_1.Post)('cms/applications/:id/import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import a CMS application into the Hub as a member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "importCmsApplication", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map