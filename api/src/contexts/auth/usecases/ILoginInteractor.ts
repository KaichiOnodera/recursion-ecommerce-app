import { User } from '@shared/schemas/user';

export interface ILoginInteractor {
  execute(
    email: string,
    password: string,
    expectedRole?: 'USER' | 'ADMIN',
  ): Promise<{
    token: string;
    user: User;
  }>;
}
