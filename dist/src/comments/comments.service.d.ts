import { Model } from 'mongoose';
import { CommentDocument, CommentTargetType } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/comment.dto';
export declare class CommentsService {
    private commentModel;
    constructor(commentModel: Model<CommentDocument>);
    create(dto: CreateCommentDto, authorId: string): Promise<CommentDocument>;
    findByTarget(targetType: CommentTargetType, targetId: string): Promise<CommentDocument[]>;
    delete(id: string, requesterId: string, isAdmin: boolean): Promise<{
        message: string;
    }>;
}
