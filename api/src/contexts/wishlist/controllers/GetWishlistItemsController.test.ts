import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/app';
import { createRouter } from '../../../tests/helpers/router';
import { GetWishlistItemsController } from './GetWishlistItemsController';
import { GetWishlistItemsInteractor } from '../interactors/GetWishlistItemsInteractor';
import { WishlistRepository } from '../infrastructures/repositories/WishlistRepository';
import { ItemImageRepository } from '../../items/infrastructures/repositories/ItemImageRepository';
import { createImageStorageAdapter } from '../../items/infrastructures/adapters/createImageStorageAdapter';
import { UserRepository } from '../../auth/infrastructures/repositories/UserRepository';
import { VerifyUserInteractor } from '../../auth/interactors/VerifyUserInteractor';
import { createVerifyAccessToken } from '../../../middlewares/verifyAccessToken';
import { prismaTest } from '../../../libs/prisma-test';
import { cleanDatabase } from '../../../tests/helpers/database';
import { generateJWT } from '../../../utils/jwt';
import * as path from 'path';

describe('GetWishlistItemsController', () => {
  let app: ReturnType<typeof createTestApp>;
  let verifyAccessToken: ReturnType<typeof createVerifyAccessToken>;

  beforeEach(async () => {
    await cleanDatabase();

    const userRepository = new UserRepository(prismaTest);
    const verifyUserInteractor = new VerifyUserInteractor(userRepository);
    verifyAccessToken = createVerifyAccessToken(verifyUserInteractor);

    const itemImageRepository = new ItemImageRepository(prismaTest);
    const uploadDir = path.join(process.cwd(), 'uploads', 'items');
    const imageStorageAdapter = createImageStorageAdapter();
    const wishlistRepository = new WishlistRepository(
      prismaTest,
      itemImageRepository,
      imageStorageAdapter,
    );
    const getWishlistItemsInteractor = new GetWishlistItemsInteractor(
      wishlistRepository,
    );
    const getWishlistItemsController = new GetWishlistItemsController(
      getWishlistItemsInteractor,
    );
    const router = createRouter(
      'GET',
      '/:wishlistId/items',
      getWishlistItemsController,
      [verifyAccessToken],
    );

    app = createTestApp([{ path: '/wishlist', router }]);
  });

  describe('GET /wishlist/:wishlistId/items', () => {
    it('should return empty array when wishlist has no items', async () => {
      // テスト用ユーザーを作成
      const testUser = await prismaTest.users.create({
        data: {
          lastName: 'テスト',
          firstName: 'ユーザー',
          email: 'test-empty@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      // ウィッシュリストを作成
      const wishlist = await prismaTest.wishlist.create({
        data: {
          userId: testUser.id,
          name: 'マイウィッシュリスト',
          isPublic: false,
        },
      });

      // 認証用のトークンを生成
      const token = await generateJWT({
        userId: testUser.id,
        email: testUser.email,
        role: testUser.role,
        version: '1.0',
      });

      const response = await request(app)
        .get(`/wishlist/${wishlist.id}/items`)
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toEqual([]);
    });

    it('should return wishlist items successfully for owned wishlist', async () => {
      // テスト用ユーザーを作成
      const testUser = await prismaTest.users.create({
        data: {
          lastName: 'テスト',
          firstName: 'ユーザー',
          email: 'test-owned@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      // 商品を作成
      const item1 = await prismaTest.items.create({
        data: {
          name: '商品1',
          description: '説明1',
          price: 1000,
          displayStatus: 'PUBLIC',
        },
      });

      const item2 = await prismaTest.items.create({
        data: {
          name: '商品2',
          description: '説明2',
          price: 2000,
          displayStatus: 'PUBLIC',
        },
      });

      // ウィッシュリストを作成
      const wishlist = await prismaTest.wishlist.create({
        data: {
          userId: testUser.id,
          name: 'マイウィッシュリスト',
          isPublic: false,
        },
      });

      // ウィッシュリストに商品を追加
      await prismaTest.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          itemId: item1.id,
        },
      });

      await prismaTest.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          itemId: item2.id,
        },
      });

      // 認証用のトークンを生成
      const token = await generateJWT({
        userId: testUser.id,
        email: testUser.email,
        role: testUser.role,
        version: '1.0',
      });

      const response = await request(app)
        .get(`/wishlist/${wishlist.id}/items`)
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0]).toHaveProperty('id');
      expect(response.body.items[0]).toHaveProperty('wishlistId', wishlist.id);
      expect(response.body.items[0]).toHaveProperty('itemId');
      expect(response.body.items[0]).toHaveProperty('item');
      expect(response.body.items[0].item).toHaveProperty('id');
      expect(response.body.items[0].item).toHaveProperty('name');
      expect(response.body.items[0].item).toHaveProperty('description');
      expect(response.body.items[0].item).toHaveProperty('price');
      expect(response.body.items[0].item).toHaveProperty('images');
    });

    it('should return wishlist items successfully for public wishlist', async () => {
      // テスト用ユーザーを2人作成
      const testUser1 = await prismaTest.users.create({
        data: {
          lastName: 'テスト',
          firstName: 'ユーザー1',
          email: 'test-user1@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      const testUser2 = await prismaTest.users.create({
        data: {
          lastName: 'テスト',
          firstName: 'ユーザー2',
          email: 'test-user2@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      // 商品を作成
      const item = await prismaTest.items.create({
        data: {
          name: '商品1',
          description: '説明1',
          price: 1000,
          displayStatus: 'PUBLIC',
        },
      });

      // ユーザー1の公開ウィッシュリストを作成
      const wishlist = await prismaTest.wishlist.create({
        data: {
          userId: testUser1.id,
          name: '公開ウィッシュリスト',
          isPublic: true,
        },
      });

      // ウィッシュリストに商品を追加
      await prismaTest.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          itemId: item.id,
        },
      });

      // ユーザー2の認証用トークンを生成
      const token = await generateJWT({
        userId: testUser2.id,
        email: testUser2.email,
        role: testUser2.role,
        version: '1.0',
      });

      const response = await request(app)
        .get(`/wishlist/${wishlist.id}/items`)
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0]).toHaveProperty('itemId', item.id);
    });

    it('should return 403 for private wishlist owned by another user', async () => {
      // テスト用ユーザーを2人作成
      const testUser1 = await prismaTest.users.create({
        data: {
          lastName: 'テスト',
          firstName: 'ユーザー1',
          email: 'test-user1-private@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      const testUser2 = await prismaTest.users.create({
        data: {
          lastName: 'テスト',
          firstName: 'ユーザー2',
          email: 'test-user2-private@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      // ユーザー1の非公開ウィッシュリストを作成
      const wishlist = await prismaTest.wishlist.create({
        data: {
          userId: testUser1.id,
          name: '非公開ウィッシュリスト',
          isPublic: false,
        },
      });

      // ユーザー2の認証用トークンを生成
      const token = await generateJWT({
        userId: testUser2.id,
        email: testUser2.email,
        role: testUser2.role,
        version: '1.0',
      });

      const response = await request(app)
        .get(`/wishlist/${wishlist.id}/items`)
        .set('Cookie', `token=${token}`)
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Wishlist not found or access denied');
    });

    it('should return 400 for invalid wishlist ID', async () => {
      // テスト用ユーザーを作成
      const testUser = await prismaTest.users.create({
        data: {
          lastName: 'テスト',
          firstName: 'ユーザー',
          email: 'test-invalid@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      // 認証用のトークンを生成
      const token = await generateJWT({
        userId: testUser.id,
        email: testUser.email,
        role: testUser.role,
        version: '1.0',
      });

      const response = await request(app)
        .get('/wishlist/invalid/items')
        .set('Cookie', `token=${token}`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid wishlist ID');
    });

    it('should return 401 when authentication token is missing', async () => {
      const response = await request(app).get('/wishlist/1/items').expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
