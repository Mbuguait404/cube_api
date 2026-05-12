import { AnnouncementsService } from './announcements.service';
import type { UserDocument } from '../users/schemas/user.schema';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    getMyAnnouncements(user: UserDocument): Promise<import("./schemas/announcement.schema").AnnouncementDocument[]>;
}
