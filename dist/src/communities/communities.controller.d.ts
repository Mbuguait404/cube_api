import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
export declare class CommunitiesController {
    private readonly communitiesService;
    constructor(communitiesService: CommunitiesService);
    findAll(): Promise<import("./schemas/community.schema").CommunityDocument[]>;
    findOne(id: string): Promise<import("./schemas/community.schema").CommunityDocument>;
    create(dto: CreateCommunityDto): Promise<import("./schemas/community.schema").CommunityDocument>;
    update(id: string, dto: Partial<CreateCommunityDto>): Promise<import("mongoose").Document<unknown, {}, import("./schemas/community.schema").CommunityDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/community.schema").Community & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
