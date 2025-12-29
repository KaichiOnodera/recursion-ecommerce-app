import { apiClient } from './apiClient';
import { GetRes } from '@shared/types/gets';

export async function getOrders(): Promise<GetRes['/orders']> {
  const response = await apiClient.get<GetRes['/orders']>('/orders');
  return response.data;
}
