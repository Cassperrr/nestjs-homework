/*
  Warnings:

  - You are about to alter the column `idempotency_key` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "idempotency_key" SET DATA TYPE VARCHAR(36);
