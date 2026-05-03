import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserStatus } from '../users/schemas/user.schema';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Receives new membership / innovation-challenge application payloads
   * from the CMC. Creates a User record in PENDING status.
   *
   * Secure with a shared secret header: X-CMC-Secret
   */
  @Post('cmc/applications')
  @HttpCode(200)
  @ApiOperation({
    summary: 'CMC webhook — receives new application payloads',
  })
  async receiveCmcApplication(
    @Headers('x-cmc-secret') secret: string,
    @Body() payload: any,
  ) {
    const expected = this.config.get<string>('CMC_WEBHOOK_SECRET');
    if (expected && secret !== expected) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    this.logger.log(
      `CMC application received: ${payload?.email || 'unknown'}`,
    );

    const email = payload?.email?.toLowerCase()?.trim();
    if (!email) {
      this.logger.warn('CMC webhook payload missing email — skipped');
      return { received: true, created: false };
    }

    const existing = await this.userModel.findOne({ email });
    if (!existing) {
      await this.userModel.create({
        firstName: payload.firstName || payload.first_name || 'Applicant',
        lastName: payload.lastName || payload.last_name || '',
        email,
        phone: payload.phone || '',
        institution: payload.institution || payload.organization || '',
        designation: payload.designation || payload.role || '',
        password: await bcrypt.hash('PENDING_APPROVAL', 12),
        status: UserStatus.PENDING,
        mustChangePassword: true,
        cmsApplicationId: payload._id || payload.id || null,
      });
      this.logger.log(`New applicant created: ${email}`);
      return { received: true, created: true };
    }

    this.logger.log(`Applicant already exists: ${email} — skipped`);
    return { received: true, created: false, existing: true };
  }

  /**
   * Uniflow delivery status callback — logs email delivery events.
   */
  @Post('uniflow/status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Uniflow webhook — email delivery status updates' })
  async receiveUniflowStatus(@Body() payload: any) {
    this.logger.log(
      `Uniflow status update: ${payload?.status} for ${payload?.recipient}`,
    );
    // Extend here to update a notification log collection if needed
    return { received: true };
  }
}
