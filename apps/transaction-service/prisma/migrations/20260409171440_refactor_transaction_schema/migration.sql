/*
  Warnings:

  - You are about to drop the column `counterparty_account_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `retry_count` on the `transactions` table. All the data in the column will be lost.
  - You are about to alter the column `provider` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "counterparty_account_id",
DROP COLUMN "retry_count",
ADD COLUMN     "method" VARCHAR(20),
ALTER COLUMN "provider" SET DATA TYPE VARCHAR(20);
