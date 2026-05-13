import { BadgeTrigger } from '../schemas/badge.schema';
export declare class CreateBadgeDto {
    name: string;
    description?: string;
    iconUrl?: string;
    color?: string;
    trigger?: BadgeTrigger;
}
