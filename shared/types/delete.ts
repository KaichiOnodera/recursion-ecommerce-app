import { Item } from '../schemas/item';

export type DeleteReq = {
  'admin/items/:id': Record<string, never>;
};

export type DeleteRes = {
  'admin/items/:id': { item: Item };
};
