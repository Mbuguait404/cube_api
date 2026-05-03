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
exports.BadgesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const badge_schema_1 = require("./schemas/badge.schema");
let BadgesService = class BadgesService {
    badgeModel;
    constructor(badgeModel) {
        this.badgeModel = badgeModel;
    }
    async create(dto) {
        return this.badgeModel.create(dto);
    }
    async findAll() {
        return this.badgeModel.find({ isActive: true }).sort({ name: 1 }).exec();
    }
    async findById(id) {
        const badge = await this.badgeModel.findById(id);
        if (!badge)
            throw new common_1.NotFoundException('Badge not found');
        return badge;
    }
    async findByTrigger(trigger) {
        return this.badgeModel.find({ trigger, isActive: true });
    }
    async delete(id) {
        await this.badgeModel.findByIdAndDelete(id);
        return { message: 'Badge deleted' };
    }
};
exports.BadgesService = BadgesService;
exports.BadgesService = BadgesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(badge_schema_1.Badge.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BadgesService);
//# sourceMappingURL=badges.service.js.map