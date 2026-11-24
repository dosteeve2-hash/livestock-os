# Configuration Neon — 10 minutes

LivestockOS utilise **Neon Postgres** pour l'authentification et **Better Auth** comme bibliothèque.
Les données métier (cheptel, soins, ventes) restent en local sur l'appareil — la base ne porte que les comptes.

---

## 1. Créer le projet Neon

1. Créer un compte sur [neon.com](https://neon.com) (plan gratuit, aucune carte demandée)
2. **New Project** → nom `livestock-os`, région **eu-central-1 (Frankfurt)**
   *(la plus proche de l'Afrique de l'Ouest parmi les régions gratuites — meilleure latence depuis Ouagadougou)*
3. Copier la **connection string** affichée à la création
   Elle ressemble à : `postgresql://user:motdepasse@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`

Le plan gratuit autorise **100 projets**, 0,5 Go par projet et 100 CU-heures par mois.
Aucune mise en pause après une semaine, contrairement à Supabase.

---

## 2. Configurer l'environnement local

```bash
cp .env.example .env.local
```

Puis renseigner les trois valeurs :

| Variable | Où la trouver |
|---|---|
| `DATABASE_URL` | La connection string copiée à l'étape 1 |
| `BETTER_AUTH_SECRET` | À générer — voir ci-dessous |
| `BETTER_AUTH_URL` | `http://localhost:3000` en local |

Générer le secret (32 caractères minimum) :

```bash
openssl rand -base64 32
```

> Ne jamais committer `.env.local` — il est déjà dans `.gitignore`.

---

## 3. Créer les tables d'authentification

Better Auth génère lui-même son schéma (`user`, `session`, `account`, `verification`) :

```bash
npx auth@1.7.28 migrate --config ./lib/auth/server.ts
```

La commande lit `DATABASE_URL` depuis `.env.local` et applique le schéma sur Neon.
Répondre `y` à la demande de confirmation.

Pour seulement inspecter le SQL sans l'appliquer :

```bash
npx auth@1.7.28 generate --config ./lib/auth/server.ts
```

Puis les tables métier (passeports, abonnements), à coller dans le **SQL Editor** de Neon :

```bash
scripts/migrations/001_abonnement.sql
```

### Limiter les tentatives de connexion et d'inscription

Avant de déployer la configuration Better Auth avec stockage du rate limit en base,
appliquer `scripts/migrations/003_better_auth_rate_limit.sql` dans le SQL Editor de Neon.
La migration crée la table `rateLimit` utilisée par Better Auth 1.7.28 et rend facultative,
si elle existe, l'ancienne colonne `account.issuer` exigée par les versions 1.7.0 à 1.7.2.
La migration est idempotente et transactionnelle. Faire une sauvegarde et prévoir une courte
fenêtre de maintenance auth. Dans le SQL Editor, vérifier la base et les comptes avant l'application :

```sql
SELECT current_database(), current_schema();

SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = current_schema()
  AND table_name = 'account'
  AND column_name = 'issuer';

SELECT to_regclass('"account_issuer_accountId_uidx"') IS NOT NULL AS legacy_issuer_index_exists;

SELECT count(*) AS duplicate_provider_account_groups
FROM (
  SELECT "providerId", "accountId"
  FROM "account"
  GROUP BY "providerId", "accountId"
  HAVING count(*) > 1
) AS duplicates;
```

Ne pas appliquer la migration si la base, le schéma ou des doublons inattendus sont détectés;
vérifier aussi que le rôle utilisé par l'application peut lire, insérer, mettre à jour et supprimer
dans `rateLimit`.
Les appels sont limités à 5 connexions et 3 inscriptions par minute. Le formulaire utilise les
endpoints HTTP Better Auth afin que cette limite s'applique; l'inscription ne connecte pas automatiquement
l'utilisateur pour retourner la même réponse qu'une adresse soit nouvelle ou déjà enregistrée.

### Activer un plan payant (manuel, pour les premiers clients)

L'éleveur paie par Orange Money et vous écrit ; vous activez :

```bash
npm run plan:activer -- eleveur@mail.com troupeau 12 "OM 4521-7788"
```

`12` = nombre de mois (0 = sans échéance). Le retour au gratuit : `npm run plan:activer -- eleveur@mail.com eleveur`.
Sans ligne dans `abonnement`, un compte est en plan Éleveur (gratuit, 20 têtes, 1 passeport/an).

---

## 4. Lancer et vérifier

```bash
npm run dev
```

Parcours à valider dans l'ordre :

1. `/auth/register` — créer un compte; le message de confirmation reste identique si l'adresse était déjà utilisée.
2. `/auth/login` — se connecter manuellement; après inscription, redirection attendue vers `/dashboard/onboarding`.
3. Déconnexion depuis l'en-tête, puis `/auth/login` — redirection attendue vers `/dashboard`.
4. `/dashboard/animaux` — ajouter un animal, **recharger la page** : il doit toujours être là.
5. `/dashboard/ventes` — vendre cet animal, vérifier qu'il disparaît du cheptel et apparaît dans le chiffre d'affaires.
6. Ouvrir un second compte : son cheptel doit être vide (cloisonnement par utilisateur).

---

## 5. Déploiement Vercel

Ajouter les trois variables dans **Project Settings → Environment Variables** :

- `DATABASE_URL` — la même connection string
- `BETTER_AUTH_SECRET` — le même secret qu'en local
- `BETTER_AUTH_URL` — l'URL de production, ex. `https://livestock-os.vercel.app`

`BETTER_AUTH_URL` doit correspondre exactement au domaine servi, sinon les redirections après connexion échouent.

---

## Notes

**Pourquoi Better Auth et non le SDK managé de Neon ?**
`@neondatabase/auth` était en `0.5.0-beta` au moment du choix, avec 82 000 téléchargements hebdomadaires.
Better Auth — la bibliothèque que ce SDK enveloppe — est verrouillée en `1.7.28` dans `package-lock.json`.
L'authentification d'un produit vendu n'est pas l'endroit où dépendre d'une bêta.

**Pourquoi les données métier ne sont-elles pas dans Neon ?**
Le produit doit fonctionner sans réseau : un éleveur saisit une pesée en brousse, pas au bureau.
Le stockage local est donc la source de vérité. La synchronisation vers Neon viendra par-dessus,
sans jamais devenir une condition d'utilisation.
