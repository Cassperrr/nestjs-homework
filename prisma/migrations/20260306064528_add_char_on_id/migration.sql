/*
  Warnings:

  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - The primary key for the `avatars` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `avatars` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `account_id` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.

*/
BEGIN;
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_account_id_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(36),
ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(36),
ADD CONSTRAINT "avatars_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(36),
ALTER COLUMN "account_id" SET DATA TYPE CHAR(36),
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;