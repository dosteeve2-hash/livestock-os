export type Espece = 'Bovin' | 'Ovin' | 'Caprin' | 'Volaille'
export type Sexe = 'Mâle' | 'Femelle'
export type EtatSante = 'Sain' | 'Traitement' | 'Observation'
export type TypeSoin = 'Vaccination' | 'Traitement' | 'Contrôle'
export type StatutSoin = 'Planifié' | 'En cours' | 'Fait'
export type ModePaiement = 'Espèces' | 'Orange Money' | 'Moov Money' | 'Crédit'

export interface Animal {
  id: string
  espece: Espece
  race: string
  sexe: Sexe
  age: string
  poids: string
  etatSante: EtatSante
  dateVaccination: string
  valeur: number
  vendu: boolean
  createdAt: string
}

export interface Soin {
  id: string
  date: string
  /** Identifiant de l'animal concerné, ex. BV-001. */
  animal: string
  groupe: string
  type: TypeSoin
  description: string
  veterinaire: string
  cout: number
  statut: StatutSoin
  /** Date du prochain rappel, absente si le soin n'en demande pas. */
  prochaine?: string
}

export interface Vente {
  id: string
  animalId: string
  espece: Espece
  acheteur: string
  date: string
  prix: number
  paiement: ModePaiement
  createdAt: string
}

export const COLLECTIONS = {
  animaux: 'animaux',
  soins: 'soins',
  ventes: 'ventes',
} as const

export const GROUPE_PAR_ESPECE: Record<Espece, string> = {
  Bovin: 'Bovins',
  Ovin: 'Ovins',
  Caprin: 'Caprins',
  Volaille: 'Volailles',
}
