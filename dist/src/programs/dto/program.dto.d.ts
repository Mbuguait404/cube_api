import { ProgramStatus } from '../schemas/program.schema';
export declare class CreateProgramDto {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: ProgramStatus;
}
export declare class UpdateProgramDto {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: ProgramStatus;
}
export declare class EnrollMembersDto {
    memberIds: string[];
}
