import { Item, ItemDetail } from '../schemas/item';
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
  '/items/:id': {
    item: ItemDetail;
  };
  '/auth/me': {
    user: User;
  };
};
