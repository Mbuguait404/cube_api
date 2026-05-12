import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UniflowService } from '../integrations/uniflow/uniflow.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private config;
    private uniflowService;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService, uniflowService: UniflowService);
    login(dto: LoginDto): Promise<{
        mustChangePassword: boolean;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/schemas/user.schema").UserRole;
            profilePhoto: string;
            profileCompletion: number;
            mustChangePassword: boolean;
            tempPasswordExpiry: Date;
            communities: import("mongoose").Types.ObjectId[];
            badges: import("mongoose").Types.ObjectId[];
        };
        accessToken: string;
        refreshToken: string;
    }>;
    resetPassword(userId: string, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    sendTemporaryPassword(userId: string): Promise<{
        message: string;
        tempPassword: string;
    }>;
    private generateTokens;
    private generateTempPassword;
}
