# 🐄 LivestockOS

> Système de gestion d'élevage mobile pour éleveurs sahéliens.

[![Status](https://img.shields.io/badge/Status-En%20conception-blue)](.)
[![Part of FORGE Afrika](https://img.shields.io/badge/FORGE%20Afrika-Ecosystem-D4AF37)](https://github.com/dosteeve2-hash/forge-afrika)

## 🎯 Problème résolu

Les éleveurs sahéliens (bovins, ovins, caprins) n'ont aucun outil de suivi. Pas de registre des animaux, pas de calendrier vaccinations, pas de traçabilité des ventes. En période de crise ou épizootie, ils n'ont aucune donnée pour réagir rapidement.

## 💡 Solution

LivestockOS est une PWA mobile-first qui permet aux éleveurs de :
- Enregistrer leur cheptel avec identifiants uniques
- Suivre la santé animale et les vaccinations
- Gérer les naissances, décès, ventes
- Calculer la valeur de leur troupeau
- Accéder aux prix du marché bétail

## 🎯 Cible

Éleveurs bovins, ovins, caprins — Burkina Faso, Niger, Mali (zone sahélienne).

## 🖥️ Fonctionnalités prévues

| Module | Description |
|--------|-------------|
| Cheptel | Registre animaux (espèce, race, âge, poids) |
| Santé | Vaccinations, traitements, maladies |
| Mouvements | Naissances, décès, achats, ventes |
| Stocks | Aliments, médicaments, matériel |
| Marché | Prix du jour par espèce |
| Rapports | Bilan troupeau, rentabilité |

## 🛠️ Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- PWA (offline-first) — Workbox
- Supabase (PostgreSQL + Realtime + Storage)
- shadcn/ui + Framer Motion
- Vercel

## 🌍 Écosystème FORGE Afrika

LivestockOS fait partie de [FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika).

**Produits liés :**
- [ValueChain Connect](https://github.com/dosteeve2-hash/valuechain-connect) — Accès aux marchés B2B
- [AgroTrack BF](https://github.com/dosteeve2-hash/agrotrack-bf) — Gestion coopératives agricoles

## 🚀 Roadmap

- [ ] Phase 1 : Registre cheptel + santé
- [ ] Phase 2 : Suivi mouvements + ventes
- [ ] Phase 3 : Prix marché en temps réel
- [ ] Phase 4 : Intégration ValueChain + traçabilité export

## 📬 Contact

**Steve Donald Compaore** — Fondateur FORGE Afrika
docompaore2@gmail.com
