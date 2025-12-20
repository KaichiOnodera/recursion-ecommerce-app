import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { IMergeCartInteractor } from '../usecases/IMergeCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';
import {
  getCartSessionIdFromCookie,
  clearCartSessionIdCookie,
} from '../../../utils/cookie';

export class GetCartController {
  constructor(
    private readonly getCartInteractor: IGetCartInteractor,
    private readonly mergeCartInteractor: IMergeCartInteractor,
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(
    req: AuthenticatedRequest,
    res: express.Response<GetRes['/cart'] | { message: string }>,
  ) {
    try {
      let cart;

      if (req.user) {
        const sessionId = getCartSessionIdFromCookie(req);

        if (sessionId) {
          // CookieにsessionIdがある場合: マージ処理
          const sessionCart = await this.getCartInteractor.execute(
            undefined,
            sessionId,
          );

          if (sessionCart && sessionCart.items.length > 0) {
            // セッションカートとユーザーカートをマージ
            cart = await this.mergeCartInteractor.execute(
              req.user.userId,
              sessionCart,
            );

            // マージ後、sessionカートを削除
            await this.cartRepository.deleteBySessionId(sessionId);

            // sessionIdをCookieから削除
            clearCartSessionIdCookie(res);
          } else {
            // セッションカートが空の場合はユーザーカートを取得
            cart = await this.getCartInteractor.execute(
              Number(req.user.userId),
              undefined,
            );
          }
        } else {
          // CookieにsessionIdがない場合: ユーザーカートを取得
          cart = await this.getCartInteractor.execute(
            Number(req.user.userId),
            undefined,
          );
        }
      } else {
        // ゲストユーザーの場合: CookieのsessionIdを使用
        const sessionId = getCartSessionIdFromCookie(req);

        if (sessionId) {
          cart = await this.getCartInteractor.execute(undefined, sessionId);
        }
      }

      if (!cart) {
        res.status(200).json({ items: [] });
        return;
      }

      // displayStatusを除外してCartItem形式に変換
      const items = cart.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type,
        price: item.price,
        amount: item.amount,
      }));

      return res.status(200).json({ items });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to retrieve cart' });
    }
  }
}
