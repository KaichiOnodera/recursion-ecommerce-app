export type ItemImage = {
  readonly id: number;
  readonly src: string;
  readonly order: number;
};

export type Item = {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly images: readonly ItemImage[];
};

export type WishlistItem = {
  readonly id: number;
  readonly wishlistId: number;
  readonly itemId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type WishlistItemWithItem = {
  readonly id: number;
  readonly wishlistId: number;
  readonly itemId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly item: Item;
};
