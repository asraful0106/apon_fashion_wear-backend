-- AlterTable
ALTER TABLE `address` ADD COLUMN `isDeafult` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Banner` (
    `banner_id` INTEGER NOT NULL AUTO_INCREMENT,
    `banner_image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`banner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
