import { Model } from 'mongoose';
import { BadgeDocument, BadgeTrigger } from './schemas/badge.schema';
import { CreateBadgeDto } from './dto/create-badge.dto';
export declare class BadgesService {
    private badgeModel;
    constructor(badgeModel: Model<BadgeDocument>);
    create(dto: CreateBadgeDto): Promise<BadgeDocument>;
    findAll(): Promise<BadgeDocument[]>;
    findById(id: string): Promise<BadgeDocument>;
    findByTrigger(trigger: BadgeTrigger): Promise<BadgeDocument[]>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
