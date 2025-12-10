import { User } from 'schemas/user';
import { Item } from '../schemas/item';

export type PatchReq = {
  'admin/items/:id': {
    name?: string;
    description?: string;
    type?: number;
    price: number;
  };
  '/users/profile': {
    lastName: string;
    firstName: string;
    email: string;
  };
};

export type PatchRes = {
  'admin/items/:id': {
    item: Item;
  };
  '/users/profile': {
    user: User;
  };
};
