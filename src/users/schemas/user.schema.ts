import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  institution: string;

  @Prop()
  designation: string;

  @Prop()
  profilePhoto: string;

  @Prop({ type: Object })
  address: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };

  @Prop({ type: String, enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop({ default: false })
  isFirstLogin: boolean;

  @Prop({ default: false })
  mustChangePassword: boolean;

  @Prop()
  tempPasswordExpiry: Date;

  /** CMS application ID for cross-reference */
  @Prop()
  cmsApplicationId: string;

  /** Communities this member belongs to */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Community' }] })
  communities: Types.ObjectId[];

  /** Badges earned */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Badge' }] })
  badges: Types.ObjectId[];

  /** Cached profile completion % — updated on profile changes */
  @Prop({ default: 0 })
  profileCompletion: number;

  /** Refresh token hash stored server-side */
  @Prop({ select: false })
  refreshToken: string;

  // ─── Section 2: Extended Profile ───────────────────────────────────────────
  /**
   * Rich profile data. Stored as a flexible Object so no migration is needed
   * for existing users — all sub-fields are optional.
   */
  @Prop({ type: Object, default: {} })
  extendedProfile: {
    // 2a. Professional Identity
    bio?: string;
    currentRole?: string;
    yearsOfExperience?: number;
    /** 'Mentoring' | 'Being mentored' | 'Collaboration' | 'Hiring' | 'Being hired' | 'Co-founding' | 'Volunteering' */
    openTo?: string[];

    // 2b. Skills & Expertise
    /** 'Web Dev' | 'AI/ML' | 'Cybersecurity' | 'Data' | 'Design' | 'Product' | 'Business' | 'Finance' | 'Hardware' | ... */
    primarySkillAreas?: string[];
    techStack?: string[];
    /** { skill: string, level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[] */
    skillProficiency?: { skill?: string; level?: string }[];
    softSkills?: string[];

    // 2c. Education
    highestQualification?: string;
    fieldOfStudy?: string;
    institutionName?: string;
    graduationYear?: number;
    certifications?: { name?: string; issuer?: string; year?: number }[];

    // 2d. Work & Startup Experience
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
    /** 'Employed' | 'In a startup' | 'Both' | 'Neither' */
    employmentStatus?: string;
    /** 'Fintech' | 'Healthtech' | 'Agritech' | 'Edtech' | 'SaaS' | 'Government' | 'NGO' | ... */
    industrySectors?: string[];

    // 2e. Interests & Goals
    /** 'AI' | 'Blockchain' | 'IoT' | 'Cybersecurity' | 'Climate Tech' | 'Space Tech' | ... */
    areasOfInterest?: string[];
    /** 'Programs' | 'Events' | 'Networking' | 'Funding' | 'Mentorship' | 'Jobs' | 'Partnerships' */
    lookingForFromHub?: string[];
    shortTermGoal?: string;
    longTermGoal?: string;
    availabilityHoursPerWeek?: number;

    // 2f. Online Presence & Portfolio
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    twitterHandle?: string;
    behanceDribbbleUrl?: string;
    youtubeOrPodcastUrl?: string;
    otherLinks?: { label?: string; url?: string }[];

    // 2g. Startup / Venture Details (conditional — for Founders)
    startupName?: string;
    /** 'Idea' | 'MVP' | 'Early traction' | 'Growth' | 'Scaling' */
    startupStage?: string;
    startupIndustry?: string;
    startupDescription?: string;
    startupTeamSize?: number;
    startupLookingFor?: string[];
    startupWebsite?: string;

    // 2h. Mentor Profile (conditional — openTo includes Mentoring)
    mentorAreas?: string[];
    /** 'Student' | 'Early-career' | 'Founder' | ... */
    preferredMenteeType?: string[];
    /** '1-on-1' | 'Group sessions' | 'Online' | 'In-person' */
    mentoringFormat?: string[];
    mentorAvailabilityHrsPerMonth?: number;
    hasMentoredBefore?: boolean;
    previousMentoringDescription?: string;

    // 2i. Preferences & Visibility
    /** 'Public' | 'Hub members only' | 'Private' */
    profileVisibility?: 'Public' | 'Hub members only' | 'Private';
    optInFeatured?: boolean;
    optInRecommendations?: boolean;
    /** 'Email' | 'WhatsApp' | 'Platform DM' */
    preferredCommunicationChannel?: 'Email' | 'WhatsApp' | 'Platform DM';
    notificationPreferences?: {
      email?: boolean;
      whatsapp?: boolean;
      platformDm?: boolean;
    };
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual: full name
UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});
