-- DropForeignKey
ALTER TABLE `ItemImages` DROP FOREIGN KEY `ItemImages_itemId_fkey`;

-- AddForeignKey
ALTER TABLE `ItemImages` ADD CONSTRAINT `ItemImages_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
