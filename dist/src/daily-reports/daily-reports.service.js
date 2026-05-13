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
exports.DailyReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const daily_report_schema_1 = require("./schemas/daily-report.schema");
function normalisedDate(dateStr) {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
}
let DailyReportsService = class DailyReportsService {
    reportModel;
    constructor(reportModel) {
        this.reportModel = reportModel;
    }
    async create(dto, authorId) {
        const date = normalisedDate(dto.date);
        const existing = await this.reportModel.findOne({
            author: new mongoose_2.Types.ObjectId(authorId),
            project: new mongoose_2.Types.ObjectId(dto.projectId),
            date,
        });
        if (existing) {
            throw new common_1.ConflictException('You have already submitted a report for this project today. Use PATCH to update it.');
        }
        const data = {
            ...dto,
            project: new mongoose_2.Types.ObjectId(dto.projectId),
            author: new mongoose_2.Types.ObjectId(authorId),
            date,
        };
        if (dto.tasksWorkedOn)
            data.tasksWorkedOn = dto.tasksWorkedOn.map((t) => new mongoose_2.Types.ObjectId(t));
        return this.reportModel.create(data);
    }
    async findByAuthor(authorId) {
        return this.reportModel
            .find({ author: new mongoose_2.Types.ObjectId(authorId) })
            .populate('project', 'title coverColor')
            .populate('tasksWorkedOn', 'title status')
            .sort({ date: -1 })
            .exec();
    }
    async findAll(filters = {}) {
        const query = {};
        if (filters.projectId)
            query.project = new mongoose_2.Types.ObjectId(filters.projectId);
        if (filters.authorId)
            query.author = new mongoose_2.Types.ObjectId(filters.authorId);
        if (filters.status)
            query.status = filters.status;
        if (filters.from || filters.to) {
            query.date = {};
            if (filters.from)
                query.date.$gte = normalisedDate(filters.from);
            if (filters.to)
                query.date.$lte = normalisedDate(filters.to);
        }
        return this.reportModel
            .find(query)
            .populate('author', 'firstName lastName email profilePhoto')
            .populate('project', 'title coverColor')
            .populate('tasksWorkedOn', 'title status')
            .sort({ date: -1 })
            .exec();
    }
    async findById(id) {
        const report = await this.reportModel
            .findById(id)
            .populate('author', 'firstName lastName email profilePhoto designation')
            .populate('project', 'title coverColor')
            .populate('tasksWorkedOn', 'title status priority');
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return report;
    }
    async update(id, dto, userId) {
        const report = await this.reportModel.findById(id);
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        if (report.author.toString() !== userId)
            throw new common_1.ForbiddenException('Cannot edit another member\'s report');
        if (report.status === daily_report_schema_1.ReportStatus.SUBMITTED)
            throw new common_1.ForbiddenException('Submitted reports cannot be edited');
        const updates = { ...dto };
        if (dto.tasksWorkedOn)
            updates.tasksWorkedOn = dto.tasksWorkedOn.map((t) => new mongoose_2.Types.ObjectId(t));
        const updatedReport = await this.reportModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedReport)
            throw new common_1.NotFoundException('Report not found');
        return updatedReport;
    }
    async delete(id) {
        const report = await this.reportModel.findByIdAndDelete(id);
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return { message: 'Report deleted' };
    }
};
exports.DailyReportsService = DailyReportsService;
exports.DailyReportsService = DailyReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(daily_report_schema_1.DailyReport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DailyReportsService);
//# sourceMappingURL=daily-reports.service.js.map