import { GetRes } from '@shared/types/gets';

type Order = GetRes['/orders']['orders'][0];

/**
 * 注文を最新順にソートする
 */
export const sortOrdersByDateDesc = (orders: Order[]): Order[] => {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
