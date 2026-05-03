import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class UniflowService {
  private readonly logger = new Logger(UniflowService.name);
  private client: AxiosInstance;

  constructor(private config: ConfigService) {
    this.client = axios.create({
      baseURL: config.get<string>('UNIFLOW_BASE_URL'),
      headers: {
        'UNIFIED-API-Key': config.get<string>('UNIFLOW_API_KEY'),
        'Content-Type': 'application/json',
      },
      // Self-signed cert on port 8443 - disable in prod if cert is valid
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    });
  }

  // ─── Transactional Emails ─────────────────────────────────────────────────

  async sendApprovalEmail(
    email: string,
    fullName: string,
    tempPassword: string,
  ) {
    const frontendUrl =
      this.config.get('FRONTEND_URL') || 'http://localhost:4200';

    return this.send({
      type: 'EMAIL',
      to: email,
      subject: '🎉 Welcome to The Cube — Your Account is Ready',
      message: this.buildApprovalEmailHtml(fullName, tempPassword, frontendUrl),
    });
  }

  async sendPasswordResetEmail(email: string, fullName: string, token: string) {
    const frontendUrl =
      this.config.get('FRONTEND_URL') || 'http://localhost:4200';

    return this.send({
      type: 'EMAIL',
      to: email,
      subject: 'The Cube — Password Reset Request',
      message: this.buildPasswordResetHtml(fullName, token, frontendUrl),
    });
  }

  // ─── Bulk Email ───────────────────────────────────────────────────────────

  async sendBulkEmail(recipients: string[], subject: string, message: string) {
    const results = await Promise.allSettled(
      recipients.map((email) =>
        this.send({ type: 'EMAIL', to: email, subject, message }),
      ),
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(`Bulk email: ${sent} sent, ${failed} failed`);
    return { sent, failed, total: recipients.length };
  }

  // ─── SMS ──────────────────────────────────────────────────────────────────

  async sendSms(phone: string, message: string) {
    return this.send({ type: 'SMS', to: phone, message });
  }

  // ─── Core sender ─────────────────────────────────────────────────────────

  private async send(payload: {
    type: 'EMAIL' | 'SMS' | 'WHATSAPP';
    to: string;
    message: string;
    subject?: string;
  }) {
    try {
      const { data } = await this.client.post('/notifications/send', {
        ...payload,
        attachments: [],
      });
      return data;
    } catch (err) {
      this.logger.error(
        `Uniflow send failed for ${payload.to}: ${err.message}`,
      );
      throw err;
    }
  }

  // ─── Email Templates ──────────────────────────────────────────────────────

  private buildApprovalEmailHtml(
    name: string,
    tempPassword: string,
    frontendUrl: string,
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Welcome to The Cube, ${name}! 🎉</h2>
        <p>Your membership application has been <strong>approved</strong>. Here are your login credentials:</p>
        <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p><strong>Temporary Password:</strong> <code style="background:#f0f0f0; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
        </div>
        <p style="color: #e55;">⚠ You will be required to change this password on your first login.</p>
        <a href="${frontendUrl}/login" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 12px;">
          Login to The Cube →
        </a>
        <p style="margin-top: 24px; color: #888; font-size: 12px;">This link expires in 48 hours. If you did not apply, please ignore this email.</p>
      </div>
    `;
  }

  private buildPasswordResetHtml(
    name: string,
    token: string,
    frontendUrl: string,
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Password Reset — The Cube</h2>
        <p>Hi ${name}, use the link below to reset your password:</p>
        <a href="${frontendUrl}/reset-password?token=${token}" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 12px;">
          Reset Password →
        </a>
        <p style="margin-top: 24px; color: #888; font-size: 12px;">This link expires in 1 hour. If you didn't request this, please ignore.</p>
      </div>
    `;
  }
}
