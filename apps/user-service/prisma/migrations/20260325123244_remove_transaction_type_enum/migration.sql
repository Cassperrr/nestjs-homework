/*
  Warnings:

  - You are about to alter the column `role` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - Changed the type of `type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "role" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "type",
ADD COLUMN     "type" VARCHAR(25) NOT NULL;

-- DropEnum
DROP TYPE "TransactionType";
