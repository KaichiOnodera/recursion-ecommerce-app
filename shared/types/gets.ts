import { Item, ItemDetail, AdminItem, AdminItemDetail } from '../schemas/item';
import { User } from '../schemas/user';
import { CartItem } from '../schemas/cart';
import { Review } from '../schemas/review';

export type GetRes = {
  '/items': {
    items: Item[];
  };
  '/admin/items': {
    items: AdminItem[];
  };
  '/items/search': {
    items: Item[];
  };
  '/admin/items/:id': {
    item: AdminItemDetail;
  };
  '/auth/me': {
    user: User;
  };
  '/items/:id': {
    item: ItemDetail;
  };
  '/cart': {
    items: CartItem[];
  };
  '/orders': {
    orders: Array<{
      id: number;
      userId: number | null;
      lastName: string;
      firstName: string;
      email: string;
      address: string;
      totalPrice: number;
      orderStatus: string;
      trackingNumber: string | null;
      createdAt: string;
      updatedAt: string;
      items: Array<{
        id: number;
        itemId: number | null;
        itemName: string;
        itemPrice: number;
        amount: number;
      }>;
    }>;
  };
  '/admin/orders': {
    orders: Array<{
      id: number;
      userId: number | null;
      lastName: string;
      firstName: string;
      email: string;
      address: string;
      totalPrice: number;
      orderStatus: string;
      trackingNumber: string | null;
      createdAt: string;
      updatedAt: string;
      items: Array<{
        id: number;
        itemId: number | null;
        itemName: string;
        itemPrice: number;
        amount: number;
      }>;
    }>;
  };
  '/admin/orders/shipping-needed': {
    orders: Array<{
      id: number;
      userId: number | null;
      lastName: string;
      firstName: string;
      email: string;
      address: string;
      totalPrice: number;
      orderStatus: string;
      trackingNumber: string | null;
      createdAt: string;
      updatedAt: string;
      items: Array<{
        id: number;
        itemId: number | null;
        itemName: string;
        itemPrice: number;
        amount: number;
      }>;
    }>;
  };
  '/reviews/items/:itemId': {
    reviews: Review[];
    total: number;
    averageRating: number;
  };
  '/favorites': {
    favorites: Array<{
      id: number;
      userId: number;
      itemId: number;
      createdAt: Date;
      item: {
        id: number;
        name: string;
        price: number;
        images: Array<{
          id: number;
          src: string;
          order: number;
        }>;
      };
    }>;
    total: number;
  };
};
