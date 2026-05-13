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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const logs_service_1 = require("../../logs/logs.service");
let LoggingInterceptor = class LoggingInterceptor {
    logsService;
    constructor(logsService) {
        this.logsService = logsService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, params, query, ip, user } = request;
        const userAgent = request.get('user-agent') || '';
        const startTime = Date.now();
        if (url.includes('/admin/logs')) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)((responseBody) => {
            const duration = Date.now() - startTime;
            const statusCode = context.switchToHttp().getResponse().statusCode;
            this.logsService.create({
                method,
                url,
                statusCode,
                duration,
                ip,
                userId: user?._id,
                userEmail: user?.email,
                requestBody: this.sanitizeData(body),
                requestParams: params,
                requestQuery: query,
                responseBody: this.sanitizeData(responseBody, true),
                userAgent,
            }).catch(err => console.error('Error saving log:', err));
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - startTime;
            const statusCode = error.status || 500;
            this.logsService.create({
                method,
                url,
                statusCode,
                duration,
                ip,
                userId: user?._id,
                userEmail: user?.email,
                requestBody: this.sanitizeData(body),
                requestParams: params,
                requestQuery: query,
                errorMessage: error.message,
                errorStack: error.stack,
                userAgent,
            }).catch(err => console.error('Error saving error log:', err));
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
    sanitizeData(data, isResponse = false) {
        if (!data)
            return data;
        let sanitized = JSON.parse(JSON.stringify(data));
        const sensitiveFields = ['password', 'token', 'refreshToken', 'accessToken', 'secret'];
        const removeSensitive = (obj) => {
            if (typeof obj !== 'object' || obj === null)
                return;
            for (const key in obj) {
                if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
                    obj[key] = '[REDACTED]';
                }
                else if (typeof obj[key] === 'object') {
                    removeSensitive(obj[key]);
                }
            }
        };
        removeSensitive(sanitized);
        const str = JSON.stringify(sanitized);
        if (str.length > 10000) {
            return {
                message: 'Data too large to log',
                truncated: true,
                size: str.length
            };
        }
        return sanitized;
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map