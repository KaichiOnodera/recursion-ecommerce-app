import { User } from '../schemas/user';
import { AdminItem } from '../schemas/item';

export type PatchReq = {
  '/admin/items/:id': {
    name?: string;
    description?: string;
    type?: number;
    price?: number;
    inventoryAmount?: number;
    displayStatus?: 'public' | 'private';
    imageIds?: number[];
  };
  '/users/profile': {
    lastName: string;
    firstName: string;
  };
};

export type PatchRes = {
  '/admin/items/:id': {
    item: AdminItem;
  };
  '/users/profile': {
    user: User;
  };
};
