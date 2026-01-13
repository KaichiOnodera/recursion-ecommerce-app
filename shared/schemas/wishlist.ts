export type Wishlist = {
  id: number;
  userId: number;
  name: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type WishlistItemImage = {
  id: number;
  src: string;
  order: number;
};

export type WishlistItemDetail = {
  id: number;
  name: string;
  description: string;
  price: number;
  images: WishlistItemImage[];
};

export type WishlistItem = {
  id: number;
  wishlistId: number;
  itemId: number;
  createdAt: Date;
  updatedAt: Date;
  item: WishlistItemDetail;
};
