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
exports.DailyReportSchema = exports.DailyReport = exports.ReportStatus = exports.ReportMood = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ReportMood;
(function (ReportMood) {
    ReportMood["GREAT"] = "great";
    ReportMood["GOOD"] = "good";
    ReportMood["NEUTRAL"] = "neutral";
    ReportMood["STRESSED"] = "stressed";
})(ReportMood || (exports.ReportMood = ReportMood = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["DRAFT"] = "draft";
    ReportStatus["SUBMITTED"] = "submitted";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
let DailyReport = class DailyReport {
    project;
    author;
    date;
    accomplishments;
    challenges;
    nextSteps;
    tasksWorkedOn;
    hoursLogged;
    mood;
    status;
};
exports.DailyReport = DailyReport;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DailyReport.prototype, "project", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DailyReport.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], DailyReport.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "accomplishments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "challenges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "nextSteps", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Task' }], default: [] }),
    __metadata("design:type", Array)
], DailyReport.prototype, "tasksWorkedOn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 24 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "hoursLogged", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ReportMood, default: ReportMood.GOOD }),
    __metadata("design:type", String)
], DailyReport.prototype, "mood", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ReportStatus, default: ReportStatus.DRAFT }),
    __metadata("design:type", String)
], DailyReport.prototype, "status", void 0);
exports.DailyReport = DailyReport = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DailyReport);
exports.DailyReportSchema = mongoose_1.SchemaFactory.createForClass(DailyReport);
exports.DailyReportSchema.index({ author: 1, project: 1, date: 1 }, { unique: true });
//# sourceMappingURL=daily-report.schema.js.map