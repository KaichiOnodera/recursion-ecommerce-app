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
    // images: File[] (multipart/form-dataで送信されるため、型定義には含めない)
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
    images: ItemImage[];
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
};
