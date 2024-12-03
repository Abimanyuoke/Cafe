/*
  Warnings:

  - You are about to alter the column `nomor_meja` on the `meja` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `meja` MODIFY `nomor_meja` INTEGER NOT NULL;
