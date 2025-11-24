//Define Constant table for User
export type User = {
  readonly id: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly isResigned: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
