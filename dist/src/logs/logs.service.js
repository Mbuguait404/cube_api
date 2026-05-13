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
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const log_schema_1 = require("./schemas/log.schema");
let LogsService = class LogsService {
    logModel;
    constructor(logModel) {
        this.logModel = logModel;
    }
    async create(logData) {
        const newLog = new this.logModel(logData);
        return newLog.save();
    }
    async findAll(query = {}, options = {}) {
        const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
        const filters = {};
        if (query.method)
            filters.method = query.method;
        if (query.statusCode)
            filters.statusCode = parseInt(query.statusCode);
        if (query.url)
            filters.url = { $regex: query.url, $options: 'i' };
        if (query.userEmail)
            filters.userEmail = { $regex: query.userEmail, $options: 'i' };
        if (query.startDate && query.endDate) {
            filters.createdAt = {
                $gte: new Date(query.startDate),
                $lte: new Date(query.endDate),
            };
        }
        const [items, total] = await Promise.all([
            this.logModel.find(filters).sort(sort).skip(skip).limit(limit).exec(),
            this.logModel.countDocuments(filters).exec(),
        ]);
        return { items, total };
    }
    async findOne(id) {
        return this.logModel.findById(id).exec();
    }
    async clearLogs() {
        await this.logModel.deleteMany({}).exec();
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(log_schema_1.Log.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LogsService);
//# sourceMappingURL=logs.service.js.map