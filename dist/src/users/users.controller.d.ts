import { UsersService } from './users.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private usersService;
    private announcementsService;
    constructor(usersService: UsersService, announcementsService: AnnouncementsService);
    getProfile(user: any): Promise<import("./schemas/user.schema").UserDocument>;
    updateProfile(user: any, dto: UpdateProfileDto): Promise<import("./schemas/user.schema").UserDocument | null>;
    getEvents(user: any): Promise<any>;
    getBadges(user: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getChannels(user: any): Promise<import("../announcements/schemas/announcement.schema").AnnouncementDocument[]>;
}
