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
var WebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("../users/schemas/user.schema");
let WebhooksController = WebhooksController_1 = class WebhooksController {
    config;
    userModel;
    logger = new common_1.Logger(WebhooksController_1.name);
    constructor(config, userModel) {
        this.config = config;
        this.userModel = userModel;
    }
    async receiveCmcApplication(secret, payload) {
        const expected = this.config.get('CMC_WEBHOOK_SECRET');
        if (expected && secret !== expected) {
            throw new common_1.UnauthorizedException('Invalid webhook secret');
        }
        this.logger.log(`CMC application received: ${payload?.email || 'unknown'}`);
        const email = payload?.email?.toLowerCase()?.trim();
        if (!email) {
            this.logger.warn('CMC webhook payload missing email — skipped');
            return { received: true, created: false };
        }
        const existing = await this.userModel.findOne({ email });
        if (!existing) {
            await this.userModel.create({
                firstName: payload.firstName || payload.first_name || 'Applicant',
                lastName: payload.lastName || payload.last_name || '',
                email,
                phone: payload.phone || '',
                institution: payload.institution || payload.organization || '',
                designation: payload.designation || payload.role || '',
                password: await bcrypt.hash('PENDING_APPROVAL', 12),
                status: user_schema_1.UserStatus.PENDING,
                mustChangePassword: true,
                cmsApplicationId: payload._id || payload.id || null,
            });
            this.logger.log(`New applicant created: ${email}`);
            return { received: true, created: true };
        }
        this.logger.log(`Applicant already exists: ${email} — skipped`);
        return { received: true, created: false, existing: true };
    }
    async receiveUniflowStatus(payload) {
        this.logger.log(`Uniflow status update: ${payload?.status} for ${payload?.recipient}`);
        return { received: true };
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('cmc/applications'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'CMC webhook — receives new application payloads',
    }),
    __param(0, (0, common_1.Headers)('x-cmc-secret')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "receiveCmcApplication", null);
__decorate([
    (0, common_1.Post)('uniflow/status'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Uniflow webhook — email delivery status updates' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "receiveUniflowStatus", null);
exports.WebhooksController = WebhooksController = WebhooksController_1 = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map