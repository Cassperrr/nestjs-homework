/*
  Warnings:

  - You are about to drop the column `amount_rub` on the `balances` table. All the data in the column will be lost.
  - You are about to drop the column `amount_usd` on the `balances` table. All the data in the column will be lost.
  - You are about to drop the column `amount_usdt` on the `balances` table. All the data in the column will be lost.
  - Added the required column `currency` to the `balances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "balances" DROP COLUMN "amount_rub",
DROP COLUMN "amount_usd",
DROP COLUMN "amount_usdt",
ADD COLUMN     "amount" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "currency" VARCHAR(10) NOT NULL;

ALTER TABLE "balances" ADD CONSTRAINT "balance_amount_non_negative" CHECK (amount >= 0);
