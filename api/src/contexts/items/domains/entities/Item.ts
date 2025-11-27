export type Item = {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly type: number;
  readonly price: number;
  readonly displayStatus: string;
  readonly inventory: {
    readonly amount: number;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
