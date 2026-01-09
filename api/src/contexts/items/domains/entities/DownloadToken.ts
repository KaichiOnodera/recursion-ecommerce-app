export type DownloadToken = {
  id: number;
  orderId: number;
  userId: number | null;
  token: string;
  usedAmount: number;
  createdAt: Date;
  updatedAt: Date;
};
