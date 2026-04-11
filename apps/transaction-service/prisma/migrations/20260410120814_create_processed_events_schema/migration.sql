-- CreateTable
CREATE TABLE "processed_events" (
    "id" CHAR(36) NOT NULL,
    "idempotency_key" CHAR(36) NOT NULL,
    "topic" CHAR(100) NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "processed_events_idempotency_key_key" ON "processed_events"("idempotency_key");
