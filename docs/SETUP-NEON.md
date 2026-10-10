# Configuration Neon — 10 minutes

ÉlevageTrack utilise **Neon Postgres** pour l'authentification et **Better Auth** comme bibliothèque.
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
npx @better-auth/cli migrate
```

La commande lit `DATABASE_URL` depuis `.env.local` et applique le schéma sur Neon.
Répondre `y` à la demande de confirmation.

Pour seulement inspecter le SQL sans l'appliquer :

```bash
npx @better-auth/cli generate
```

---

## 4. Lancer et vérifier

```bash
npm run dev
```

Parcours à valider dans l'ordre :

1. `/auth/register` — créer un compte, redirection attendue vers `/dashboard/onboarding`
2. Déconnexion depuis l'en-tête
3. `/auth/login` — se reconnecter, redirection attendue vers `/dashboard`
4. `/dashboard/animaux` — ajouter un animal, **recharger la page** : il doit toujours être là
5. `/dashboard/ventes` — vendre cet animal, vérifier qu'il disparaît du cheptel et apparaît dans le chiffre d'affaires
6. Ouvrir un second compte : son cheptel doit être vide (cloisonnement par utilisateur)

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
Better Auth — la bibliothèque que ce SDK enveloppe — est en `1.7.1` stable avec 7,2 millions.
L'authentification d'un produit vendu n'est pas l'endroit où dépendre d'une bêta.

**Pourquoi les données métier ne sont-elles pas dans Neon ?**
Le produit doit fonctionner sans réseau : un éleveur saisit une pesée en brousse, pas au bureau.
Le stockage local est donc la source de vérité. La synchronisation vers Neon viendra par-dessus,
sans jamais devenir une condition d'utilisation.
