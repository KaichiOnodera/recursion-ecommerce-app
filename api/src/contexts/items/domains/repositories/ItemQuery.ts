export interface ItemQuery {
  where?: {
    name?: { contains?: string };
    displayStatus?: { not?: string };
    tagIds?: number[];
  };
  orderBy?: {
    createdAt?: 'asc' | 'desc';
    price?: 'asc' | 'desc';
    name?: 'asc' | 'desc';
  };
  skip?: number;
  take?: number;
}
