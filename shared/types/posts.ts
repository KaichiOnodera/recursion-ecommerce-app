import { User } from '../schemas/user';
import { Item } from '../schemas/item';

export type PostReq = {
  'auth/login': {
    email: string;
    password: string;
  };
  'admin/items': {
    name: string;
    description: string;
    type: number;
  };
  'users/signup': {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
  };
};

export type PostRes = {
  'auth/login': {
    user: User;
  };
  'admin/items': {
    item: Item;
  };
  'users/signup': {
    createdUser: User;
  };
};
