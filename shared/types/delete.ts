import { CartItem } from '../schemas/cart';

export type DeleteReq = {
  'admin/items/:id': Record<string, never>;
  'cart/items/:itemId': Record<string, never>;
  '/cart': Record<string, never>;
};

export type DeleteRes = {
  'admin/items/:id': { deleted: boolean };
  'cart/items/:itemId': { items: CartItem[] };
  '/cart': { items: CartItem[] };
};
