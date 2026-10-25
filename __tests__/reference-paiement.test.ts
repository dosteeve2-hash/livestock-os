import { describe, it, expect } from 'vitest'

import { estPeriode, referenceAbonne } from '@/lib/paiement/reference'

describe('referenceAbonne', () => {
  it('donne toujours le même code pour un compte', () => {
    expect(referenceAbonne('user_abc')).toBe(referenceAbonne('user_abc'))
  })

  it('distingue deux comptes', () => {
    expect(referenceAbonne('user_abc')).not.toBe(referenceAbonne('user_abd'))
  })

  it('a le format LIV- plus six caractères dictables', () => {
    for (const id of ['', 'a', 'Xk29dL0pQ', 'un-identifiant-tres-long-de-better-auth']) {
      expect(referenceAbonne(id)).toMatch(/^LIV-[A-HJ-NP-Z2-9]{6}$/)
    }
  })
})

describe('estPeriode', () => {
  it('accepte mois et an seulement', () => {
    expect(estPeriode('mois')).toBe(true)
    expect(estPeriode('an')).toBe(true)
    expect(estPeriode('semaine')).toBe(false)
    expect(estPeriode(undefined)).toBe(false)
  })
})
