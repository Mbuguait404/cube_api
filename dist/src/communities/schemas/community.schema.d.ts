import { Document, Types } from 'mongoose';
export type CommunityDocument = Community & Document;
export declare class Community {
    name: string;
    description: string;
    slug: string;
    tag: string;
    isActive: boolean;
    memberCount: number;
}
export declare const CommunitySchema: import("mongoose").Schema<Community, import("mongoose").Model<Community, any, any, any, any, any, Community>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Community, Document<unknown, {}, Community, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Community & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Community, Document<unknown, {}, Community, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Community & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Community, Document<unknown, {}, Community, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Community & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Community, Document<unknown, {}, Community, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Community & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tag?: import("mongoose").SchemaDefinitionProperty<string, Community, Document<unknown, {}, Community, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Community & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Community, Document<unknown, {}, Community, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Community & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    memberCount?: import("mongoose").SchemaDefinitionProperty<number, Community, Document<unknown, {}, Community, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Community & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Community>;
