import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey && apiKey.trim() !== '') {
      this.resend = new Resend(apiKey);
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const port = this.configService.get<number>('PORT', 3000);
    const appUrl = this.configService.get<string>('APP_URL') || `http://localhost:${port}`;
    const link = `${appUrl}/verify?token=${token}`;

    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: 'no-reply@kitsuno.help',
          to: [to],
          subject: 'Kitsuno Email Verification',
          html: `
            <p>Hello,</p>
            <p>Thank you for registering at Kitsuno! Please verify your email address by clicking the link below:</p>
            <p><a href="${link}">${link}</a></p>
            <p>If you did not sign up, you can safely ignore this email.</p>
            <p>Kitsuno Team!</p>
          `,
        });
        this.logger.log(`Verification email sent to ${to} via Resend`);
        return;
      } catch (err) {
        this.logger.error(`Failed to send verification email via Resend: ${err.message}`, err.stack);
      }
    }

    // Fallback log for local development or when RESEND_API_KEY is not configured
    this.logger.warn(`[DEVELOPMENT / NO RESEND KEY] Verification email for ${to}:`);
    this.logger.warn(`Click link to verify account: ${link}`);
  }
}
