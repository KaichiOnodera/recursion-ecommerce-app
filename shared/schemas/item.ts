export type Item = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export const InventoryStatus = {
  IN_STOCK: 'inStock',
  OUT_OF_STOCK: 'outOfStock',
} as const;
export type InventoryStatus =
  (typeof InventoryStatus)[keyof typeof InventoryStatus];

export type ItemDetail = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  inventoryStatus: InventoryStatus;
};
