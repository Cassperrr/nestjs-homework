-- CreateTable
CREATE TABLE "balances" (
    "id" CHAR(36) NOT NULL,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "account_id" CHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "balances_account_id_key" ON "balances"("account_id");

-- AddForeignKey
ALTER TABLE "balances" ADD CONSTRAINT "balances_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
