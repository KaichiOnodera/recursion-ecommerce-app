import { Item } from '../schemas/item';
import { CartItem } from '../schemas/cart';

export type PatchReq = {
  'admin/items/:id': {
    name?: string;
    description?: string;
    type?: number;
    price: number;
  };
  'cart/items/:itemId': {
    amount: number;
  };
};

export type PatchRes = {
  'admin/items/:id': {
    item: Item;
  };
  'cart/items/:itemId': {
    items: CartItem[];
  };
};
