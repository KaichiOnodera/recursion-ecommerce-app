-- CreateTable
CREATE TABLE `ItemStripeMapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `stripeProductId` VARCHAR(191) NOT NULL,
    `stripePriceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ItemStripeMapping_itemId_key`(`itemId`),
    UNIQUE INDEX `ItemStripeMapping_stripeProductId_key`(`stripeProductId`),
    INDEX `ItemStripeMapping_itemId_idx`(`itemId`),
    INDEX `ItemStripeMapping_stripeProductId_idx`(`stripeProductId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ItemStripeMapping` ADD CONSTRAINT `ItemStripeMapping_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
