import { OrderStatus } from '@prisma/client';
import { Order } from '../entities/Order';

export type { Order };

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

export interface IOrderRepository {
  findByUserId(userId: number): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  create(data: CreateOrderData): Promise<Order>;
  getByStripeSessionId(sessionId: string): Promise<Order | null>;
  updateStatus(id: number, status: OrderStatus): Promise<Order>;
}
