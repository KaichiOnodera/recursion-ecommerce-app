export type EmailVerificationToken = {
  readonly id: number;
  readonly token: string;
  readonly userId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
