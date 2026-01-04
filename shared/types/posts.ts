import { User } from '../schemas/user';
import { AdminItem, ItemImage } from '../schemas/item';
import { CartItem } from '../schemas/cart';
import { Review } from '../schemas/review';

export type PostReq = {
  '/auth/login': {
    email: string;
    password: string;
  };
  '/admin/items': {
    name: string;
    description: string;
    type: number;
    price: number;
  };
  '/auth/signup': {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
  };
  '/cart': {
    items: {
      id: number;
      amount: number;
    }[];
  };
  '/reviews': {
    itemId: number;
    title?: string;
    body: string;
    rating: number;
  };
};

export type PostRes = {
  '/auth/login': {
    user: User;
  };
  '/admin/items': {
    item: AdminItem;
  };
  '/auth/signup': {
    createdUser: User;
  };
  '/cart': {
    items: CartItem[];
  };
  '/checkout/session': {
    sessionId: string;
    url: string;
  };
  '/reviews': {
    review: Review;
  };
  '/admin/items/:id/images': {
    images: ItemImage[];
  };
};
