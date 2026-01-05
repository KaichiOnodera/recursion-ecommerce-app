export type ItemImage = {
  readonly id: number;
  readonly src: string;
  readonly order: number;
};

export type Item = {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly images: readonly ItemImage[];
};

export type FavoriteItem = {
  readonly id: number;
  readonly userId: number;
  readonly itemId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly item: Item;
};
