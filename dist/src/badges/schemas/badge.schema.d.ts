import { Document } from 'mongoose';
export type BadgeDocument = Badge & Document;
export declare enum BadgeTrigger {
    MANUAL = "manual",
    INNOVATION_CHALLENGE = "innovation_challenge_completion",
    PROFILE_COMPLETE = "profile_complete",
    FIRST_LOGIN = "first_login"
}
export declare class Badge {
    name: string;
    description: string;
    iconUrl: string;
    color: string;
    trigger: BadgeTrigger;
    isActive: boolean;
}
export declare const BadgeSchema: import("mongoose").Schema<Badge, import("mongoose").Model<Badge, any, any, any, any, any, Badge>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Badge, Document<unknown, {}, Badge, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Badge & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Badge, Document<unknown, {}, Badge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Badge & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Badge, Document<unknown, {}, Badge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Badge & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    iconUrl?: import("mongoose").SchemaDefinitionProperty<string, Badge, Document<unknown, {}, Badge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Badge & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    color?: import("mongoose").SchemaDefinitionProperty<string, Badge, Document<unknown, {}, Badge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Badge & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trigger?: import("mongoose").SchemaDefinitionProperty<BadgeTrigger, Badge, Document<unknown, {}, Badge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Badge & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Badge, Document<unknown, {}, Badge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Badge & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Badge>;
