export const SearchSortType = {
  newest: 'newest',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  name_asc: 'name_asc',
  name_desc: 'name_desc',
} as const;

export type SearchSortType =
  (typeof SearchSortType)[keyof typeof SearchSortType];

export interface SearchItemsParams {
  q?: string;
  sort?: SearchSortType;
  page?: number;
}

export const InventoryStatus = {
  IN_STOCK: 'inStock',
  OUT_OF_STOCK: 'outOfStock',
} as const;
export type InventoryStatus =
  (typeof InventoryStatus)[keyof typeof InventoryStatus];

export type Item = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  inventoryStatus: InventoryStatus;
  images: ItemImage[];
};

export type ItemDetail = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  inventoryStatus: InventoryStatus;
  images: ItemImage[];
};

export const DisplayStatus = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type DisplayStatus = (typeof DisplayStatus)[keyof typeof DisplayStatus];

export type AdminItem = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  inventoryStatus: InventoryStatus;
  displayStatus: DisplayStatus;
  images: ItemImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type AdminItemDetail = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  inventoryStatus: InventoryStatus;
  inventoryAmount: number;
  displayStatus: DisplayStatus;
  images: ItemImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type ItemImage = {
  id: number;
  itemId: number;
  src: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};
