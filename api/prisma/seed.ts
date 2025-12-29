import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import { hashPassword } from '../src/contexts/utils/hashPassword';
import { config } from 'dotenv';

if (!process.env.DATABASE_URL) {
  config({ path: '.env.test' });
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function seedTestData(prismaClient?: PrismaClient) {
  const client = prismaClient || prisma;

  // Users
  const hashedPassword = await hashPassword('password123');

  const testUser = await client.users.upsert({
    where: { email: 'test-user@example.com' },
    update: {
      password: hashedPassword,
      lastName: 'テスト',
      firstName: 'ユーザー',
      role: UserRole.USER,
      isResigned: false,
    },
    create: {
      email: 'test-user@example.com',
      password: hashedPassword,
      lastName: 'テスト',
      firstName: 'ユーザー',
      role: UserRole.USER,
      isResigned: false,
    },
  });

  const testAdmin = await client.users.upsert({
    where: { email: 'test-admin@example.com' },
    update: {
      password: hashedPassword,
      lastName: 'テスト',
      firstName: '管理者',
      role: UserRole.ADMIN,
      isResigned: false,
    },
    create: {
      email: 'test-admin@example.com',
      password: hashedPassword,
      lastName: 'テスト',
      firstName: '管理者',
      role: UserRole.ADMIN,
      isResigned: false,
    },
  });

  // Items 
  const itemData = [
    { name: 'リュックサック', description: '軽量で丈夫なナイロン製リュックサック。長時間のハイキングにも最適です。', price: 12000 },
    { name: 'テント', description: '2〜3人用のコンパクトなドーム型テント。簡単に設営できます。', price: 25000 },
    { name: '寝袋', description: '保温性に優れたダウン素材の寝袋。-5℃まで対応可能です。', price: 15000 },
    { name: 'アウトドアチェア', description: '折りたたみ式のコンパクトなキャンプチェア。持ち運びに便利です。', price: 3000 },
    { name: 'クーラーボックス', description: '保冷力が高い大型クーラーボックス。キャンプやバーベキューに最適です。', price: 8000 },
    { name: 'LEDランタン', description: '明るさ3段階調節可能な充電式LEDランタン。最大50時間点灯可能です。', price: 4500 },
    { name: 'ポータブルストーブ', description: '軽量コンパクトなガスストーブ。アウトドアでの調理に便利です。', price: 5000 },
    { name: 'トレッキングシューズ', description: 'グリップ力の高いトレッキングシューズ。滑りにくいソール設計です。', price: 18000 },
    { name: '防水ジャケット', description: '透湿防水素材を使用した軽量ジャケット。突然の雨にも安心です。', price: 12000 },
    { name: 'アウトドアテーブル', description: '折りたたみ式のコンパクトテーブル。設営が簡単で収納も便利です。', price: 6000 },
  ];

  const items = [];
  for (let i = 0; i < itemData.length; i++) {
    const { name, description, price } = itemData[i];
    const item = await client.items.upsert({
      where: { id: i + 1 },
      update: {
        name,
        description,
        type: 1,
        displayStatus: i % 2 === 0 ? 'public' : 'private',
        price,
      },
      create: {
        name,
        description,
        type: 1,
        displayStatus: i % 2 === 0 ? 'public' : 'private',
        price,
      },
    });
    items.push(item);
  }

  await client.inventory.deleteMany({});

  const inventoryData = [
    { itemId: items[0].id, amount: 85 }, 
    { itemId: items[1].id, amount: 15 },
    { itemId: items[2].id, amount: 42 },
    { itemId: items[3].id, amount: 120 },
    { itemId: items[4].id, amount: 28 },
    { itemId: items[5].id, amount: 65 },
    { itemId: items[6].id, amount: 38 },
    { itemId: items[7].id, amount: 22 },
    { itemId: items[8].id, amount: 0 },
    { itemId: items[9].id, amount: 55 },
  ];

  for (const inventory of inventoryData) {
    await client.inventory.create({
      data: {
        itemId: inventory.itemId,
        amount: inventory.amount,
      },
    });
  }

  await client.orderItems.deleteMany({});
  await client.orders.deleteMany({});

  const now = new Date();
  const ordersData = [
    {
      userId: testUser.id,
      lastName: testUser.lastName,
      firstName: testUser.firstName,
      email: testUser.email,
      address: '東京都渋谷区神南1-1-1 アパート101',
      orderStatus: OrderStatus.COMPLETED,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30日前
      items: [
        { itemId: items[0].id, itemName: items[0].name, itemPrice: items[0].price, amount: 1 },
        { itemId: items[2].id, itemName: items[2].name, itemPrice: items[2].price, amount: 1 },
        { itemId: items[3].id, itemName: items[3].name, itemPrice: items[3].price, amount: 2 },
      ],
    },
    {
      userId: testUser.id,
      lastName: testUser.lastName,
      firstName: testUser.firstName,
      email: testUser.email,
      address: '東京都渋谷区神南1-1-1 アパート101',
      orderStatus: OrderStatus.SHIPPED,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7日前
      items: [
        { itemId: items[1].id, itemName: items[1].name, itemPrice: items[1].price, amount: 1 },
        { itemId: items[4].id, itemName: items[4].name, itemPrice: items[4].price, amount: 1 },
        { itemId: items[5].id, itemName: items[5].name, itemPrice: items[5].price, amount: 1 },
        { itemId: items[6].id, itemName: items[6].name, itemPrice: items[6].price, amount: 1 },
      ],
    },
    {
      userId: testUser.id,
      lastName: testUser.lastName,
      firstName: testUser.firstName,
      email: testUser.email,
      address: '東京都渋谷区神南1-1-1 アパート101',
      orderStatus: OrderStatus.COMPLETED,
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14日前
      items: [
        { itemId: items[7].id, itemName: items[7].name, itemPrice: items[7].price, amount: 1 },
        { itemId: items[8].id, itemName: items[8].name, itemPrice: items[8].price, amount: 1 },
      ],
    },
    {
      userId: testUser.id,
      lastName: testUser.lastName,
      firstName: testUser.firstName,
      email: testUser.email,
      address: '東京都渋谷区神南1-1-1 アパート101',
      orderStatus: OrderStatus.PENDING,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1日前
      items: [
        { itemId: items[9].id, itemName: items[9].name, itemPrice: items[9].price, amount: 1 },
        { itemId: items[0].id, itemName: items[0].name, itemPrice: items[0].price, amount: 1 },
      ],
    },
    {
      userId: testUser.id,
      lastName: testUser.lastName,
      firstName: testUser.firstName,
      email: testUser.email,
      address: '東京都渋谷区神南1-1-1 アパート101',
      orderStatus: OrderStatus.COMPLETED,
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60日前
      items: [
        { itemId: items[1].id, itemName: items[1].name, itemPrice: items[1].price, amount: 1 },
        { itemId: items[2].id, itemName: items[2].name, itemPrice: items[2].price, amount: 1 },
        { itemId: items[3].id, itemName: items[3].name, itemPrice: items[3].price, amount: 4 },
        { itemId: items[5].id, itemName: items[5].name, itemPrice: items[5].price, amount: 2 },
      ],
    },
  ];

  const orders = [];
  for (const orderData of ordersData) {
    const totalPrice = orderData.items.reduce(
      (sum, item) => sum + item.itemPrice * item.amount,
      0,
    );

    const order = await client.orders.create({
      data: {
        userId: orderData.userId,
        lastName: orderData.lastName,
        firstName: orderData.firstName,
        email: orderData.email,
        address: orderData.address,
        totalPrice,
        orderStatus: orderData.orderStatus,
        createdAt: orderData.createdAt,
        orderItems: {
          create: orderData.items.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            amount: item.amount,
          })),
        },
      },
    });
    orders.push(order);
  }

  return { testUser, testAdmin, items, orders };
}

async function main() {
  await seedTestData();
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
