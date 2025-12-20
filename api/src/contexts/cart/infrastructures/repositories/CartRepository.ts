import { PrismaClient } from '@prisma/client';
import { ICartRepository } from '../../domains/repositories/ICartRepository';
import { Cart } from '../../domains/entities/Cart';

export class CartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: number): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return cart ? this.mapToCart(cart) : null;
  }

  async createByUserId(userId: number): Promise<Cart> {
    const cart = await this.prisma.cart.create({
      data: {
        userId,
      },
      include: {
        cartItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return this.mapToCart(cart);
  }

  async findBySessionId(sessionId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: {
        cartItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return cart ? this.mapToCart(cart) : null;
  }

  async createWithSessionId(sessionId: string): Promise<Cart> {
    const cart = await this.prisma.cart.create({
      data: {
        sessionId,
      },
      include: {
        cartItems: {
          include: {
            item: true,
          },
        },
      },
    });

    return this.mapToCart(cart);
  }

  async findBySessionIdOrCreate(sessionId: string): Promise<Cart> {
    const existingCart = await this.findBySessionId(sessionId);
    if (existingCart) {
      return existingCart;
    }

    return this.createWithSessionId(sessionId);
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    await this.prisma.cart.delete({
      where: { sessionId },
    });
  }

  private mapToCart(cart: {
    id: number;
    cartItems: Array<{
      id: number;
      amount: number;
      item: {
        id: number;
        name: string;
        description: string;
        type: number;
        price: number;
        displayStatus: string;
      };
    }>;
  }): Cart {
    return {
      id: cart.id,
      items: cart.cartItems.map((cartItem) => ({
        id: cartItem.item.id,
        name: cartItem.item.name,
        description: cartItem.item.description,
        type: cartItem.item.type,
        price: cartItem.item.price,
        displayStatus: cartItem.item.displayStatus,
        amount: cartItem.amount,
      })),
    };
  }
}
