import { Document, Types } from 'mongoose';
export type DailyReportDocument = DailyReport & Document;
export declare enum ReportMood {
    GREAT = "great",
    GOOD = "good",
    NEUTRAL = "neutral",
    STRESSED = "stressed"
}
export declare enum ReportStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted"
}
export declare class DailyReport {
    project: Types.ObjectId;
    author: Types.ObjectId;
    date: Date;
    accomplishments: string;
    challenges: string;
    nextSteps: string;
    tasksWorkedOn: Types.ObjectId[];
    hoursLogged: number;
    mood: ReportMood;
    status: ReportStatus;
}
export declare const DailyReportSchema: import("mongoose").Schema<DailyReport, import("mongoose").Model<DailyReport, any, any, any, any, any, DailyReport>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DailyReport, Document<unknown, {}, DailyReport, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    project?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    author?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    accomplishments?: import("mongoose").SchemaDefinitionProperty<string, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    challenges?: import("mongoose").SchemaDefinitionProperty<string, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nextSteps?: import("mongoose").SchemaDefinitionProperty<string, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tasksWorkedOn?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hoursLogged?: import("mongoose").SchemaDefinitionProperty<number, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mood?: import("mongoose").SchemaDefinitionProperty<ReportMood, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ReportStatus, DailyReport, Document<unknown, {}, DailyReport, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DailyReport & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DailyReport>;
