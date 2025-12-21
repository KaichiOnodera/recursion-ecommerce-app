import { OrderStatus } from '@prisma/client';

export interface CreateOrderData {
  userId?: number;
  lastName: string;
  firstName: string;
  email: string;
  address: string;
  totalPrice: number;
  orderStatus?: OrderStatus;
  orderItems: Array<{
    itemId?: number;
    itemName: string;
    itemPrice: number;
    amount: number;
  }>;
}

export interface Order {
  id: number;
  userId: number | null;
  lastName: string;
  firstName: string;
  email: string;
  address: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  orderItems: Array<{
    id: number;
    orderId: number;
    itemId: number | null;
    itemName: string;
    itemPrice: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface IOrderRepository {
  create(data: CreateOrderData): Promise<Order>;
  getByStripeSessionId(sessionId: string): Promise<Order | null>;
  updateStatus(id: number, status: OrderStatus): Promise<Order>;
}
