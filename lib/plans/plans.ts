/**
 * Les plans LivestockOS.
 *
 * Fichier sans dépendance serveur : il est importé aussi bien par la page
 * /tarifs (publique) que par le garde-fou de publication du passeport.
 *
 * Le plan gratuit est borné pour que le passage payant soit naturel : un
 * éleveur de 20 têtes ne paie jamais ; celui de 60 têtes, qui a un troupeau
 * de plusieurs millions de FCFA, paie le prix d'une dose de vaccin par mois.
 */

export type Plan = 'eleveur' | 'troupeau' | 'cooperative'

export interface DefinitionPlan {
  id: Plan
  nom: string
  pourQui: string
  prixMensuel: number
  prixAnnuel: number
  /** null = illimité */
  maxTetes: number | null
  /** Passeports publiables sur 365 jours glissants ; null = illimité */
  passeportsParAn: number | null
  inclus: string[]
  misEnAvant?: boolean
}

export const PLANS: Record<Plan, DefinitionPlan> = {
  eleveur: {
    id: 'eleveur',
    nom: 'Éleveur',
    pourQui: 'Jusqu’à 20 têtes',
    prixMensuel: 0,
    prixAnnuel: 0,
    maxTetes: 20,
    passeportsParAn: 1,
    inclus: [
      'Registre du cheptel, santé et ventes',
      'Fonctionne sans réseau',
      '1 passeport vérifiable par an',
    ],
  },
  troupeau: {
    id: 'troupeau',
    nom: 'Troupeau',
    pourQui: 'Jusqu’à 200 têtes',
    prixMensuel: 3000,
    prixAnnuel: 30000,
    maxTetes: 200,
    passeportsParAn: null,
    inclus: [
      'Tout le plan Éleveur',
      'Passeports vérifiables illimités',
      'Rapports de rentabilité',
      'Historique complet pour la microfinance',
    ],
    misEnAvant: true,
  },
  cooperative: {
    id: 'cooperative',
    nom: 'Coopérative',
    pourQui: 'Membres illimités',
    prixMensuel: 25000,
    prixAnnuel: 250000,
    maxTetes: null,
    passeportsParAn: null,
    inclus: [
      'Tout le plan Troupeau',
      'Vue consolidée des membres',
      'Passeport de groupe pour la microfinance',
      'Accompagnement à la mise en place',
    ],
  },
}

export const ORDRE_PLANS: Plan[] = ['eleveur', 'troupeau', 'cooperative']

export function estPlan(v: unknown): v is Plan {
  return v === 'eleveur' || v === 'troupeau' || v === 'cooperative'
}

export function formatFcfa(n: number) {
  return n === 0 ? 'Gratuit' : `${n.toLocaleString('fr-FR')} FCFA`
}

/** Un abonnement expiré retombe sur le plan gratuit — sans perdre les données. */
export function planEffectif(plan: Plan, expireLe: string | null, maintenant = new Date()): Plan {
  if (plan === 'eleveur') return 'eleveur'
  if (expireLe && new Date(expireLe) < maintenant) return 'eleveur'
  return plan
}

export function tetesAutorisees(plan: Plan, nbTetes: number) {
  const max = PLANS[plan].maxTetes
  return max === null || nbTetes <= max
}
