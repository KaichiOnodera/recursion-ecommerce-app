/*
  Warnings:

  - You are about to alter the column `orderStatus` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Orders` MODIFY `orderStatus` ENUM('PENDING', 'COMPLETED', 'SHIPPED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
