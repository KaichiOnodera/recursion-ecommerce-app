export type User = {
  readonly id: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly email: string;
  readonly password: string;
  readonly role: 'USER' | 'ADMIN';
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
