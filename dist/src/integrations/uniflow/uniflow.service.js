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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UniflowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniflowService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let UniflowService = UniflowService_1 = class UniflowService {
    config;
    logger = new common_1.Logger(UniflowService_1.name);
    client;
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: config.get('UNIFLOW_BASE_URL'),
            headers: {
                'UNIFIED-API-Key': config.get('UNIFLOW_API_KEY'),
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
        });
    }
    async sendApprovalEmail(email, fullName, tempPassword) {
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:4200';
        return this.send({
            type: 'email',
            to: email,
            subject: '🎉 Welcome to The Cube — Your Account is Ready',
            message: this.buildApprovalEmailHtml(fullName, tempPassword, frontendUrl),
        });
    }
    async sendPasswordResetEmail(email, fullName, token) {
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:4200';
        return this.send({
            type: 'email',
            to: email,
            subject: 'The Cube — Password Reset Request',
            message: this.buildPasswordResetHtml(fullName, token, frontendUrl),
        });
    }
    async sendBulkEmail(recipients, subject, message) {
        const results = await Promise.allSettled(recipients.map((email) => this.send({ type: 'email', to: email, subject, message })));
        const sent = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;
        this.logger.log(`Bulk email: ${sent} sent, ${failed} failed`);
        return { sent, failed, total: recipients.length };
    }
    async sendSms(phone, message) {
        return this.send({ type: 'sms', to: phone, message });
    }
    async send(payload) {
        try {
            const { data } = await this.client.post('/notifications/send', {
                ...payload,
                attachments: [],
            });
            return data;
        }
        catch (err) {
            this.logger.error(`Uniflow send failed for ${payload.to}: ${err.message}`);
            throw err;
        }
    }
    buildApprovalEmailHtml(name, tempPassword, frontendUrl) {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Welcome to The Cube, ${name}! 🎉</h2>
        <p>Your membership application has been <strong>approved</strong>. Here are your login credentials:</p>
        <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p><strong>Temporary Password:</strong> <code style="background:#f0f0f0; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
        </div>
        <p style="color: #e55;">⚠ You will be required to change this password on your first login.</p>
        <a href="${frontendUrl}/login" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 12px;">
          Login to The Cube →
        </a>
        <p style="margin-top: 24px; color: #888; font-size: 12px;">This link expires in 48 hours. If you did not apply, please ignore this email.</p>
      </div>
    `;
    }
    buildPasswordResetHtml(name, token, frontendUrl) {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Password Reset — The Cube</h2>
        <p>Hi ${name}, use the link below to reset your password:</p>
        <a href="${frontendUrl}/reset-password?token=${token}" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 12px;">
          Reset Password →
        </a>
        <p style="margin-top: 24px; color: #888; font-size: 12px;">This link expires in 1 hour. If you didn't request this, please ignore.</p>
      </div>
    `;
    }
};
exports.UniflowService = UniflowService;
exports.UniflowService = UniflowService = UniflowService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UniflowService);
//# sourceMappingURL=uniflow.service.js.map