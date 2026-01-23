import 'dotenv/config';
import sgMail from '@sendgrid/mail';
import { IEmailAdapter } from '../../domains/adapters/IEmailAdapter';
import { EmailMessage } from '../../domains/entities/EmailMessage';

export class EmailAdapter implements IEmailAdapter {
  constructor() {
    const key = process.env.SENDGRID_API_KEY;
    if (!key) {
      console.error('[EmailAdapter] SENDGRID_API_KEY is missing');
      throw new Error('SENDGRID_API_KEY is missing');
    }
    sgMail.setApiKey(key);
  }

  async send(message: EmailMessage): Promise<void> {
    const from = process.env.SENDGRID_FROM_EMAIL;
    if (!from) {
      console.error('[EmailAdapter] SENDGRID_FROM_EMAIL is missing');
      throw new Error('SENDGRID_FROM_EMAIL is missing');
    }

    try {
      await sgMail.send({
        to: message.to,
        from,
        subject: message.subject,
        text: message.text ?? '',
        html: message.html ?? '',
      });
    } catch (error) {
      console.error(`[EmailAdapter] Failed to send email:`, error);
      throw error;
    }
  }
}
