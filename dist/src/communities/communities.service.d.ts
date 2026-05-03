import { Model } from 'mongoose';
import { Community, CommunityDocument } from './schemas/community.schema';
import { CreateCommunityDto } from './dto/create-community.dto';
export declare class CommunitiesService {
    private communityModel;
    constructor(communityModel: Model<CommunityDocument>);
    create(dto: CreateCommunityDto): Promise<CommunityDocument>;
    findAll(): Promise<CommunityDocument[]>;
    findById(id: string): Promise<CommunityDocument>;
    findByTag(tag: string): Promise<CommunityDocument | null>;
    update(id: string, dto: Partial<CreateCommunityDto>): Promise<import("mongoose").Document<unknown, {}, CommunityDocument, {}, import("mongoose").DefaultSchemaOptions> & Community & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    incrementMemberCount(id: string, delta: 1 | -1): Promise<(import("mongoose").Document<unknown, {}, CommunityDocument, {}, import("mongoose").DefaultSchemaOptions> & Community & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
