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
exports.CreateCommentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const comment_schema_1 = require("../schemas/comment.schema");
class CreateCommentDto {
    targetType;
    targetId;
    content;
    mentions;
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: comment_schema_1.CommentTargetType }),
    (0, class_validator_1.IsEnum)(comment_schema_1.CommentTargetType),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "targetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the Task or DailyReport' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "targetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Great progress @John, keep it up!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'User IDs mentioned via @' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateCommentDto.prototype, "mentions", void 0);
//# sourceMappingURL=comment.dto.js.map