import { prismaTest } from '../../libs/prisma-test';

/**
 * データベースをクリーンアップ
 * 外部キー制約の順序を考慮して削除する
 */
export async function cleanDatabase(): Promise<void> {
  await prismaTest.orderPaymentExternalIds.deleteMany();
  await prismaTest.orderItems.deleteMany();
  await prismaTest.cartItems.deleteMany();
  await prismaTest.inventory.deleteMany();
  await prismaTest.itemImages.deleteMany();
  await prismaTest.orders.deleteMany();
  await prismaTest.cart.deleteMany();
  await prismaTest.items.deleteMany();
  await prismaTest.emailVerificationToken.deleteMany();
  await prismaTest.users.deleteMany();
}

/**
 * テスト後のクリーンアップ
 */
export async function teardownTestDatabase(): Promise<void> {
  await prismaTest.$disconnect();
}
