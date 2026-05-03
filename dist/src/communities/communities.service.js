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
exports.CommunitiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const community_schema_1 = require("./schemas/community.schema");
let CommunitiesService = class CommunitiesService {
    communityModel;
    constructor(communityModel) {
        this.communityModel = communityModel;
    }
    async create(dto) {
        const existing = await this.communityModel.findOne({ tag: dto.tag });
        if (existing)
            throw new common_1.ConflictException(`Community with tag "${dto.tag}" already exists`);
        const slug = dto.name.toLowerCase().replace(/\s+/g, '-');
        return this.communityModel.create({ ...dto, slug });
    }
    async findAll() {
        return this.communityModel.find().sort({ name: 1 }).exec();
    }
    async findById(id) {
        const community = await this.communityModel.findById(id);
        if (!community)
            throw new common_1.NotFoundException('Community not found');
        return community;
    }
    async findByTag(tag) {
        return this.communityModel.findOne({ tag: tag.toLowerCase() });
    }
    async update(id, dto) {
        const community = await this.communityModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
        if (!community)
            throw new common_1.NotFoundException('Community not found');
        return community;
    }
    async delete(id) {
        const community = await this.communityModel.findByIdAndDelete(id);
        if (!community)
            throw new common_1.NotFoundException('Community not found');
        return { message: 'Community deleted' };
    }
    async incrementMemberCount(id, delta) {
        return this.communityModel.findByIdAndUpdate(id, {
            $inc: { memberCount: delta },
        });
    }
};
exports.CommunitiesService = CommunitiesService;
exports.CommunitiesService = CommunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(community_schema_1.Community.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommunitiesService);
//# sourceMappingURL=communities.service.js.map