import express from 'express';
import { PostReq, PostRes } from '@shared/types/posts';
import { IUpdateCartInteractor } from '../usecases/IUpdateCartInteractor';
import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { IMergeCartInteractor } from '../usecases/IMergeCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';
import {
  getCartSessionIdFromCookie,
  setCartSessionIdCookie,
  clearCartSessionIdCookie,
} from '../../../utils/cookie';
import { generateSessionId } from '../../../utils/sessionId';

export class PostCartController {
  constructor(
    private readonly updateCartInteractor: IUpdateCartInteractor,
    private readonly getCartInteractor: IGetCartInteractor,
    private readonly mergeCartInteractor: IMergeCartInteractor,
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(
    req: AuthenticatedRequest<PostReq['/cart']>,
    res: express.Response<PostRes['/cart'] | { message: string }>,
  ) {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    for (const item of items) {
      if (typeof item.id !== 'number' || typeof item.amount !== 'number') {
        return res
          .status(400)
          .json({ message: 'Each item must have id and amount as numbers' });
      }
      if (item.amount < 0) {
        return res.status(400).json({ message: 'Amount must be non-negative' });
      }
    }

    try {
      let cart;

      if (req.user) {
        const sessionId = getCartSessionIdFromCookie(req);

        if (sessionId) {
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

            // マージ後にリクエストされたitemsも追加
            cart = await this.updateCartInteractor.execute(
              req.user.userId,
              undefined,
              items,
            );
          } else {
            // セッションカートが空の場合は通常のカート操作
            cart = await this.updateCartInteractor.execute(
              req.user.userId,
              undefined,
              items,
            );
          }
        } else {
          // CookieにsessionIdがない場合: 通常のカート操作
          cart = await this.updateCartInteractor.execute(
            req.user.userId,
            undefined,
            items,
          );
        }
      } else {
        // ゲストユーザーの場合: CookieのsessionIdを使用
        let sessionId = getCartSessionIdFromCookie(req);

        if (!sessionId) {
          // CookieにsessionIdがなければ生成してセット
          sessionId = generateSessionId();
          setCartSessionIdCookie(res, sessionId);
        }

        cart = await this.updateCartInteractor.execute(
          undefined,
          sessionId,
          items,
        );
      }

      res.status(200).json({ items: cart.items });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update cart' });
    }
  }
}
