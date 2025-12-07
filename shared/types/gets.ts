import { Item, ItemDetail, AdminItemDetail } from '../schemas/item';
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
  '/admin/items/:id': {
    item: AdminItemDetail;
  };
  '/auth/me': {
    user: User;
  };
};
