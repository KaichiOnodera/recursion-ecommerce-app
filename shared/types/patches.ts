import { User } from 'schemas/user';
import { AdminItem } from '../schemas/item';

export type PatchReq = {
  '/admin/items/:id': {
    name?: string;
    description?: string;
    type?: number;
    price?: number;
    inventoryAmount?: number;
  };
  '/users/profile': {
    lastName: string;
    firstName: string;
    email: string;
  };
};

import { ItemImage } from '../schemas/item';

export type PatchRes = {
  '/admin/items/:id': {
    item: AdminItem;
    images: ItemImage[];
  };
  '/users/profile': {
    user: User;
  };
};
