-- AlterTable
ALTER TABLE `Items` ADD COLUMN `stripeProductId` VARCHAR(191) NULL,
    ADD COLUMN `stripePriceId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Items_stripeProductId_key` ON `Items`(`stripeProductId`);
