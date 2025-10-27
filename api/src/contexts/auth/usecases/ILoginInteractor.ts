export interface ILoginInteractor {
  execute(
    email: string,
    password: string,
    expectedRole?: 'USER' | 'ADMIN',
  ): Promise<{
    token: string;
    user: { id: number; email: string; role: string };
  }>;
}
