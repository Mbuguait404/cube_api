import { Document, Types } from 'mongoose';
export type LogDocument = Log & Document;
export declare class Log {
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    ip: string;
    userId: Types.ObjectId;
    userEmail: string;
    requestBody: any;
    requestParams: any;
    requestQuery: any;
    responseBody: any;
    userAgent: string;
    errorStack: string;
    errorMessage: string;
}
export declare const LogSchema: import("mongoose").Schema<Log, import("mongoose").Model<Log, any, any, any, any, any, Log>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Log, Document<unknown, {}, Log, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    method?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    statusCode?: import("mongoose").SchemaDefinitionProperty<number, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    duration?: import("mongoose").SchemaDefinitionProperty<number, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ip?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userEmail?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requestBody?: import("mongoose").SchemaDefinitionProperty<any, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requestParams?: import("mongoose").SchemaDefinitionProperty<any, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requestQuery?: import("mongoose").SchemaDefinitionProperty<any, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    responseBody?: import("mongoose").SchemaDefinitionProperty<any, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userAgent?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    errorStack?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    errorMessage?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Log>;
