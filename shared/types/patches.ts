import { User } from '../schemas/user';
import { AdminItem } from '../schemas/item';
import { Tag } from '../schemas/tag';
import { Wishlist } from '../schemas/wishlist';

export type PatchReq = {
  '/admin/items/:id': {
    name?: string;
    description?: string;
    type?: number;
    price?: number;
    inventoryAmount?: number;
    displayStatus?: 'public' | 'private';
    imageIds?: number[];
    tagIds?: number[];
  };
  '/users/profile': {
    lastName: string;
    firstName: string;
  };
  '/admin/tags/:id': {
    name: string;
  };
  '/wishlist/:wishlistId': {
    name?: string | null;
    isPublic?: boolean;
  };
};

export type PatchRes = {
  '/admin/items/:id': {
    item: AdminItem;
  };
  '/users/profile': {
    user: User;
  };
  '/admin/tags/:id': {
    tag: Tag;
  };
  '/wishlist/:wishlistId': {
    wishlist: Wishlist;
  };
};
