# PRD — LivestockOS

## Vision

LivestockOS est la première application de gestion d'élevage conçue spécifiquement pour les éleveurs sahéliens. Mobile-first, offline-capable, interface ultra-simple — elle fonctionne là où la connectivité est faible et l'alphabétisation numérique limitée. L'objectif : donner aux éleveurs les données pour négocier, accéder aux financements et vendre au bon prix.

## Utilisateurs cibles

| Persona | Profil | Besoin principal |
|---------|--------|-----------------|
| Éleveur traditionnel | 20-50 têtes, peu alphabétisé | Registre cheptel simple, vaccinations |
| Éleveur commercial | 50-500 têtes | Suivi rentabilité, ventes, prix marché |
| Vétérinaire terrain | Prestataire | Accès registre santé du troupeau |
| Coopérative élevage | Groupement | Vue consolidée membres |

## Problèmes validés

1. **Zéro registre** — en cas d'épizootie ou de vol, aucune preuve de possession
2. **Vaccinations oubliées** — pas de calendrier, maladies évitables non prévenues
3. **Prix opaques** — les éleveurs vendent sans connaître le prix du marché
4. **Pas de valeur documentée** — impossible d'accéder à un crédit sans preuve de patrimoine

## Phase 1 — MVP (priorités)

### Fonctionnalités incluses

- [ ] Authentification (phone/OTP via Supabase Auth — pas d'email requis)
- [ ] Registre cheptel : ajout animal (espèce, race, sexe, âge estimé, poids, couleur)
- [ ] Identifiant unique par animal (QR code ou numéro séquentiel)
- [ ] Suivi santé : vaccinations (type, date, prochain rappel), traitements
- [ ] Alertes vaccinations à venir (J-7, J-0)
- [ ] Dashboard troupeau : effectif total par espèce, alertes santé du jour
- [ ] Mode offline complet avec sync Supabase Realtime au retour connectivité

### Fonctionnalités exclues de la Phase 1

- Mouvements (achats/ventes/naissances/décès) — Phase 2
- Prix marché en temps réel — Phase 3
- Intégration ValueChain Connect — Phase 4
- Rapports rentabilité — Phase 4

## Stack technique

- **Frontend** : Next.js 15 App Router + TypeScript strict + Tailwind CSS
- **PWA** : Workbox (offline-first, cache stratégies)
- **Backend** : Supabase (PostgreSQL + Realtime + Storage)
- **UI** : shadcn/ui + Framer Motion
- **Deploy** : Vercel
- **Emails** : Resend

## Modèle de données (Phase 1)

```
eleveurs
  id, telephone, nom, region, pays

animaux
  id, eleveur_id, espece (bovin|ovin|caprin), race, sexe, date_naissance_estimee,
  poids_kg, couleur, identifiant_unique, statut (actif|vendu|decede)

evenements_sante
  id, animal_id, type (vaccination|traitement|maladie), description,
  date_evenement, date_prochain_rappel, notes
```

## Métriques de succès Phase 1

- 20 éleveurs pilotes (Burkina Faso + Niger) onboardés
- 200 animaux enregistrés
- Taux de complétion du calendrier vaccinal > 60%
- App fonctionnelle offline pendant 72h sans perte de données
