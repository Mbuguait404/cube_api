import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddProjectMembersDto,
} from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(dto: CreateProjectDto, createdBy: string): Promise<ProjectDocument> {
    const { programId, teamLeadId, memberIds, ...rest } = dto;
    const data: any = { ...rest, createdBy };
    
    // Map frontend suffixed fields or original fields
    const members = memberIds || dto.members;
    const teamLead = teamLeadId || dto.teamLead;
    const program = programId || dto.program;

    if (members) data.members = members.map((m) => new Types.ObjectId(m));
    if (teamLead) data.teamLead = new Types.ObjectId(teamLead);
    if (program) data.program = new Types.ObjectId(program);
    
    return this.projectModel.create(data);
  }

  async findAll(filters: {
    status?: string;
    priority?: string;
    programId?: string;
    memberId?: string;
  } = {}): Promise<any[]> {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.programId) query.program = new Types.ObjectId(filters.programId);
    if (filters.memberId) query.members = new Types.ObjectId(filters.memberId);

    const projects = await this.projectModel
      .find(query)
      .populate('program', 'name status')
      .populate('teamLead', 'firstName lastName email profilePhoto')
      .populate('members', 'firstName lastName email profilePhoto designation')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Get task stats for each project
    const projectIds = projects.map(p => p._id);
    const taskStats = await this.projectModel.db.model('Task').aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
          }
        }
      }
    ]);

    const statsMap = new Map(taskStats.map(s => [s._id.toString(), s]));

    return projects.map(p => ({
      ...p,
      taskStats: statsMap.get(p._id.toString()) || { total: 0, completed: 0 }
    }));
  }

  async findById(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel
      .findById(id)
      .populate('program', 'name status startDate endDate')
      .populate('teamLead', 'firstName lastName email profilePhoto designation')
      .populate('members', 'firstName lastName email profilePhoto designation')
      .populate('createdBy', 'firstName lastName email');
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  /** Member-safe: only returns project if user is a member */
  async findByIdForMember(id: string, userId: string): Promise<ProjectDocument> {
    const project = await this.findById(id);
    const isMember = project.members.some(
      (m: any) => m._id?.toString() === userId || m.toString() === userId,
    );
    if (!isMember) throw new ForbiddenException('You are not a member of this project');
    return project;
  }

  async findByMember(userId: string): Promise<any[]> {
    const projects = await this.projectModel
      .find({ members: new Types.ObjectId(userId) })
      .populate('program', 'name')
      .populate('teamLead', 'firstName lastName profilePhoto')
      .select('title description status priority deadline coverColor tags')
      .sort({ deadline: 1 })
      .lean()
      .exec();

    const projectIds = projects.map(p => p._id);
    const taskStats = await this.projectModel.db.model('Task').aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
          }
        }
      }
    ]);

    const statsMap = new Map(taskStats.map(s => [s._id.toString(), s]));

    return projects.map(p => ({
      ...p,
      taskStats: statsMap.get(p._id.toString()) || { total: 0, completed: 0 }
    }));
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectDocument> {
    const { programId, teamLeadId, memberIds, ...rest } = dto;
    const updateData: any = { ...rest };

    const members = memberIds || dto.members;
    const teamLead = teamLeadId || dto.teamLead;
    const program = programId || dto.program;

    if (members) updateData.members = members.map((m) => new Types.ObjectId(m));
    if (teamLead) updateData.teamLead = new Types.ObjectId(teamLead);
    if (program) updateData.program = new Types.ObjectId(program);

    const project = await this.projectModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async delete(id: string): Promise<{ message: string }> {
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) throw new NotFoundException('Project not found');
    return { message: 'Project deleted' };
  }

  async addMembers(id: string, dto: AddProjectMembersDto): Promise<ProjectDocument> {
    const memberObjectIds = dto.memberIds.map((m) => new Types.ObjectId(m));
    const project = await this.projectModel.findByIdAndUpdate(
      id,
      { $addToSet: { members: { $each: memberObjectIds } } },
      { new: true },
    ).populate('members', 'firstName lastName email profilePhoto designation');
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async removeMember(projectId: string, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findByIdAndUpdate(
      projectId,
      { $pull: { members: new Types.ObjectId(userId) } },
      { new: true },
    ).populate('members', 'firstName lastName email profilePhoto designation');
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async isMember(projectId: string, userId: string): Promise<boolean> {
    const project = await this.projectModel.findById(projectId).select('members');
    if (!project) return false;
    return project.members.some((m) => m.toString() === userId);
  }
}
