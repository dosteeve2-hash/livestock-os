<p align="center"><img src="docs/brand/mark.svg" alt="LivestockOS" width="72" height="72"></p>

<h1 align="center">🐄 LivestockOS</h1>

> Système de gestion d'élevage mobile pour éleveurs sahéliens.

**Statut :** pilote en ligne https://livestock-os-ashy.vercel.app ; plans et limite gratuite affichés ; activation des abonnements manuelle (aucun paiement automatisé). Aucun client payant à ce jour.

[![Status](https://img.shields.io/badge/Status-Pilote-blue)](.)
[![Part of FORGE Afrika](https://img.shields.io/badge/FORGE%20Afrika-Ecosystem-D4AF37)](https://github.com/dosteeve2-hash/forge-afrika)

## 🎯 Problème résolu

Les éleveurs sahéliens (bovins, ovins, caprins) n'ont aucun outil de suivi. Pas de registre des animaux, pas de calendrier vaccinations, pas de traçabilité des ventes. En période de crise ou épizootie, ils n'ont aucune donnée pour réagir rapidement.

## 💡 Solution

LivestockOS est une application web mobile-first (manifeste PWA ; pas encore de service worker, donc le chargement de l'app sans réseau n'est pas garanti) dont les données du cheptel sont saisies et gardées sur l'appareil. Elle permet aux éleveurs de :
- Enregistrer leur cheptel avec identifiants uniques
- Suivre la santé animale et les vaccinations
- Gérer les ventes (naissances et décès : écran Mouvements en démonstration)
- Calculer la valeur de leur troupeau
- Publier un passeport vérifiable d'un animal (plan gratuit limité à 1 par an)

## 🎯 Cible

Éleveurs bovins, ovins, caprins — Burkina Faso, Niger, Mali (zone sahélienne).

## 🖥️ Fonctionnalités : état réel

| Module | État |
|--------|------|
| Cheptel (`/dashboard/animaux`) | Disponible : registre sur l'appareil (espèce, race, âge, poids) |
| Santé (`/dashboard/sante`) | Disponible : vaccinations, traitements, sur l'appareil |
| Ventes (`/dashboard/ventes`) | Disponible : sur l'appareil |
| Passeport (`/dashboard/passeport`, `/verifier/[code]`) | Disponible : publication et vérification par code, stockées dans Postgres |
| Comptes, plans et limite gratuite (`/tarifs`, `/payer`) | Disponible : plans Éleveur gratuit, Troupeau, Coopérative ; déclaration de paiement et activation manuelle |
| Mouvements, Marché, Rapports | Aperçu avec données d'exemple (bandeau affiché dans l'application) |
| Stocks (aliments, médicaments, matériel) | Prévu, pas d'écran |
| Prix du marché réels | Prévu, les prix affichés sont des exemples |
| Synchronisation des données du cheptel entre appareils | Prévu : elles restent locales |

## 🛠️ Stack

- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS
- Stockage local offline-first — le cheptel reste saisissable sans reseau
- Neon Postgres + Better Auth — comptes, abonnements, déclarations de paiement et passeports publiés (le cheptel, la santé et les ventes ne sont pas dans la base)
- Framer Motion + Recharts
- Vercel

> Mise en route : voir [docs/SETUP-NEON.md](./docs/SETUP-NEON.md)

## 🌍 Écosystème FORGE Afrika

LivestockOS fait partie de [FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika).

**Produits liés :**
- [ValueChain Connect](https://github.com/dosteeve2-hash/valuechain-connect) — Accès aux marchés B2B
- [AgroTrack BF](https://github.com/dosteeve2-hash/agrotrack-bf) — Gestion coopératives agricoles

## 🚀 Roadmap

- [x] Phase 1 : Registre cheptel + santé (local)
- [ ] Phase 2 : Suivi des mouvements (écran en démonstration pour l'instant) ; les ventes sont déjà en local
- [ ] Phase 3 : Prix marché en temps réel
- [ ] Phase 4 : Intégration ValueChain + traçabilité export

## 📬 Contact

**Steve Donald Compaore** — Fondateur FORGE Afrika
docompaore2@gmail.com
