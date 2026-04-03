-- AlterTable
ALTER TABLE "processed_events" ADD COLUMN     "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
