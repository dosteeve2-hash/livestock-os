-- LivestockOS — le schéma complet de la base Neon.
--
-- POURQUOI CE FICHIER EXISTE
--
-- Jusqu'au 22/09/2026, aucun fichier `.sql` n'était versionné dans ce dépôt.
-- La base existait, son schéma n'existait nulle part. Si le projet Neon avait
-- disparu, ni l'authentification ni — surtout — les **passeports publiés**
-- n'auraient été reconstructibles. Or le passeport du cheptel est le seul
-- instrument de confiance de tout l'écosystème FORGE : c'est le document qu'un
-- éleveur présente à une microfinance. Un instrument de preuve dont la
-- structure n'est écrite nulle part n'est pas un instrument de preuve.
--
-- Ce fichier a été reconstruit en lisant la base de production le 22/09/2026
-- (`information_schema`, `pg_constraint`, `pg_indexes`) : il décrit ce qui
-- tourne vraiment, pas ce qu'on croyait avoir créé.
--
-- IDEMPOTENT — `node db/migrer.mjs` peut être relancé sur une base déjà
-- peuplée sans rien détruire. Aucune instruction `drop` ici, jamais.

-- ---------------------------------------------------------------- Better Auth
-- Les quatre tables de Better Auth. Les noms de colonnes sont en camelCase :
-- Postgres les replie en minuscules si on ne les cite pas, donc les guillemets
-- ne sont pas décoratifs, ils sont obligatoires.

create table if not exists "user" (
  id              text primary key,
  name            text        not null,
  email           text        not null unique,
  "emailVerified" boolean     not null,
  image           text,
  "createdAt"     timestamptz not null default current_timestamp,
  "updatedAt"     timestamptz not null default current_timestamp
);

create table if not exists account (
  id                      text primary key,
  issuer                  text        not null,
  "accountId"             text        not null,
  "providerId"            text        not null,
  "userId"                text        not null references "user"(id) on delete cascade,
  "accessToken"           text,
  "refreshToken"          text,
  "idToken"               text,
  "accessTokenExpiresAt"  timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope                   text,
  -- scrypt, au format `sel:clé` — jamais le mot de passe en clair.
  password                text,
  "createdAt"             timestamptz not null default current_timestamp,
  "updatedAt"             timestamptz not null
);

-- Un compte par fournisseur et par identifiant : c'est cet index qui empêche
-- qu'une même adresse ouvre deux comptes « credential » distincts.
create unique index if not exists "account_issuer_accountId_uidx"
  on account (issuer, "accountId");
create index if not exists "account_userId_idx" on account ("userId");

create table if not exists session (
  id          text primary key,
  "expiresAt" timestamptz not null,
  token       text        not null unique,
  "createdAt" timestamptz not null default current_timestamp,
  "updatedAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "userId"    text        not null references "user"(id) on delete cascade
);

create index if not exists "session_userId_idx" on session ("userId");

create table if not exists verification (
  id          text primary key,
  identifier  text        not null,
  value       text        not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default current_timestamp,
  "updatedAt" timestamptz not null default current_timestamp
);

create index if not exists verification_identifier_idx on verification (identifier);

-- ------------------------------------------------------- Passeport du cheptel
-- Le cœur de la promesse commerciale du produit.
--
-- `publie_le` est un défaut **serveur** (`now()`), jamais fourni par le client :
-- c'est ce qui rend l'historique incontestable. Le contenu reste déclaratif —
-- la page publique le dit — mais « cinq relevés publiés, le premier le 12
-- janvier » ne se lit pas comme un relevé unique publié le jour de la demande
-- de prêt. Ne jamais accepter une date de publication venue du client, et ne
-- jamais mettre à jour une ligne existante : on en insère une nouvelle.
--
-- `payload` conserve le contenu figé du relevé, pour que la page publique
-- affiche ce qui a été publié ce jour-là, et non l'état actuel du cheptel.

create table if not exists passeport_snapshot (
  id                   uuid primary key default gen_random_uuid(),
  -- Code dicté au téléphone : alphabet sans caractères confondables.
  code                 text        not null unique,
  user_id              text        not null references "user"(id) on delete cascade,
  publie_le            timestamptz not null default now(),
  nb_tetes             integer     not null,
  valeur_totale        bigint      not null,
  couverture_vaccinale integer     not null,
  revenus_12m          bigint      not null,
  nb_ventes_12m        integer     not null,
  payload              jsonb       not null
);

create index if not exists passeport_snapshot_user_idx
  on passeport_snapshot (user_id, publie_le desc);

-- ----------------------------------------------------------------- Abonnement
-- Le premier produit FORGE à avoir un prix (16/09/2026).
-- Une ligne par éleveur. Pas de ligne = plan gratuit « eleveur ».
-- Activation manuelle : `npm run plan:activer`. Aucune transaction ne transite
-- par cette base — seule la trace de l'encaissement, dans `reference`.

create table if not exists abonnement (
  user_id   text primary key,
  plan      text        not null check (plan in ('eleveur', 'troupeau', 'cooperative')),
  -- NULL = sans échéance. Une date passée fait retomber sur le plan gratuit,
  -- côté applicatif : la base ne périme rien toute seule.
  expire_le timestamptz,
  active_le timestamptz not null default now(),
  -- Référence de l'encaissement : numéro Orange Money, virement, reçu.
  reference text
);
