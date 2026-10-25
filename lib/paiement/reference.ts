/**
 * Code de référence à mettre dans le motif du transfert Orange Money.
 *
 * Dérivé de l'identifiant du compte : toujours le même pour un éleveur, ce qui
 * permet de rapprocher un transfert d'un compte sans lui demander son e-mail
 * au téléphone. Six caractères sans 0/O ni 1/I pour être dictés sans erreur.
 */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function referenceAbonne(userId: string): string {
  // FNV-1a 32 bits : stable, sans dépendance, suffisant pour un code d'affichage
  // (le rapprochement final se fait sur le compte, pas sur ce code seul).
  let h = 0x811c9dc5
  for (let i = 0; i < userId.length; i++) {
    h ^= userId.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[h % ALPHABET.length]
    h = Math.floor(h / ALPHABET.length)
  }
  return `LIV-${code}`
}

export type Periode = 'mois' | 'an'

export function estPeriode(v: unknown): v is Periode {
  return v === 'mois' || v === 'an'
}
