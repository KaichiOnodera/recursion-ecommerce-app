/*
  Warnings:

  - Made the column `itemId` on table `OrderItemFiles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `OrderItemFiles` DROP FOREIGN KEY `OrderItemFiles_itemId_fkey`;

-- DropIndex
DROP INDEX `OrderItemFiles_itemId_fkey` ON `OrderItemFiles`;

-- AlterTable
ALTER TABLE `OrderItemFiles` MODIFY `itemId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderItemFiles` ADD CONSTRAINT `OrderItemFiles_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
