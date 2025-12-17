/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropIndex
DROP INDEX `Cart_userId_key` ON `Cart`;

-- AlterTable
ALTER TABLE `Cart` MODIFY `userId` INTEGER NULL,
    ADD COLUMN `sessionId` VARCHAR(255) NOT NULL AFTER `userId`;

-- CreateIndex
CREATE UNIQUE INDEX `Cart_sessionId_key` ON `Cart`(`sessionId`);

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
