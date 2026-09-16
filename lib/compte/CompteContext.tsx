'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Plan } from '@/lib/plans/plans'

export interface Compte {
  userId: string
  /** Le compte demo@livestockos.app : seul à recevoir des données fictives. */
  estDemo: boolean
  /** Plan réellement applicable (un abonnement expiré retombe sur Éleveur). */
  plan: Plan
  planExpireLe: string | null
}

const CompteContext = createContext<Compte | null>(null)

export function CompteProvider({ compte, children }: { compte: Compte; children: ReactNode }) {
  return <CompteContext.Provider value={compte}>{children}</CompteContext.Provider>
}

export function useCompte() {
  const compte = useContext(CompteContext)
  if (!compte) {
    throw new Error('useCompte doit être utilisé dans le layout /dashboard')
  }
  return compte
}

/** Cloisonne les données par compte : le cheptel de démo ne pollue pas celui d'un vrai éleveur. */
export function useUserId() {
  return useCompte().userId
}
