import { Item } from '../schemas/item';
import { User } from '../schemas/user';
import { CartItem } from '../schemas/cart';

export type GetRes = {
  '/items': {
    items: Item[];
  };
  '/admin/items': {
    items: Item[];
  };
  '/items/search': {
    items: Item[];
  };
  '/admin/items/:id': {
    item: AdminItemDetail;
  };
  '/auth/me': {
    user: User;
  };
  'admin/items/:id': {
    item: Item;
  };
  'items/:id': {
    item: Item;
  };
  '/cart': {
    items: CartItem[];
  };
};
