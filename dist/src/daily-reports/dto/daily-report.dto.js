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
exports.UpdateDailyReportDto = exports.CreateDailyReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const daily_report_schema_1 = require("../schemas/daily-report.schema");
class CreateDailyReportDto {
    projectId;
    date;
    accomplishments;
    challenges;
    nextSteps;
    tasksWorkedOn;
    hoursLogged;
    mood;
    status;
}
exports.CreateDailyReportDto = CreateDailyReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project ID this report is for' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateDailyReportDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-05-12',
        description: 'Defaults to today if omitted',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDailyReportDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDailyReportDto.prototype, "accomplishments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDailyReportDto.prototype, "challenges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDailyReportDto.prototype, "nextSteps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Task IDs worked on today' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateDailyReportDto.prototype, "tasksWorkedOn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 6, description: 'Hours logged (0–24)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], CreateDailyReportDto.prototype, "hoursLogged", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: daily_report_schema_1.ReportMood }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(daily_report_schema_1.ReportMood),
    __metadata("design:type", String)
], CreateDailyReportDto.prototype, "mood", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: daily_report_schema_1.ReportStatus, description: 'draft | submitted' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(daily_report_schema_1.ReportStatus),
    __metadata("design:type", String)
], CreateDailyReportDto.prototype, "status", void 0);
class UpdateDailyReportDto {
    accomplishments;
    challenges;
    nextSteps;
    tasksWorkedOn;
    hoursLogged;
    mood;
    status;
}
exports.UpdateDailyReportDto = UpdateDailyReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDailyReportDto.prototype, "accomplishments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDailyReportDto.prototype, "challenges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDailyReportDto.prototype, "nextSteps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], UpdateDailyReportDto.prototype, "tasksWorkedOn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], UpdateDailyReportDto.prototype, "hoursLogged", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: daily_report_schema_1.ReportMood }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(daily_report_schema_1.ReportMood),
    __metadata("design:type", String)
], UpdateDailyReportDto.prototype, "mood", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: daily_report_schema_1.ReportStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(daily_report_schema_1.ReportStatus),
    __metadata("design:type", String)
], UpdateDailyReportDto.prototype, "status", void 0);
//# sourceMappingURL=daily-report.dto.js.map