import { OrderStatus } from '@prisma/client';
import { Order } from '../entities/Order';
import { OrderPaymentExternalId } from '../entities/OrderPaymentExternalId';

export type { Order };
export type { OrderPaymentExternalId };

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

export interface CreateOrderPaymentExternalIdData {
  orderId: number;
  provider: string;
  paymentSessionId?: string;
  paymentId?: string;
}

export interface IOrderRepository {
  findByUserId(userId: number): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  create(data: CreateOrderData): Promise<Order>;
  getByStripeSessionId(sessionId: string): Promise<Order | null>;
  updateStatus(id: number, status: OrderStatus): Promise<Order>;
  getById(id: number): Promise<Order | null>;
  updateAddress(id: number, address: string): Promise<Order>;
  updateEmail(id: number, email: string): Promise<Order>;
  createPaymentExternalId(
    data: CreateOrderPaymentExternalIdData,
  ): Promise<OrderPaymentExternalId>;
  updatePaymentExternalIdBySessionId(
    paymentSessionId: string,
    paymentId: string,
  ): Promise<OrderPaymentExternalId | null>;
  findOrdersNeedingShipping(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  updateTrackingNumber(id: number, trackingNumber: string): Promise<Order>;
}
