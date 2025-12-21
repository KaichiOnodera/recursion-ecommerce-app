import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/app';
import { createRouter } from '../../../tests/helpers/router';
import { GetItemsController } from './GetItemsController';
import { GetItemsInteractor } from '../interactors/GetItemsInteractor';
import { ItemRepository } from '../infrastructures/repositories/ItemRepository';
import { prismaTest } from '../../../libs/prisma-test';
import { cleanDatabase } from '../../../tests/helpers/database';

describe('GetItemsController', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    await cleanDatabase();

    const itemRepository = new ItemRepository(prismaTest);
    const getItemsInteractor = new GetItemsInteractor(itemRepository);
    const getItemsController = new GetItemsController(getItemsInteractor);
    const router = createRouter('GET', '/', getItemsController);

    app = createTestApp([{ path: '/items', router }]);
  });

  describe('GET /items', () => {
    it('should return empty array when no items exist', async () => {
      const response = await request(app).get('/items').expect(201);

      expect(response.body).toEqual({ items: [] });
    });

    it('should return items when items exist', async () => {
      // テストデータを作成
      const item1 = await prismaTest.items.create({
        data: {
          name: 'テスト商品1',
          description: 'テスト商品1の説明',
          type: 1,
          price: 1000,
          displayStatus: 'public',
        },
      });

      const item2 = await prismaTest.items.create({
        data: {
          name: 'テスト商品2',
          description: 'テスト商品2の説明',
          type: 2,
          price: 2000,
          displayStatus: 'public',
        },
      });

      const response = await request(app).get('/items').expect(201);

      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBe(2);

      // レスポンス形式の検証
      const firstItem = response.body.items[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('description');
      expect(firstItem).toHaveProperty('type');
      expect(firstItem).toHaveProperty('price');
      expect(firstItem).toHaveProperty('createdAt');
      expect(firstItem).toHaveProperty('updatedAt');

      // displayStatusとinventoryはレスポンスに含まれないことを確認
      expect(firstItem).not.toHaveProperty('displayStatus');
      expect(firstItem).not.toHaveProperty('inventory');

      // データの内容を検証
      const itemIds = response.body.items.map(
        (item: { id: number }) => item.id,
      );
      expect(itemIds).toContain(item1.id);
      expect(itemIds).toContain(item2.id);
    });

    it('should return items sorted by createdAt in descending order', async () => {
      // 古い商品を作成
      const oldItem = await prismaTest.items.create({
        data: {
          name: '古い商品',
          description: '古い商品の説明',
          type: 1,
          price: 1000,
          displayStatus: 'public',
        },
      });

      // 少し待ってから新しい商品を作成
      await new Promise((resolve) => setTimeout(resolve, 10));

      const newItem = await prismaTest.items.create({
        data: {
          name: '新しい商品',
          description: '新しい商品の説明',
          type: 1,
          price: 2000,
          displayStatus: 'public',
        },
      });

      const response = await request(app).get('/items').expect(201);

      expect(response.body.items.length).toBe(2);
      // 最初の要素が新しい商品であることを確認（createdAt降順）
      expect(response.body.items[0].id).toBe(newItem.id);
      expect(response.body.items[1].id).toBe(oldItem.id);
    });

    it('should return correct item data structure', async () => {
      const item = await prismaTest.items.create({
        data: {
          name: '構造テスト商品',
          description: '構造テスト商品の説明',
          type: 1,
          price: 5000,
          displayStatus: 'public',
        },
      });

      const response = await request(app).get('/items').expect(201);

      expect(response.body.items.length).toBe(1);
      const responseItem = response.body.items[0];

      expect(responseItem).toEqual({
        id: item.id,
        name: '構造テスト商品',
        description: '構造テスト商品の説明',
        type: 1,
        price: 5000,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      });
    });
  });
});
