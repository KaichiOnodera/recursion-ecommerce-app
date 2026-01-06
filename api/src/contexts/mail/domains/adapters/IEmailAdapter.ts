import { EmailMessage } from '../entities/EmailMessage';

export interface IEmailAdapter {
  send(message: EmailMessage): Promise<void>;
}
