import { Item, AdminItemDetail } from '../schemas/item';
import { User } from '../schemas/user';

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
    items: {
      id: number;
      name: string;
      description: string;
      type: number;
      price: number;
      amount: number;
    }[];
  };
};
