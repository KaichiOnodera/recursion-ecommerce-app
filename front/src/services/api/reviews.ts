import { apiClient } from './apiClient';
import { GetRes } from '@shared/types/gets';
import { PostReq, PostRes } from '@shared/types/posts';

export interface GetReviewsParams {
  page?: number;
  limit?: number;
}

export async function getReviews(
  itemId: number,
  params?: GetReviewsParams,
): Promise<GetRes['/reviews/items/:itemId']> {
  const queryParams = new URLSearchParams();
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const queryString = queryParams.toString();
  const url = `/reviews/items/${itemId}${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient.get<GetRes['/reviews/items/:itemId']>(url);
  return response.data;
}

export async function createReview(
  data: PostReq['/reviews'],
): Promise<PostRes['/reviews']> {
  const response = await apiClient.post<PostRes['/reviews']>('/reviews', data);
  return response.data;
}
