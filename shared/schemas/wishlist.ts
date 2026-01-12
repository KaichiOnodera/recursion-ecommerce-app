export type Wishlist = {
  id: number;
  userId: number;
  name: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};
