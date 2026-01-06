-- CreateTable
CREATE TABLE `Reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `body` TEXT NOT NULL,
    `rating` INTEGER NOT NULL,
    `postedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Reviews_userId_idx`(`userId`),
    INDEX `Reviews_itemId_idx`(`itemId`),
    INDEX `Reviews_itemId_rating_idx`(`itemId`, `rating`),
    INDEX `Reviews_itemId_postedAt_idx`(`itemId`, `postedAt`),
    UNIQUE INDEX `Reviews_userId_itemId_key`(`userId`, `itemId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `Reviews_rating_check` CHECK (`rating` >= 1 AND `rating` <= 5)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
