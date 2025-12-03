import { GetRes } from '@shared/types/gets';

export interface IGetCartInteractor {
  execute(userId: number): Promise<GetRes['/cart']>;
}
