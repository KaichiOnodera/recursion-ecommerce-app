export type Review = {
  id: number;
  userId: number;
  itemId: number;
  title: string | null;
  body: string;
  rating: number;
  postedAt: Date;
};
