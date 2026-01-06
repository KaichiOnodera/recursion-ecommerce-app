export type Favorite = {
  id: number;
  userId: number;
  itemId: number;
  createdAt: Date;
};

export type FavoriteItemImage = {
  id: number;
  src: string;
  order: number;
};

export type FavoriteItemDetail = {
  id: number;
  name: string;
  price: number;
  images: FavoriteItemImage[];
};

export type FavoriteItem = {
  id: number;
  userId: number;
  itemId: number;
  createdAt: Date;
  item: FavoriteItemDetail;
};
