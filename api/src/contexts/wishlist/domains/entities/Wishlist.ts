export type Wishlist = {
  readonly id: number;
  readonly userId: number;
  readonly name: string | null;
  readonly isPublic: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
