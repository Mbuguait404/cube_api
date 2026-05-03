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
exports.CmsBridgeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cms_bridge_service_1 = require("./cms-bridge.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_schema_1 = require("../../users/schemas/user.schema");
let CmsBridgeController = class CmsBridgeController {
    cmsService;
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async checkHealth() {
        try {
            await this.cmsService.getEvents({ limit: 1 });
            return { status: 'connected', message: 'Successfully reached CMC' };
        }
        catch (err) {
            return { status: 'error', message: `CMS connection failed: ${err.message}` };
        }
    }
    getEvents(page = 1, limit = 20) {
        return this.cmsService.getEvents({ page: +page, limit: +limit });
    }
    getBanners() {
        return this.cmsService.getBanners();
    }
    getResources(page = 1, limit = 20) {
        return this.cmsService.getResources({ page: +page, limit: +limit });
    }
    getBlog(page = 1, limit = 10) {
        return this.cmsService.getBlogPosts({ page: +page, limit: +limit });
    }
    getApplications(page = 1, limit = 10) {
        return this.cmsService.getApplications({ page: +page, limit: +limit });
    }
    getMemberships(page = 1, limit = 50) {
        return this.cmsService.getMemberships({ page: +page, limit: +limit });
    }
    getApplicationById(id) {
        return this.cmsService.getApplicationById(id);
    }
    importApplication(id) {
        return this.cmsService.importApplication(id, 'admission');
    }
    importMembership(id) {
        return this.cmsService.importApplication(id, 'membership');
    }
};
exports.CmsBridgeController = CmsBridgeController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check connection to CMC' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsBridgeController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Get)('events'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch events from CMS' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('banners'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch carousel/banner content from CMS' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "getBanners", null);
__decorate([
    (0, common_1.Get)('resources'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch downloadable resources from CMS' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "getResources", null);
__decorate([
    (0, common_1.Get)('blog'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch blog posts from CMS' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "getBlog", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch applications (admissions) from CMS' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Get)('memberships'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch membership submissions from CMS' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "getMemberships", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get application details by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "getApplicationById", null);
__decorate([
    (0, common_1.Post)('applications/:id/import'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Import a CMS application into the Hub as a member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "importApplication", null);
__decorate([
    (0, common_1.Post)('memberships/:id/import'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Import a CMS membership submission into the Hub as a member' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsBridgeController.prototype, "importMembership", null);
exports.CmsBridgeController = CmsBridgeController = __decorate([
    (0, swagger_1.ApiTags)('CMS Bridge'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cms'),
    __metadata("design:paramtypes", [cms_bridge_service_1.CmsBridgeService])
], CmsBridgeController);
//# sourceMappingURL=cms-bridge.controller.js.map