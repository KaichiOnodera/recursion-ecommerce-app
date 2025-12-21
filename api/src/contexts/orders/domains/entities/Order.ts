export type Order = {
  readonly id: number;
  readonly userId: number | null;
  readonly lastName: string;
  readonly firstName: string;
  readonly email: string;
  readonly address: string;
  readonly totalPrice: number;
  readonly orderStatus: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly items: Array<{
    readonly id: number;
    readonly itemId: number | null;
    readonly itemName: string;
    readonly itemPrice: number;
    readonly amount: number;
  }>;
};
