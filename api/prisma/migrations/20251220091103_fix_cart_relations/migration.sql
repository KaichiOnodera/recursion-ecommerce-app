/*
  Warnings:

  - You are about to alter the column `sessionId` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to drop the column `cartId` on the `Orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_cartId_fkey`;

-- DropIndex
DROP INDEX `Cart_sessionId_key` ON `Cart`;

-- DropIndex
DROP INDEX `Orders_cartId_idx` ON `Orders`;

-- AlterTable
ALTER TABLE `Cart` MODIFY `sessionId` VARCHAR(64) NULL;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `cartId`;

-- CreateIndex
CREATE UNIQUE INDEX `Cart_userId_key` ON `Cart`(`userId`);
