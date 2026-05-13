import { CommentTargetType } from '../schemas/comment.schema';
export declare class CreateCommentDto {
    targetType: CommentTargetType;
    targetId: string;
    content: string;
    mentions?: string[];
}
