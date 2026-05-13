import { Document, Types } from 'mongoose';
export type ProgramDocument = Program & Document;
export declare enum ProgramStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    COMPLETED = "completed",
    ARCHIVED = "archived"
}
export declare class Program {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: ProgramStatus;
    createdBy: Types.ObjectId;
    members: Types.ObjectId[];
}
export declare const ProgramSchema: import("mongoose").Schema<Program, import("mongoose").Model<Program, any, any, any, any, any, Program>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Program, Document<unknown, {}, Program, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Program, Document<unknown, {}, Program, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Program, Document<unknown, {}, Program, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, Program, Document<unknown, {}, Program, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, Program, Document<unknown, {}, Program, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ProgramStatus, Program, Document<unknown, {}, Program, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Program, Document<unknown, {}, Program, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    members?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Program, Document<unknown, {}, Program, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Program & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Program>;
