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
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const program_schema_1 = require("./schemas/program.schema");
let ProgramsService = class ProgramsService {
    programModel;
    constructor(programModel) {
        this.programModel = programModel;
    }
    async create(dto, createdBy) {
        return this.programModel.create({ ...dto, createdBy });
    }
    async findAll() {
        return this.programModel
            .find()
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        const program = await this.programModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('members', 'firstName lastName email profilePhoto designation');
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        return program;
    }
    async update(id, dto) {
        const program = await this.programModel.findByIdAndUpdate(id, dto, { new: true });
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        return program;
    }
    async delete(id) {
        const program = await this.programModel.findByIdAndDelete(id);
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        return { message: 'Program deleted' };
    }
    async enrollMembers(id, dto) {
        const memberObjectIds = dto.memberIds.map((m) => new mongoose_2.Types.ObjectId(m));
        const program = await this.programModel.findByIdAndUpdate(id, { $addToSet: { members: { $each: memberObjectIds } } }, { new: true }).populate('members', 'firstName lastName email profilePhoto designation');
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        return program;
    }
    async removeMember(programId, userId) {
        const program = await this.programModel.findByIdAndUpdate(programId, { $pull: { members: new mongoose_2.Types.ObjectId(userId) } }, { new: true }).populate('members', 'firstName lastName email profilePhoto designation');
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        return program;
    }
    async findByMember(userId) {
        return this.programModel
            .find({ members: new mongoose_2.Types.ObjectId(userId) })
            .select('name description status startDate endDate')
            .exec();
    }
};
exports.ProgramsService = ProgramsService;
exports.ProgramsService = ProgramsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(program_schema_1.Program.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProgramsService);
//# sourceMappingURL=programs.service.js.map