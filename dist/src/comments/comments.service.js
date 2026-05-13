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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
let CommentsService = class CommentsService {
    commentModel;
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async create(dto, authorId) {
        const data = {
            ...dto,
            author: new mongoose_2.Types.ObjectId(authorId),
            targetId: new mongoose_2.Types.ObjectId(dto.targetId),
        };
        if (dto.mentions)
            data.mentions = dto.mentions.map((m) => new mongoose_2.Types.ObjectId(m));
        return this.commentModel.create(data);
    }
    async findByTarget(targetType, targetId) {
        return this.commentModel
            .find({
            targetType,
            targetId: new mongoose_2.Types.ObjectId(targetId),
        })
            .populate('author', 'firstName lastName profilePhoto role')
            .populate('mentions', 'firstName lastName')
            .sort({ createdAt: 1 })
            .exec();
    }
    async delete(id, requesterId, isAdmin) {
        const comment = await this.commentModel.findById(id);
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const isAuthor = comment.author.toString() === requesterId;
        if (!isAuthor && !isAdmin)
            throw new common_1.ForbiddenException('You can only delete your own comments');
        await this.commentModel.findByIdAndDelete(id);
        return { message: 'Comment deleted' };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentsService);
//# sourceMappingURL=comments.service.js.map