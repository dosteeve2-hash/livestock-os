# Handoff — sécurité de connexion LivestockOS

Mis à jour le 24 novembre 2026 à 23:03 (Europe/Istanbul).

## État du dépôt

- Worktree isolé : `C:\Users\pc\Documents\GitHub\_wt-autopilot-livestock-auth`.
- Branche : `autopilot/livestock-auth`, basée sur `origin/master` (`8021b816`). La PR #4 est déjà fusionnée.
- Le dépôt principal reste sur `master`, trois commits derrière `origin/master`, avec un dossier `.claude/` non suivi laissé intact.
- Commit local `d3b6591` créé; branche non poussée et aucune PR créée pour le moment.

## Changements préparés

- Better Auth configuré avec stockage `database` et règles HTTP : `/sign-in/email` 5 tentatives/60 s, `/sign-up/email` 3 tentatives/60 s.
- Les formulaires de connexion/inscription utilisent `authClient` via `/api/auth`; les anciennes Server Actions `auth.api.signInEmail/signUpEmail` ont été retirées car les appels `auth.api` serveur contournent le rate limit. Les appels serveur `auth.api.getSession` restants servent seulement à lire la session.
- `autoSignIn: false` empêche l'énumération d'adresses à l'inscription et renvoie les nouveaux utilisateurs vers la connexion, puis l'onboarding. Les formulaires utilisent `method="post"` pour ne pas placer les identifiants dans l'URL avant hydratation.
- Better Auth `1.7.28`, Next.js `16.4.6` et Vitest `4.1.12` remplacent les plages vulnérables; `npm audit fix` a trouvé des mises à jour semver compatibles.
- `scripts/migrations/003_better_auth_rate_limit.sql` crée `"rateLimit"`, et, si une ancienne migration Better Auth 1.7.0–1.7.2 l'avait créée, rend la colonne `account.issuer` facultative et retire son index legacy. Les étapes sont transactionnelles et idempotentes.
- `docs/SETUP-NEON.md` décrit la migration et le parcours d'inscription sans connexion automatique.

## Vérifications

- `npm run typecheck` : réussi après le build.
- `npm run build` : réussi, 20 routes. Le build local avertit que `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL` ne sont pas configurés; aucune valeur de secret n'a été lue ou écrite.
- `npm audit` : 0 vulnérabilité après mise à jour.
- `git diff --check` : réussi.
- Le parcours réel avec Neon, la table `rateLimit`, les cookies, le rate limit et les routes d'onboarding n'a pas été testé; la migration n'a pas été appliquée à Neon. Pas de déploiement ni de changement Production.

## Prochaines étapes

1. Avant déploiement, examiner le `search_path`, la table `account`, l'index `account_issuer_accountId_uidx`, les doublons `providerId/accountId` et les droits DDL/DML du rôle applicatif.
2. Appliquer la migration sur une base Preview isolée après sauvegarde; vérifier les 429, les délais, la réponse égale pour adresse nouvelle/existante, le cookie, connexion et déconnexion.
3. Confirmer la présence de `DATABASE_URL`, `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL` dans l'environnement Preview sans inscrire leurs valeurs dans les journaux.
4. Après revue, pousser la branche et ouvrir la PR demandée. Prévoir séparément la migration Production avant de déployer le code.
