/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `outbox_events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "outbox_events_transaction_id_key" ON "outbox_events"("transaction_id");
