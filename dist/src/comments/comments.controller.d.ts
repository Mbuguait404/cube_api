import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { CommentTargetType } from './schemas/comment.schema';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(dto: CreateCommentDto, user: any): Promise<import("./schemas/comment.schema").CommentDocument>;
    findByTarget(targetType: CommentTargetType, targetId: string): Promise<import("./schemas/comment.schema").CommentDocument[]>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
