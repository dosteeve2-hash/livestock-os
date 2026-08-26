import type { Animal, Espece, Soin, Vente } from './types'

/**
 * Calculs dérivés du cheptel, partagés par le tableau de bord, la santé,
 * les ventes et les rapports.
 *
 * Un seul endroit pour définir ce que veut dire « ventes du mois » ou
 * « valeur du troupeau » : sinon deux écrans finissent par afficher deux
 * chiffres différents pour la même chose, et l'éleveur ne sait plus lequel croire.
 */

const ESPECES: Espece[] = ['Bovin', 'Ovin', 'Caprin', 'Volaille']

export function debutDuJour() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function moisISO(d: Date) {
  return d.toISOString().slice(0, 7)
}

function moisCourt(cle: string) {
  return new Date(`${cle}-01`).toLocaleDateString('fr-FR', { month: 'short' })
}

/** Les six derniers mois, du plus ancien au plus récent. */
function derniersMois(n = 6) {
  const cles: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    cles.push(moisISO(d))
  }
  return cles
}

export function cheptelVivant(animaux: Animal[]) {
  return animaux.filter((a) => !a.vendu)
}

export function valeurTroupeau(animaux: Animal[]) {
  return cheptelVivant(animaux).reduce((total, a) => total + a.valeur, 0)
}

export function repartitionEspeces(animaux: Animal[]) {
  const compte: Record<Espece, number> = { Bovin: 0, Ovin: 0, Caprin: 0, Volaille: 0 }
  for (const a of cheptelVivant(animaux)) compte[a.espece]++
  return compte
}

export function ventesDuMois(ventes: Vente[]) {
  const mois = moisISO(new Date())
  return ventes.filter((v) => v.date.startsWith(mois))
}

export function chiffreAffairesDuMois(ventes: Vente[]) {
  return ventesDuMois(ventes).reduce((total, v) => total + v.prix, 0)
}

export function impayes(ventes: Vente[]) {
  return ventes.filter((v) => v.paiement === 'Crédit').reduce((total, v) => total + v.prix, 0)
}

export function soinsDuMois(soins: Soin[]) {
  const mois = moisISO(new Date())
  return soins.filter((s) => s.date.startsWith(mois))
}

export function coutSoinsDuMois(soins: Soin[]) {
  return soinsDuMois(soins).reduce((total, s) => total + s.cout, 0)
}

/** Soins non faits dans les `jours` prochains, du plus urgent au moins urgent. */
export function soinsAVenir(soins: Soin[], jours = 7) {
  const debut = debutDuJour()
  const fin = new Date(debut)
  fin.setDate(fin.getDate() + jours)

  return soins
    .filter((s) => {
      if (s.statut === 'Fait') return false
      const d = new Date(s.date)
      return d >= debut && d <= fin
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function joursRestants(date: string) {
  const diff = new Date(date).getTime() - debutDuJour().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function animauxSousTraitement(soins: Soin[]) {
  return soins.filter((s) => s.statut === 'En cours' && s.type === 'Traitement')
}

/**
 * Effectif par espèce sur six mois, reconstitué à rebours : on part du cheptel
 * d'aujourd'hui et on retire les animaux enregistrés après chaque mois, puis on
 * rajoute ceux vendus depuis. Une reconstitution, pas un relevé — mais fondée
 * sur les saisies réelles, contrairement à une courbe inventée.
 */
export function serieCheptel(animaux: Animal[], ventes: Vente[]) {
  return derniersMois().map((cle) => {
    const finDuMois = `${cle}-31`

    const presents = animaux.filter((a) => {
      const dejaEnregistre = a.createdAt <= finDuMois
      if (!dejaEnregistre) return false
      const vente = ventes.find((v) => v.animalId === a.id)
      const dejaVendu = vente ? vente.date <= finDuMois : false
      return !dejaVendu
    })

    const point: Record<string, string | number> = { mois: moisCourt(cle) }
    for (const espece of ESPECES) {
      point[espece.toLowerCase() + 's'] = presents.filter((a) => a.espece === espece).length
    }
    return point
  })
}

/** Chiffre d'affaires mensuel sur six mois, en milliers de FCFA. */
export function serieVentes(ventes: Vente[]) {
  return derniersMois().map((cle) => ({
    mois: moisCourt(cle),
    montant: Math.round(
      ventes.filter((v) => v.date.startsWith(cle)).reduce((total, v) => total + v.prix, 0) / 1000
    ),
  }))
}

export interface Alerte {
  icon: string
  msg: string
  urgence: 'haute' | 'normale' | 'info'
}

/** Alertes classées par gravité : ce qui soigne d'abord, ce qui rapporte ensuite. */
export function alertes(animaux: Animal[], soins: Soin[], ventes: Vente[]): Alerte[] {
  const liste: Alerte[] = []

  for (const s of animauxSousTraitement(soins)) {
    liste.push({
      icon: '🩺',
      msg: `${s.animal} : ${s.description} — traitement en cours`,
      urgence: 'haute',
    })
  }

  for (const s of soinsAVenir(soins, 7)) {
    const j = joursRestants(s.date)
    liste.push({
      icon: s.type === 'Vaccination' ? '💉' : '📋',
      msg: `${s.animal} : ${s.description} — ${j <= 0 ? "aujourd'hui" : `dans ${j} jour${j > 1 ? 's' : ''}`}`,
      urgence: j <= 2 ? 'haute' : 'normale',
    })
  }

  const du = impayes(ventes)
  if (du > 0) {
    liste.push({
      icon: '⏳',
      msg: `${du.toLocaleString('fr-FR')} FCFA à recouvrer sur des ventes à crédit`,
      urgence: 'normale',
    })
  }

  const vivants = cheptelVivant(animaux)
  if (vivants.length === 0) {
    liste.push({
      icon: '🐄',
      msg: 'Aucun animal enregistré — commencez par ajouter votre cheptel',
      urgence: 'info',
    })
  }

  const ordre = { haute: 0, normale: 1, info: 2 }
  return liste.sort((a, b) => ordre[a.urgence] - ordre[b.urgence]).slice(0, 5)
}

export interface Mouvement {
  animal: string
  type: string
  montant: number
  date: string
}

/** Journal unifié des ventes et des soins, du plus récent au plus ancien. */
export function mouvementsRecents(soins: Soin[], ventes: Vente[], limite = 5): Mouvement[] {
  const depuisVentes: Mouvement[] = ventes.map((v) => ({
    animal: v.animalId,
    type: `Vente — ${v.acheteur}`,
    montant: v.prix,
    date: v.date,
  }))

  const depuisSoins: Mouvement[] = soins.map((s) => ({
    animal: s.animal,
    type: `${s.type} — ${s.description}`,
    montant: -s.cout,
    date: s.date,
  }))

  return [...depuisVentes, ...depuisSoins]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limite)
}

export function formatFcfaCourt(montant: number) {
  if (Math.abs(montant) >= 1_000_000) return `${(montant / 1_000_000).toFixed(1)}M`
  if (Math.abs(montant) >= 1_000) return `${Math.round(montant / 1_000)}K`
  return String(montant)
}

/** « 1 animal », « 2 animaux » — le pluriel est irrégulier, il ne se devine pas. */
export function animauxPluriel(n: number) {
  return `${n} ${n > 1 ? 'animaux' : 'animal'}`
}
