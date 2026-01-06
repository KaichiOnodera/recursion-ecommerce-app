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

export async function updateOrderTracking(
  orderId: number,
  trackingNumber: string,
): Promise<void> {
  const response = await apiClient.patch(`/admin/orders/${orderId}/tracking`, {
    trackingNumber,
  });
  if (response.status !== 200) {
    const error = response.data as { error?: string };
    throw new Error(error.error || 'Failed to update tracking number');
  }
}
