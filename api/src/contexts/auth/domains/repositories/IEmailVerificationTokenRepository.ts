import { EmailVerificationToken } from '../entities/EmailVerificationToken';

export type EmailVerificationTokenInput = {
  userId: number;
  token: string;
};

export interface IEmailVerificationTokenRepository {
  create(token: EmailVerificationToken): Promise<EmailVerificationToken>;
  findByToken(token: string): Promise<EmailVerificationToken | null>;
  deleteById(id: number): Promise<void>;
  upsert(input: EmailVerificationTokenInput): Promise<EmailVerificationToken>;
}
