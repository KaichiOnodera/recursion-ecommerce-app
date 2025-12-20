import { EmailMessage, EmailSender } from '../../domains/entities/EmailSender';

export interface IEmailAdapter extends EmailSender {
  send(message: EmailMessage): Promise<void>;
}
