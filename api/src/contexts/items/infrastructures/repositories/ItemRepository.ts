import { PrismaClient, Prisma } from '@prisma/client';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { ItemQuery } from '../../domains/repositories/ItemQuery';
import { DisplayStatus, Item } from '../../domains/entities/Item';
import { IItemImageRepository } from '../../domains/repositories/IItemImageRepository';
import { IImageStorageAdapter } from '../../domains/adapters/IImageStorageAdapter';
import { IFavoriteRepository } from '../../../favorites/domains/repositories/IFavoriteRepository';

export class ItemRepository implements IItemRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly itemImageRepository: IItemImageRepository,
    private readonly imageStorageAdapter: IImageStorageAdapter,
    private readonly favoriteRepository?: IFavoriteRepository,
  ) {}

  async findAll(
    displayStatus?: DisplayStatus,
    userId?: number,
  ): Promise<Item[]> {
    const items = await this.prisma.items.findMany({
      where: displayStatus ? { displayStatus } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        Inventory: true,
      },
    });

    return Promise.all(
      items.map(async (item) => {
        // 画像情報を取得してURLに変換
        const images = await this.itemImageRepository.findByItemId(item.id);
        const imagesWithUrl = images.map((image) => ({
          ...image,
          src: this.imageStorageAdapter.getUrl(image.src, item.id),
        }));

        // お気に入り情報を取得
        let isFavorite: boolean | null = null;
        if (userId && this.favoriteRepository) {
          const favorite = await this.favoriteRepository.findByUserIdAndItemId(
            userId,
            item.id,
          );
          isFavorite = favorite !== null;
        }

        return {
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          price: item.price,
          displayStatus: this.isDisplayStatus(item.displayStatus)
            ? item.displayStatus
            : DisplayStatus.PRIVATE,
          inventory: {
            amount: item.Inventory?.[0]?.amount ?? 0,
          },
          images: imagesWithUrl,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          isFavorite,
        };
      }),
    );
  }

  async find(query?: ItemQuery, userId?: number): Promise<Item[]> {
    const prismaQuery = this.buildPrismaQuery(query);
    const items = await this.prisma.items.findMany({
      ...prismaQuery,
      include: {
        Inventory: true,
      },
    });
    return Promise.all(
      items.map(async (item) => {
        // 画像情報を取得してURLに変換
        const images = await this.itemImageRepository.findByItemId(item.id);
        const imagesWithUrl = images.map((image) => ({
          ...image,
          src: this.imageStorageAdapter.getUrl(image.src, item.id),
        }));

        // お気に入り情報を取得
        let isFavorite: boolean | null = null;
        if (userId && this.favoriteRepository) {
          const favorite = await this.favoriteRepository.findByUserIdAndItemId(
            userId,
            item.id,
          );
          isFavorite = favorite !== null;
        }

        return {
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          price: item.price,
          displayStatus: this.isDisplayStatus(item.displayStatus)
            ? item.displayStatus
            : DisplayStatus.PRIVATE,
          inventory: {
            amount: item.Inventory?.[0]?.amount ?? 0,
          },
          images: imagesWithUrl,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          isFavorite,
        };
      }),
    );
  }

  private buildPrismaQuery(query?: ItemQuery): Prisma.ItemsFindManyArgs {
    const prismaQuery: Prisma.ItemsFindManyArgs = {};

    if (query?.where) {
      prismaQuery.where = {};
      if (query.where.name?.contains) {
        prismaQuery.where.name = {
          contains: query.where.name.contains,
        };
      }
      if (query.where.displayStatus?.not) {
        prismaQuery.where.displayStatus = {
          not: query.where.displayStatus.not,
        };
      }
    }

    if (query?.orderBy) {
      prismaQuery.orderBy = query.orderBy;
    }

    if (query?.skip !== undefined) {
      prismaQuery.skip = query.skip;
    }
    if (query?.take !== undefined) {
      prismaQuery.take = query.take;
    }

    return prismaQuery;
  }

  async create(name: string, description: string, type: number): Promise<Item> {
    const item = await this.prisma.items.create({
      data: {
        name,
        description,
        type,
      },
    });

    // 新規作成時は画像がないので空配列を返す
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      displayStatus: this.isDisplayStatus(item.displayStatus)
        ? item.displayStatus
        : DisplayStatus.PRIVATE,
      inventory: {
        amount: 0,
      },
      images: [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async update(
    id: number,
    name?: string,
    description?: string,
    type?: number,
    price?: number,
    inventoryAmount?: number,
    displayStatus?: DisplayStatus,
  ): Promise<Item | null> {
    const existingItem = await this.findById(id);

    if (!existingItem) {
      return null;
    }

    const updateData: {
      name?: string;
      description?: string;
      type?: number;
      price?: number;
      displayStatus?: DisplayStatus;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = price;
    if (displayStatus !== undefined) updateData.displayStatus = displayStatus;

    const item = await this.prisma.items.update({
      where: { id },
      data: updateData,
    });

    // 在庫数の更新処理
    if (inventoryAmount !== undefined) {
      const existingInventory = await this.prisma.inventory.findFirst({
        where: { itemId: item.id },
      });

      if (existingInventory) {
        await this.prisma.inventory.update({
          where: { id: existingInventory.id },
          data: { amount: inventoryAmount },
        });
      } else {
        await this.prisma.inventory.create({
          data: {
            itemId: item.id,
            amount: inventoryAmount,
          },
        });
      }
    }

    const inventory = await this.prisma.inventory.findFirst({
      where: { itemId: item.id },
    });

    // 画像情報を取得してURLに変換
    const images = await this.itemImageRepository.findByItemId(item.id);
    const imagesWithUrl = images.map((image) => ({
      ...image,
      src: this.imageStorageAdapter.getUrl(image.src, item.id),
    }));

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      displayStatus: this.isDisplayStatus(item.displayStatus)
        ? item.displayStatus
        : DisplayStatus.PRIVATE,
      inventory: {
        amount: inventory?.amount ?? 0,
      },
      images: imagesWithUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async delete(id: number): Promise<boolean> {
    const existingItem = await this.findById(id);

    if (!existingItem) {
      return false;
    }

    // 商品削除前に画像一覧を取得
    const images = await this.itemImageRepository.findByItemId(id);

    // 各画像ファイルを削除
    for (const image of images) {
      try {
        await this.imageStorageAdapter.delete(image.src, id);
      } catch {
        // ファイル削除に失敗してもエラーにしない（ログ出力などは必要に応じて追加）
        // S3の場合、既に削除されている可能性があるため
      }
    }

    // DBの商品レコードを削除（CASCADEで画像レコードも削除される）
    await this.prisma.items.delete({
      where: { id },
    });

    return true;
  }

  async findById(
    id: number,
    displayStatus?: DisplayStatus,
    userId?: number,
  ): Promise<Item | null> {
    const item = await this.prisma.items.findFirst({
      where: { id, displayStatus },
      include: {
        Inventory: true,
      },
    });

    if (!item) {
      return null;
    }

    // 画像情報を取得してURLに変換
    const images = await this.itemImageRepository.findByItemId(item.id);
    const imagesWithUrl = images.map((image) => ({
      ...image,
      src: this.imageStorageAdapter.getUrl(image.src, item.id),
    }));

    // お気に入り情報を取得
    let isFavorite: boolean | null = null;
    if (userId && this.favoriteRepository) {
      const favorite = await this.favoriteRepository.findByUserIdAndItemId(
        userId,
        item.id,
      );
      isFavorite = favorite !== null;
    }

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      displayStatus: this.isDisplayStatus(item.displayStatus)
        ? item.displayStatus
        : DisplayStatus.PRIVATE,
      inventory: {
        amount: item.Inventory?.[0]?.amount ?? 0,
      },
      images: imagesWithUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      isFavorite,
    };
  }

  private isDisplayStatus(
    displayStatus: string,
  ): displayStatus is DisplayStatus {
    return Object.values(DisplayStatus).includes(
      displayStatus as DisplayStatus,
    );
  }
}
