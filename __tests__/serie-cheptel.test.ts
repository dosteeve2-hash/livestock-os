import { describe, it, expect } from 'vitest'

import { ESPECES, cleEspece, serieCheptel } from '@/lib/store/derive'
import type { Animal, Espece, Vente } from '@/lib/store/types'

/**
 * Le défaut que ces tests verrouillent : le graphique de cheptel dessinait trois
 * courbes écrites à la main — bovins, ovins, caprins — alors que `ESPECES` en compte
 * QUATRE. Les volailles étaient comptées à chaque rendu et n'apparaissaient nulle part,
 * y compris pour les trois volailles des données de démonstration. Sur un logiciel
 * d'élevage burkinabè, la volaille n'est pas un cas marginal.
 */

let n = 0
function animal(espece: Espece, createdAt = '2026-01-01'): Animal {
  n += 1
  return {
    id: `A-${n}`,
    espece,
    createdAt,
    // Le reste du type est rempli au minimum : ces tests ne portent que sur le comptage.
  } as Animal
}

describe('serieCheptel — une valeur par espèce', () => {
  it('produit une clé pour CHAQUE espèce de ESPECES, sans exception', () => {
    const serie = serieCheptel(ESPECES.map((e) => animal(e)), [])
    expect(serie.length).toBeGreaterThan(0)
    for (const point of serie) {
      for (const espece of ESPECES) {
        expect(point, `${espece} absente du point ${point.mois}`)
          .toHaveProperty(cleEspece(espece))
      }
    }
  })

  it("compte les volailles comme les autres — c'est l'espèce qui était perdue", () => {
    const serie = serieCheptel([animal('Volaille'), animal('Volaille')], [])
    expect(serie.at(-1)?.volailles).toBe(2)
  })

  it('ne confond pas deux espèces', () => {
    const serie = serieCheptel([animal('Bovin'), animal('Volaille'), animal('Volaille')], [])
    const dernier = serie.at(-1)!
    expect(dernier.bovins).toBe(1)
    expect(dernier.volailles).toBe(2)
    expect(dernier.ovins).toBe(0)
    expect(dernier.caprins).toBe(0)
  })

  it('retire un animal vendu du mois de sa vente', () => {
    const bete = animal('Bovin', '2026-01-01')
    const vente = { animalId: bete.id, date: '2026-01-15' } as Vente
    const serie = serieCheptel([bete], [vente])
    expect(serie.at(-1)?.bovins).toBe(0)
  })
})

describe('cleEspece', () => {
  it('dérive la clé du nom, une seule fois pour tout le projet', () => {
    expect(cleEspece('Bovin')).toBe('bovins')
    expect(cleEspece('Volaille')).toBe('volailles')
  })

  it('couvre les quatre espèces sans doublon', () => {
    const cles = ESPECES.map(cleEspece)
    expect(new Set(cles).size).toBe(ESPECES.length)
    expect(ESPECES.length).toBe(4)
  })
})
