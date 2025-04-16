-- DropForeignKey
ALTER TABLE `color` DROP FOREIGN KEY `Color_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_color_id_fkey`;

-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `Inventory_color_id_fkey`;

-- DropIndex
DROP INDEX `Color_product_id_fkey` ON `color`;

-- DropIndex
DROP INDEX `Image_color_id_fkey` ON `image`;

-- DropIndex
DROP INDEX `Inventory_color_id_fkey` ON `inventory`;

-- AddForeignKey
ALTER TABLE `Color` ADD CONSTRAINT `Color_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE CASCADE ON UPDATE CASCADE;
