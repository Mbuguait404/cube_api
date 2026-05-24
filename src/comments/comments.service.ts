import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Comment, CommentDocument, CommentTargetType } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/comment.dto';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { DailyReport, DailyReportDocument } from '../daily-reports/schemas/daily-report.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(DailyReport.name) private reportModel: Model<DailyReportDocument>,
    private eventEmitter: EventEmitter2,
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

    const comment = await this.commentModel.create(data);

    // Fetch target details for notifications
    try {
      const populatedComment = await comment.populate('author', 'firstName lastName');
      const authorName = populatedComment.author
        ? `${(populatedComment.author as any).firstName} ${(populatedComment.author as any).lastName}`
        : 'A Member';

      if (dto.targetType === CommentTargetType.TASK) {
        const task = await this.taskModel.findById(dto.targetId);
        if (task) {
          this.eventEmitter.emit('comment.created', {
            comment: populatedComment,
            targetType: 'task',
            targetTitle: task.title,
            taskAssigneeIds: task.assignees.map((id) => id.toString()),
            recipientId: task.createdBy?.toString(),
            authorName,
          });
        }
      } else if (dto.targetType === CommentTargetType.DAILY_REPORT) {
        const report = await this.reportModel.findById(dto.targetId);
        if (report) {
          const formattedDate = new Date(report.date).toLocaleDateString();
          this.eventEmitter.emit('comment.created', {
            comment: populatedComment,
            targetType: 'daily report',
            targetTitle: `Daily Report of ${formattedDate}`,
            recipientId: report.author?.toString(),
            authorName,
          });
        }
      }
    } catch (err) {
      console.error('Failed to emit comment notification:', err);
    }

    return comment;
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
