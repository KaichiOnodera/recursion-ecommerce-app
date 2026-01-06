export type Review = {
  readonly id: number;
  readonly userId: number;
  readonly itemId: number;
  readonly title: string | null;
  readonly body: string;
  readonly rating: number;
  readonly postedAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
