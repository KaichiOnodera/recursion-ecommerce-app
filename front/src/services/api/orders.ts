import { apiClient } from './apiClient';
import { GetRes } from '@shared/types/gets';

export async function getOrders(): Promise<GetRes['/orders']> {
  const response = await apiClient.get<GetRes['/orders']>('/orders');
  return response.data;
}

export async function getAllOrders(): Promise<GetRes['/admin/orders']> {
  const response =
    await apiClient.get<GetRes['/admin/orders']>('/admin/orders');
  return response.data;
}

export async function getOrdersNeedingShipping(): Promise<
  GetRes['/admin/orders/shipping-needed']
> {
  const response = await apiClient.get<GetRes['/admin/orders/shipping-needed']>(
    '/admin/orders/shipping-needed',
  );
  return response.data;
}
