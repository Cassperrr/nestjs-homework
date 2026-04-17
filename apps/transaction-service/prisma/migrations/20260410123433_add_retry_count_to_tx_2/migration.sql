/*
  Warnings:

  - You are about to drop the column `retry_count` on the `outbox_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "outbox_events" DROP COLUMN "retry_count";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0;
