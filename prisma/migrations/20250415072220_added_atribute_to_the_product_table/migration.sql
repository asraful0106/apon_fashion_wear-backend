-- AlterTable
ALTER TABLE `product` ADD COLUMN `accept_preorder` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `offer_price` DECIMAL(10, 2) NULL;
