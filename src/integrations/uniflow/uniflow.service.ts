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
    plan: string = 'Community Member',
    memberId: string = 'XXXX',
  ) {
    const frontendUrl =
      this.config.get('FRONTEND_URL') || 'http://localhost:8080';

    return this.send({
      type: 'email',
      to: email,
      subject: '🎉 Welcome to The Cube — Your Account is Ready',
      message: this.buildApprovalEmailHtml(
        fullName,
        email,
        tempPassword,
        frontendUrl,
        plan,
        memberId,
      ),
    });
  }

  async sendPasswordResetEmail(email: string, fullName: string, token: string) {
    const frontendUrl =
      this.config.get('FRONTEND_URL') || 'http://localhost:8080';

    return this.send({
      type: 'email',
      to: email,
      subject: 'The Cube — Password Reset Request',
      message: this.buildPasswordResetHtml(fullName, token, frontendUrl),
    });
  }

  // ─── Bulk Email ───────────────────────────────────────────────────────────

  async sendBulkEmail(recipients: string[], subject: string, message: string) {
    const results = await Promise.allSettled(
      recipients.map((email) =>
        this.send({ type: 'email', to: email, subject, message }),
      ),
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(`Bulk email: ${sent} sent, ${failed} failed`);
    return { sent, failed, total: recipients.length };
  }

  // ─── SMS ──────────────────────────────────────────────────────────────────

  async sendSms(phone: string, message: string) {
    return this.send({ type: 'sms', to: phone, message });
  }

  // ─── Templates & Logs ─────────────────────────────────────────────────────

  async getTemplates() {
    try {
      const { data } = await this.client.get('/templates');
      return data;
    } catch (err) {
      this.logger.error(`Failed to fetch templates: ${err.message}`);
      return []; // Return empty array on failure instead of throwing, to not break UI
    }
  }

  async getLogs(params: any = {}) {
    try {
      const { data } = await this.client.get('/message-logs', { params });
      return data;
    } catch (err) {
      this.logger.error(`Failed to fetch message logs: ${err.message}`);
      return [];
    }
  }

  async getOrganization() {
    try {
      const { data } = await this.client.get('/organizations/current');
      return data;
    } catch (err) {
      this.logger.error(`Failed to fetch org details: ${err.message}`);
      return null;
    }
  }

  // ─── Core sender ─────────────────────────────────────────────────────────

  private async send(payload: {
    type: 'email' | 'sms' | 'whatsapp' | 'push' | 'system';
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
    email: string,
    tempPassword: string,
    frontendUrl: string,
    plan: string,
    memberId: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Approved - The Cube Hub</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f9; padding-top: 30px; padding-bottom: 50px; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .top-bar { background-color: #F37021; height: 8px; }
        .header { background-color: #ffffff; padding: 35px 20px; text-align: center; }
        .content { padding: 40px; line-height: 1.7; }
        .footer { background-color: #002B5B; color: #ffffff; padding: 30px; text-align: center; font-size: 13px; }

        .approve-badge { background-color: #28a745; color: #ffffff; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }

        .welcome-card { background-color: #fff9f5; border: 1px solid #fee6d6; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; }

        .credentials-card { background-color: #f8faff; border: 1px solid #d0dff5; border-left: 4px solid #002B5B; padding: 20px 25px; margin: 25px 0; border-radius: 8px; }
        .credentials-card p { margin: 8px 0; font-size: 15px; }
        .credentials-card code { background: #e8edf5; color: #002B5B; padding: 5px 10px; border-radius: 4px; font-size: 15px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 0.5px; }

        .warning-note { background-color: #fff8e6; border: 1px solid #ffd97a; border-left: 4px solid #F37021; padding: 12px 18px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #7a5200; }

        .btn-orange { background-color: #F37021; color: #ffffff !important; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; transition: 0.3s; margin: 10px; }
        .btn-outline { border: 2px solid #002B5B; color: #002B5B !important; padding: 13px 33px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin: 10px; }

        h2 { color: #002B5B; margin-top: 0; font-size: 26px; }
        h3 { color: #002B5B; font-size: 17px; margin-bottom: 8px; }
        .highlight { color: #F37021; font-weight: bold; }
        .perks-list { list-style: none; padding: 0; }
        .perks-list li { margin-bottom: 10px; padding-left: 25px; position: relative; }
        .perks-list li:before { content: '✓'; position: absolute; left: 0; color: #F37021; font-weight: bold; }
        .expire-note { color: #999999; font-size: 12px; margin-top: 24px; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0">
            <tr><td class="top-bar"></td></tr>

            <tr>
                <td class="header">
                    <img src="https://solby.sfo3.digitaloceanspaces.com/1774248458330-cube-new-logo-removebg-preview_apzpfc.png" alt="The Cube Hub" height="65">
                </td>
            </tr>

            <tr>
                <td class="content">
                    <div style="text-align: center;">
                        <div class="approve-badge">Application Approved</div>
                        <h2>Welcome to The Cube, ${name}! 🎉</h2>
                        <p>Your membership application has been <strong>approved</strong>. We're excited to have you in our community. Use the credentials below to access your member portal.</p>
                    </div>

                    <div class="welcome-card">
                        <p style="margin: 0; color: #002B5B; font-weight: bold; font-size: 18px;">Your Membership Plan:</p>
                        <p style="font-size: 22px; margin: 10px 0; color: #F37021; font-weight: 800;">${plan} (Complimentary)</p>
                        <p style="font-size: 14px; color: #666; margin: 0;">Status: Active • Member ID: #CUBE-2026-${memberId}</p>
                    </div>

                    <h3>Your Login Credentials</h3>
                    <div class="credentials-card">
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Temporary Password:</strong> <code>${tempPassword}</code></p>
                    </div>

                    <div class="warning-note">
                        ⚠️ <strong>Important:</strong> You will be required to change this password on your first login. Keep your credentials safe.
                    </div>

                    <h3>What you can do now:</h3>
                    <ul class="perks-list">
                        <li><strong>Connect:</strong> Join our digital community on Slack/WhatsApp to network with other members.</li>
                        <li><strong>Collaborate:</strong> Access the Hub for co-working and brainstorming sessions.</li>
                        <li><strong>Attend:</strong> Get priority invites to member-only workshops and "The Cube" mixers.</li>
                        <li><strong>Innovation Challenge:</strong> As a member, you'll receive exclusive mentorship for your startup ideas.</li>
                    </ul>

                    <div style="text-align: center; margin-top: 35px;">
                        <p><strong>Ready to get started?</strong> Log in to your account below:</p>
                        <a href="${frontendUrl}/login" class="btn-orange">Login to The Cube →</a>
                        <br>
                        <a href="https://the-cube.co.ke" class="btn-outline">Visit Member Portal</a>
                    </div>

                    <p class="expire-note" style="text-align:center;">This temporary password expires in 48 hours. If you did not apply, please ignore this email.</p>
                </td>
            </tr>

            <tr>
                <td class="footer">
                    <p style="margin-bottom: 5px; font-size: 16px;"><strong>The Cube Innovation Hub</strong></p>
                    <p style="opacity: 0.9;">Eldoret's Premiere Tech & Business Ecosystem.</p>
                    <div style="height: 1px; background-color: rgba(255,255,255,0.1); margin: 20px 0;"></div>
                    <p style="opacity: 0.7; font-size: 11px;">
                        You are receiving this because your membership application was approved.<br>
                        Visit us: Eldoret City, Kenya
                    </p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`;
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
