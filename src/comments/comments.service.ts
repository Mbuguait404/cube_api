import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument, CommentTargetType } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(
    dto: CreateCommentDto,
    authorId: string,
  ): Promise<CommentDocument> {
    const data: any = {
      ...dto,
      author: new Types.ObjectId(authorId),
      targetId: new Types.ObjectId(dto.targetId),
    };
    if (dto.mentions)
      data.mentions = dto.mentions.map((m) => new Types.ObjectId(m));

    return this.commentModel.create(data);
  }

  async findByTarget(
    targetType: CommentTargetType,
    targetId: string,
  ): Promise<CommentDocument[]> {
    return this.commentModel
      .find({
        targetType,
        targetId: new Types.ObjectId(targetId),
      })
      .populate('author', 'firstName lastName profilePhoto role')
      .populate('mentions', 'firstName lastName')
      .sort({ createdAt: 1 })
      .exec();
  }

  async delete(id: string, requesterId: string, isAdmin: boolean): Promise<{ message: string }> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');

    const isAuthor = comment.author.toString() === requesterId;
    if (!isAuthor && !isAdmin)
      throw new ForbiddenException('You can only delete your own comments');

    await this.commentModel.findByIdAndDelete(id);
    return { message: 'Comment deleted' };
  }
}
