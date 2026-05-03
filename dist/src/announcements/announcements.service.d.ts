import { Model, Types } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
export declare class AnnouncementsService {
    private announcementModel;
    constructor(announcementModel: Model<AnnouncementDocument>);
    create(dto: CreateAnnouncementDto, createdById: string): Promise<AnnouncementDocument>;
    findAll(): Promise<AnnouncementDocument[]>;
    getForCommunities(communityIds: Types.ObjectId[]): Promise<AnnouncementDocument[]>;
    delete(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<import("mongoose").Document<unknown, {}, AnnouncementDocument, {}, import("mongoose").DefaultSchemaOptions> & Announcement & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
