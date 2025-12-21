import { Item, AdminItemDetail } from '../schemas/item';
import { User } from '../schemas/user';
import { CartItem } from '../schemas/cart';

export type GetRes = {
  '/items': {
    items: Item[];
  };
  '/admin/items': {
    items: Item[];
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
    item: Item;
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
};
