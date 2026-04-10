/*
  Warnings:

  - You are about to drop the column `failed_at` on the `outbox_events` table. All the data in the column will be lost.
  - You are about to drop the column `retry_count` on the `outbox_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "outbox_events" DROP COLUMN "failed_at",
DROP COLUMN "retry_count";
