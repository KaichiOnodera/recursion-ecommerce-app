export type Cart = {
  readonly id: number;
  readonly items: Array<{
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly type: number;
    readonly price: number;
    readonly displayStatus: string;
    readonly amount: number;
  }>;
};
