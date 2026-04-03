/*
  Warnings:

  - You are about to drop the column `amount` on the `balances` table. All the data in the column will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_fkey";

-- AlterTable
ALTER TABLE "balances" DROP COLUMN "amount",
ADD COLUMN     "amount_rub" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "amount_usd" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "amount_usdt" BIGINT NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "transactions";
