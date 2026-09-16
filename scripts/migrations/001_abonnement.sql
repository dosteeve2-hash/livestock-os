-- Abonnements LivestockOS.
-- Absence de ligne = plan Éleveur (gratuit). Voir lib/plans/plans.ts pour les bornes.
-- Appliquer une fois sur Neon (SQL Editor) ou : psql "$DATABASE_URL" -f scripts/migrations/001_abonnement.sql

CREATE TABLE IF NOT EXISTS abonnement (
  user_id    text PRIMARY KEY,
  plan       text NOT NULL CHECK (plan IN ('eleveur', 'troupeau', 'cooperative')),
  expire_le  timestamptz,                    -- NULL = sans échéance
  active_le  timestamptz NOT NULL DEFAULT now(),
  reference  text                            -- référence Orange Money / note d'activation
);

COMMENT ON TABLE abonnement IS 'Un abonnement par compte. Activation manuelle : scripts/activer-plan.mjs';
