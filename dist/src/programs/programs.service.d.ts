import { Model } from 'mongoose';
import { ProgramDocument } from './schemas/program.schema';
import { CreateProgramDto, UpdateProgramDto, EnrollMembersDto } from './dto/program.dto';
export declare class ProgramsService {
    private programModel;
    constructor(programModel: Model<ProgramDocument>);
    create(dto: CreateProgramDto, createdBy: string): Promise<ProgramDocument>;
    findAll(): Promise<ProgramDocument[]>;
    findById(id: string): Promise<ProgramDocument>;
    update(id: string, dto: UpdateProgramDto): Promise<ProgramDocument>;
    delete(id: string): Promise<{
        message: string;
    }>;
    enrollMembers(id: string, dto: EnrollMembersDto): Promise<ProgramDocument>;
    removeMember(programId: string, userId: string): Promise<ProgramDocument>;
    findByMember(userId: string): Promise<ProgramDocument[]>;
}
