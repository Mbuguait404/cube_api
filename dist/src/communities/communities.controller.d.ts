import { CommunitiesService } from './communities.service';
export declare class CommunitiesController {
    private readonly communitiesService;
    constructor(communitiesService: CommunitiesService);
    findAll(): Promise<import("./schemas/community.schema").CommunityDocument[]>;
    findOne(id: string): Promise<import("./schemas/community.schema").CommunityDocument>;
}
