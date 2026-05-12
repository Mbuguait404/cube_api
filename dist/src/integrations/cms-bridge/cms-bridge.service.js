"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CmsBridgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsBridgeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = __importDefault(require("axios"));
const bcrypt = __importStar(require("bcryptjs"));
const auth_service_1 = require("../../auth/auth.service");
const user_schema_1 = require("../../users/schemas/user.schema");
let CmsBridgeService = CmsBridgeService_1 = class CmsBridgeService {
    config;
    userModel;
    authService;
    logger = new common_1.Logger(CmsBridgeService_1.name);
    client;
    tenantId;
    accessToken = null;
    tokenExpiry = 0;
    constructor(config, userModel, authService) {
        this.config = config;
        this.userModel = userModel;
        this.authService = authService;
        this.tenantId = config.get('CMS_TENANT_ID') || '';
        this.client = axios_1.default.create({
            baseURL: config.get('CMS_BASE_URL'),
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': this.tenantId,
            },
        });
    }
    async getToken() {
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }
        const { data } = await this.client.post('/auth/login', {
            email: this.config.get('CMS_ADMIN_EMAIL'),
            password: this.config.get('CMS_ADMIN_PASSWORD'),
        });
        this.accessToken = data.accessToken;
        this.tokenExpiry = Date.now() + 6 * 60 * 60 * 1000;
        return this.accessToken;
    }
    async authHeaders() {
        const token = await this.getToken();
        return { Authorization: `Bearer ${token}` };
    }
    async getApplications(params) {
        try {
            const url = `${this.client.defaults.baseURL}/memberships`;
            this.logger.log(`Fetching from CMS: ${url} (page: ${params?.page || 1}, limit: ${params?.limit || 50}, search: ${params?.search}, status: ${params?.status})...`);
            const headers = await this.authHeaders();
            const { data } = await this.client.get('/memberships', {
                headers,
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 50,
                    search: params?.search,
                    status: params?.status === 'all' ? undefined : params?.status
                },
            });
            this.logger.log(`Found ${data.total || 0} applications at /memberships.`);
            return {
                data: (data.data || []).map((item) => ({
                    ...item,
                    firstName: item.firstName || item.name?.split(' ')[0] || '',
                    lastName: item.lastName || item.name?.split(' ').slice(1).join(' ') || '',
                    appliedAt: item.appliedAt || item.createdAt || new Date().toISOString(),
                })),
                meta: {
                    total: data.total || 0,
                    page: data.page || 1,
                    limit: data.limit || 50,
                    totalPages: data.totalPages || 0,
                },
            };
        }
        catch (err) {
            this.logger.error(`CMS getApplications failed: ${err.message}`);
            throw err;
        }
    }
    async getMemberships(params) {
        try {
            const url = `${this.client.defaults.baseURL}/memberships`;
            this.logger.log(`Fetching from CMS: ${url} (page: ${params?.page || 1}, limit: ${params?.limit || 50}, search: ${params?.search}, status: ${params?.status})...`);
            const headers = await this.authHeaders();
            const { data } = await this.client.get('/memberships', {
                headers,
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 50,
                    search: params?.search,
                    status: params?.status === 'all' ? undefined : params?.status
                },
            });
            this.logger.log(`Found ${data.total || 0} memberships at /memberships.`);
            return {
                data: (data.data || []).map((item) => ({
                    ...item,
                    firstName: item.firstName || item.name?.split(' ')[0] || '',
                    lastName: item.lastName || item.name?.split(' ').slice(1).join(' ') || '',
                })),
                meta: {
                    total: data.total || 0,
                    page: data.page || 1,
                    limit: data.limit || 50,
                    totalPages: data.totalPages || 0,
                },
            };
        }
        catch (err) {
            this.logger.error(`CMS getMemberships failed: ${err.message}`);
            throw err;
        }
    }
    async getApplicationById(id) {
        try {
            const headers = await this.authHeaders();
            const { data } = await this.client.get(`/memberships/${id}`, { headers });
            return data;
        }
        catch (err) {
            this.logger.error(`CMS getApplicationById(${id}) failed: ${err.message}`);
            throw err;
        }
    }
    async getMembershipById(id) {
        try {
            const headers = await this.authHeaders();
            const { data } = await this.client.get(`/memberships/${id}`, { headers });
            return data;
        }
        catch (err) {
            this.logger.error(`CMS getMembershipById(${id}) failed: ${err.message}`);
            throw err;
        }
    }
    async importApplication(id, type = 'membership') {
        const application = type === 'admission'
            ? await this.client.get(`/admissions/${id}`, { headers: await this.authHeaders() }).then(r => r.data)
            : await this.getMembershipById(id);
        if (!application)
            throw new common_1.NotFoundException(`${type} not found in CMS`);
        if (!application.email) {
            throw new common_1.BadRequestException('Application is missing an email address');
        }
        const email = application.email.toLowerCase();
        const existing = await this.userModel.findOne({ email });
        if (existing) {
            throw new common_1.ConflictException(`User with email ${email} already exists`);
        }
        let firstName = application.firstName || application.name?.split(' ')[0] || 'Member';
        let lastName = application.lastName || application.name?.split(' ').slice(1).join(' ') || 'User';
        const placeholderPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 12);
        const user = await this.userModel.create({
            firstName,
            lastName,
            email,
            password: placeholderPassword,
            phone: application.phone || '',
            institution: application.institution || application.organization || '',
            status: user_schema_1.UserStatus.ACTIVE,
            role: user_schema_1.UserRole.MEMBER,
            mustChangePassword: true,
            isFirstLogin: true,
        });
        const authResult = await this.authService.sendTemporaryPassword(user._id.toString());
        return {
            success: true,
            userId: user._id,
            email: user.email,
            tempPassword: authResult.tempPassword,
        };
    }
    async getEvents(params) {
        try {
            const { data } = await this.client.get('/events', {
                params: { page: params?.page || 1, limit: params?.limit || 20 },
            });
            return {
                data: data.data || data.events || [],
                meta: {
                    total: data.total || 0,
                    page: data.page || 1,
                    limit: data.limit || 20,
                    totalPages: data.totalPages || 0,
                },
            };
        }
        catch (err) {
            this.logger.error(`CMS getEvents failed: ${err.message}`);
            return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
        }
    }
    async getEventsForUser(email) {
        try {
            const { data } = await this.client.get('/events', {
                params: { attendeeEmail: email, limit: 50 },
            });
            return data.events || data.data || [];
        }
        catch (err) {
            this.logger.warn(`CMS getEventsForUser(${email}) failed: ${err.message}`);
            return [];
        }
    }
    async getBanners() {
        try {
            const { data } = await this.client.get('/carousel');
            return data;
        }
        catch (err) {
            this.logger.warn(`CMS getBanners failed: ${err.message}`);
            return [];
        }
    }
    async getResources(params) {
        try {
            const { data } = await this.client.get('/downloadable-resources-public', {
                params: { page: params?.page || 1, limit: params?.limit || 20 },
            });
            return {
                data: data.data || [],
                meta: {
                    total: data.total || 0,
                    page: data.page || 1,
                    limit: data.limit || 20,
                    totalPages: data.totalPages || 0,
                },
            };
        }
        catch (err) {
            this.logger.warn(`CMS getResources failed: ${err.message}`);
            return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
        }
    }
    async getBlogPosts(params) {
        try {
            const { data } = await this.client.get('/blog', { params });
            return {
                data: data.data || [],
                meta: {
                    total: data.total || 0,
                    page: data.page || 1,
                    limit: params?.limit || 10,
                    totalPages: data.totalPages || 0,
                },
            };
        }
        catch (err) {
            this.logger.warn(`CMS getBlogPosts failed: ${err.message}`);
            return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
        }
    }
};
exports.CmsBridgeService = CmsBridgeService;
exports.CmsBridgeService = CmsBridgeService = CmsBridgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        auth_service_1.AuthService])
], CmsBridgeService);
//# sourceMappingURL=cms-bridge.service.js.map