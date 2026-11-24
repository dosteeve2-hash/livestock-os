-- Better Auth 1.7.28 database-backed rate limiting.
-- Apply to Neon during a planned auth cutover, before deploying the new auth configuration.
BEGIN;

-- Better Auth 1.7.0–1.7.2 required account.issuer. Relax that legacy schema if
-- it was created so that newer 1.7 releases can create password accounts.
DROP INDEX IF EXISTS "account_issuer_accountId_uidx";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'account'
      AND column_name = 'issuer'
  ) THEN
    ALTER TABLE "account" ALTER COLUMN "issuer" DROP NOT NULL;
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "rateLimit" (
  "id" text PRIMARY KEY NOT NULL,
  "key" text NOT NULL UNIQUE,
  "count" integer NOT NULL,
  "lastRequest" bigint NOT NULL
);

COMMIT;
