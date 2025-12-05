import { Item } from '../schemas/item';

export type PatchReq = {
  'admin/items/:id': {
    name?: string;
    description?: string;
    type?: number;
    price: number;
  };
};

export type PatchRes = {
  'admin/items/:id': {
    item: Item;
  };
};
