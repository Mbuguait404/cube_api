import { AuthService } from './auth.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        mustChangePassword: boolean;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/schemas/user.schema").UserRole;
            profilePhoto: string;
            profileCompletion: number;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    resetPassword(req: any, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
