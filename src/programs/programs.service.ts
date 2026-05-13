import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Program, ProgramDocument } from './schemas/program.schema';
import { CreateProgramDto, UpdateProgramDto, EnrollMembersDto } from './dto/program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
  ) {}

  async create(dto: CreateProgramDto, createdBy: string): Promise<ProgramDocument> {
    return this.programModel.create({ ...dto, createdBy });
  }

  async findAll(): Promise<ProgramDocument[]> {
    return this.programModel
      .find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<ProgramDocument> {
    const program = await this.programModel
      .findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('members', 'firstName lastName email profilePhoto designation');
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async update(id: string, dto: UpdateProgramDto): Promise<ProgramDocument> {
    const program = await this.programModel.findByIdAndUpdate(id, dto, { new: true });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async delete(id: string): Promise<{ message: string }> {
    const program = await this.programModel.findByIdAndDelete(id);
    if (!program) throw new NotFoundException('Program not found');
    return { message: 'Program deleted' };
  }

  async enrollMembers(id: string, dto: EnrollMembersDto): Promise<ProgramDocument> {
    const memberObjectIds = dto.memberIds.map((m) => new Types.ObjectId(m));
    const program = await this.programModel.findByIdAndUpdate(
      id,
      { $addToSet: { members: { $each: memberObjectIds } } },
      { new: true },
    ).populate('members', 'firstName lastName email profilePhoto designation');
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async removeMember(programId: string, userId: string): Promise<ProgramDocument> {
    const program = await this.programModel.findByIdAndUpdate(
      programId,
      { $pull: { members: new Types.ObjectId(userId) } },
      { new: true },
    ).populate('members', 'firstName lastName email profilePhoto designation');
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  /** Returns all programs a specific user is enrolled in */
  async findByMember(userId: string): Promise<ProgramDocument[]> {
    return this.programModel
      .find({ members: new Types.ObjectId(userId) })
      .select('name description status startDate endDate')
      .exec();
  }
}
