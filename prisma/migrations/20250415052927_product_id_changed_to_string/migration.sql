/*
  Warnings:

  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `color` DROP FOREIGN KEY `Color_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_product_id_fkey`;

-- DropIndex
DROP INDEX `Color_product_id_fkey` ON `color`;

-- DropIndex
DROP INDEX `Review_product_id_fkey` ON `review`;

-- AlterTable
ALTER TABLE `color` MODIFY `product_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    MODIFY `product_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`product_id`);

-- AlterTable
ALTER TABLE `review` MODIFY `product_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Color` ADD CONSTRAINT `Color_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
