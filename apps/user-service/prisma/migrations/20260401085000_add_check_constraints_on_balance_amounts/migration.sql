ALTER TABLE "balances" ADD CONSTRAINT "balance_amount_rub_non_negative" CHECK (amount_rub >= 0);
ALTER TABLE "balances" ADD CONSTRAINT "balance_amount_usd_non_negative" CHECK (amount_usd >= 0);
ALTER TABLE "balances" ADD CONSTRAINT "balance_amount_usdt_non_negative" CHECK (amount_usdt >= 0);