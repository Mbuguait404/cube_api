import { ProjectStatus, ProjectPriority } from '../schemas/project.schema';
export declare class CreateProjectDto {
    title: string;
    description?: string;
    program?: string;
    programId?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    deadline?: string;
    teamLead?: string;
    teamLeadId?: string;
    members?: string[];
    memberIds?: string[];
    tags?: string[];
    coverColor?: string;
}
export declare class UpdateProjectDto {
    title?: string;
    description?: string;
    program?: string;
    programId?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    deadline?: string;
    teamLead?: string;
    teamLeadId?: string;
    members?: string[];
    memberIds?: string[];
    tags?: string[];
    coverColor?: string;
}
export declare class AddProjectMembersDto {
    memberIds: string[];
}
