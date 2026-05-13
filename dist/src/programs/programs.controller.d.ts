import { ProgramsService } from './programs.service';
import { CreateProgramDto, UpdateProgramDto, EnrollMembersDto } from './dto/program.dto';
export declare class ProgramsController {
    private readonly programsService;
    constructor(programsService: ProgramsService);
    create(dto: CreateProgramDto, user: any): Promise<import("./schemas/program.schema").ProgramDocument>;
    findAll(): Promise<import("./schemas/program.schema").ProgramDocument[]>;
    findOne(id: string): Promise<import("./schemas/program.schema").ProgramDocument>;
    update(id: string, dto: UpdateProgramDto): Promise<import("./schemas/program.schema").ProgramDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
    enroll(id: string, dto: EnrollMembersDto): Promise<import("./schemas/program.schema").ProgramDocument>;
    removeMember(id: string, userId: string): Promise<import("./schemas/program.schema").ProgramDocument>;
}
