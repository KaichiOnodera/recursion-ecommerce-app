import { User } from '../schemas/user';
import { AdminItem } from '../schemas/item';
import { CartItem } from '../schemas/cart';

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
  '/users/signup': {
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
};

export type PostRes = {
  '/auth/login': {
    user: User;
  };
  '/admin/items': {
    item: AdminItem;
  };
  '/users/signup': {
    createdUser: User;
  };
  '/cart': {
    items: CartItem[];
  };
  '/checkout/session': {
    sessionId: string;
    url: string;
  };
};
