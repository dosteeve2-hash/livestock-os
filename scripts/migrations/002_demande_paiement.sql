-- Déclarations « j'ai payé » envoyées depuis /payer.
-- Une ligne n'active rien : l'activation reste manuelle (npm run plan:activer),
-- après vérification du transfert dans l'historique Orange Money.
-- Appliquer une fois sur Neon (SQL Editor) ou : psql "$DATABASE_URL" -f scripts/migrations/002_demande_paiement.sql

CREATE TABLE IF NOT EXISTS demande_paiement (
  id                bigserial PRIMARY KEY,
  user_id           text NOT NULL,
  email             text NOT NULL,
  plan              text NOT NULL CHECK (plan IN ('troupeau', 'cooperative')),
  periode           text NOT NULL CHECK (periode IN ('mois', 'an')),
  montant           integer NOT NULL CHECK (montant > 0),
  reference_abonne  text NOT NULL,           -- code LIV-XXXXXX affiché sur /payer
  reference_transfert text NOT NULL,         -- ID de transaction Orange Money saisi par l'éleveur
  telephone         text NOT NULL,           -- numéro qui a envoyé l'argent
  statut            text NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'validee', 'refusee')),
  cree_le           timestamptz NOT NULL DEFAULT now(),
  traite_le         timestamptz
);

-- Un même ID de transaction ne peut être déclaré qu'une fois.
CREATE UNIQUE INDEX IF NOT EXISTS demande_paiement_transfert_unique ON demande_paiement (reference_transfert);
CREATE INDEX IF NOT EXISTS demande_paiement_attente ON demande_paiement (statut, cree_le);

COMMENT ON TABLE demande_paiement IS 'Déclarations de paiement manuel. Liste : npm run paiement:liste';
