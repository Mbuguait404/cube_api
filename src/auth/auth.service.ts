import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UniflowService } from '../integrations/uniflow/uniflow.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { UserStatus } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private uniflowService: UniflowService,
  ) {}

  // ─── Login ───────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Account is inactive. Contact an admin.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Check if temporary password has expired
    if (user.mustChangePassword && user.tempPasswordExpiry && new Date() > user.tempPasswordExpiry) {
      throw new UnauthorizedException('Temporary password has expired. Please contact an admin for a reset.');
    }

    const tokens = await this.generateTokens(
      user._id.toString(),
      user.email,
      user.role,
    );

    // Populate communities and badges for the frontend
    await user.populate([
      { path: 'communities', select: 'name tag slug' },
      { path: 'badges', select: 'name iconUrl color description' },
    ]);

    return {
      ...tokens,
      mustChangePassword: user.mustChangePassword,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profilePhoto: user.profilePhoto,
        profileCompletion: user.profileCompletion,
        mustChangePassword: user.mustChangePassword,
        tempPasswordExpiry: user.tempPasswordExpiry,
        communities: user.communities || [],
        badges: user.badges || [],
      },
    };
  }

  // ─── Reset / Change Password ─────────────────────────────────────────────
  async resetPassword(userId: string, dto: ResetPasswordDto) {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) throw new NotFoundException('User not found');

    // Only require current password if they AREN'T in the "must change" state (e.g. regular security update)
    if (!user.mustChangePassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }
      const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
      if (!isMatch) throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.updatePassword(userId, hashed);
    return { message: 'Password changed successfully' };
  }

  // ─── Admin: Set Temporary Password & Send Email ──────────────────────────
  async sendTemporaryPassword(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const tempPassword = this.generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);

    await this.usersService.setTemporaryPassword(userId, hashed);

    await this.uniflowService.sendApprovalEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      tempPassword,
    );

    return {
      message: `Temporary password sent to ${user.email}`,
      tempPassword,
    };
  }

  // ─── Token Generation ─────────────────────────────────────────────────────
  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN') || '7d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') || '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private generateTempPassword(): string {
    const chars =
      'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    return Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('');
  }
}
