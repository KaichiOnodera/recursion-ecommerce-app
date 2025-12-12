-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `orderStatus` VARCHAR(32) NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE `OrderPaymentExternalIds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `paymentSessionId` VARCHAR(255) NULL,
    `paymentId` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OrderPaymentExternalIds_orderId_idx`(`orderId`),
    INDEX `OrderPaymentExternalIds_provider_idx`(`provider`),
    UNIQUE INDEX `OrderPaymentExternalIds_provider_paymentSessionId_key`(`provider`, `paymentSessionId`),
    UNIQUE INDEX `OrderPaymentExternalIds_provider_paymentId_key`(`provider`, `paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderPaymentExternalIds` ADD CONSTRAINT `OrderPaymentExternalIds_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
