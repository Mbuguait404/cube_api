import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare enum UserRole {
    SUPER_ADMIN = "SuperAdmin",
    ADMIN = "Admin",
    MEMBER = "Member"
}
export declare enum UserStatus {
    PENDING = "pending",
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    institution: string;
    designation: string;
    profilePhoto: string;
    address: {
        street?: string;
        city?: string;
        country?: string;
        postalCode?: string;
    };
    role: UserRole;
    status: UserStatus;
    isFirstLogin: boolean;
    mustChangePassword: boolean;
    tempPasswordExpiry: Date;
    cmsApplicationId: string;
    communities: Types.ObjectId[];
    badges: Types.ObjectId[];
    profileCompletion: number;
    refreshToken: string;
    extendedProfile: {
        bio?: string;
        currentRole?: string;
        yearsOfExperience?: number;
        openTo?: string[];
        primarySkillAreas?: string[];
        techStack?: string[];
        skillProficiency?: {
            skill?: string;
            level?: string;
        }[];
        softSkills?: string[];
        highestQualification?: string;
        fieldOfStudy?: string;
        institutionName?: string;
        graduationYear?: number;
        certifications?: {
            name?: string;
            issuer?: string;
            year?: number;
        }[];
        workHistory?: {
            employer?: string;
            role?: string;
            industry?: string;
            startDate?: string;
            endDate?: string;
            description?: string;
        }[];
        startupExperience?: {
            projectName?: string;
            role?: string;
            stage?: string;
            industry?: string;
            description?: string;
        }[];
        employmentStatus?: string;
        industrySectors?: string[];
        areasOfInterest?: string[];
        lookingForFromHub?: string[];
        shortTermGoal?: string;
        longTermGoal?: string;
        availabilityHoursPerWeek?: number;
        linkedinUrl?: string;
        githubUrl?: string;
        portfolioUrl?: string;
        twitterHandle?: string;
        behanceDribbbleUrl?: string;
        youtubeOrPodcastUrl?: string;
        otherLinks?: {
            label?: string;
            url?: string;
        }[];
        startupName?: string;
        startupStage?: string;
        startupIndustry?: string;
        startupDescription?: string;
        startupTeamSize?: number;
        startupLookingFor?: string[];
        startupWebsite?: string;
        mentorAreas?: string[];
        preferredMenteeType?: string[];
        mentoringFormat?: string[];
        mentorAvailabilityHrsPerMonth?: number;
        hasMentoredBefore?: boolean;
        previousMentoringDescription?: string;
        profileVisibility?: 'Public' | 'Hub members only' | 'Private';
        optInFeatured?: boolean;
        optInRecommendations?: boolean;
        preferredCommunicationChannel?: 'Email' | 'WhatsApp' | 'Platform DM';
        notificationPreferences?: {
            email?: boolean;
            whatsapp?: boolean;
            platformDm?: boolean;
        };
    };
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, any, any, User>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, User, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    firstName?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    institution?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    designation?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    profilePhoto?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<{
        street?: string;
        city?: string;
        country?: string;
        postalCode?: string;
    }, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<UserRole, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<UserStatus, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isFirstLogin?: import("mongoose").SchemaDefinitionProperty<boolean, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mustChangePassword?: import("mongoose").SchemaDefinitionProperty<boolean, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tempPasswordExpiry?: import("mongoose").SchemaDefinitionProperty<Date, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cmsApplicationId?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    communities?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    badges?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    profileCompletion?: import("mongoose").SchemaDefinitionProperty<number, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    refreshToken?: import("mongoose").SchemaDefinitionProperty<string, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    extendedProfile?: import("mongoose").SchemaDefinitionProperty<{
        bio?: string;
        currentRole?: string;
        yearsOfExperience?: number;
        openTo?: string[];
        primarySkillAreas?: string[];
        techStack?: string[];
        skillProficiency?: {
            skill?: string;
            level?: string;
        }[];
        softSkills?: string[];
        highestQualification?: string;
        fieldOfStudy?: string;
        institutionName?: string;
        graduationYear?: number;
        certifications?: {
            name?: string;
            issuer?: string;
            year?: number;
        }[];
        workHistory?: {
            employer?: string;
            role?: string;
            industry?: string;
            startDate?: string;
            endDate?: string;
            description?: string;
        }[];
        startupExperience?: {
            projectName?: string;
            role?: string;
            stage?: string;
            industry?: string;
            description?: string;
        }[];
        employmentStatus?: string;
        industrySectors?: string[];
        areasOfInterest?: string[];
        lookingForFromHub?: string[];
        shortTermGoal?: string;
        longTermGoal?: string;
        availabilityHoursPerWeek?: number;
        linkedinUrl?: string;
        githubUrl?: string;
        portfolioUrl?: string;
        twitterHandle?: string;
        behanceDribbbleUrl?: string;
        youtubeOrPodcastUrl?: string;
        otherLinks?: {
            label?: string;
            url?: string;
        }[];
        startupName?: string;
        startupStage?: string;
        startupIndustry?: string;
        startupDescription?: string;
        startupTeamSize?: number;
        startupLookingFor?: string[];
        startupWebsite?: string;
        mentorAreas?: string[];
        preferredMenteeType?: string[];
        mentoringFormat?: string[];
        mentorAvailabilityHrsPerMonth?: number;
        hasMentoredBefore?: boolean;
        previousMentoringDescription?: string;
        profileVisibility?: "Public" | "Hub members only" | "Private";
        optInFeatured?: boolean;
        optInRecommendations?: boolean;
        preferredCommunicationChannel?: "Email" | "WhatsApp" | "Platform DM";
        notificationPreferences?: {
            email?: boolean;
            whatsapp?: boolean;
            platformDm?: boolean;
        };
    }, User, Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, User>;
