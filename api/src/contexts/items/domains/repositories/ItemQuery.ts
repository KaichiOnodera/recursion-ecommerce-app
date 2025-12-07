export interface ItemQuery {
  where?: {
    name?: { contains?: string };
    displayStatus?: { not?: string };
  };
  orderBy?: {
    createdAt?: 'asc' | 'desc';
    price?: 'asc' | 'desc';
    name?: 'asc' | 'desc';
  };
  skip?: number;
  take?: number;
}
