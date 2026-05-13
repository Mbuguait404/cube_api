import { Model } from 'mongoose';
import { ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto, AddProjectMembersDto } from './dto/project.dto';
export declare class ProjectsService {
    private projectModel;
    constructor(projectModel: Model<ProjectDocument>);
    create(dto: CreateProjectDto, createdBy: string): Promise<ProjectDocument>;
    findAll(filters?: {
        status?: string;
        priority?: string;
        programId?: string;
        memberId?: string;
    }): Promise<ProjectDocument[]>;
    findById(id: string): Promise<ProjectDocument>;
    findByIdForMember(id: string, userId: string): Promise<ProjectDocument>;
    findByMember(userId: string): Promise<ProjectDocument[]>;
    update(id: string, dto: UpdateProjectDto): Promise<ProjectDocument>;
    delete(id: string): Promise<{
        message: string;
    }>;
    addMembers(id: string, dto: AddProjectMembersDto): Promise<ProjectDocument>;
    removeMember(projectId: string, userId: string): Promise<ProjectDocument>;
    isMember(projectId: string, userId: string): Promise<boolean>;
}
