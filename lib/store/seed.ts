import type { Animal, Soin, Vente } from './types'

/**
 * Les dates de démarrage sont relatives au jour d'installation : un rappel de
 * vaccination "dans 5 jours" doit rester dans 5 jours, quelle que soit la date
 * à laquelle l'éleveur ouvre l'app pour la première fois.
 */
function jour(decalage: number) {
  const d = new Date()
  d.setDate(d.getDate() + decalage)
  return d.toISOString().slice(0, 10)
}

/** Cheptel de démarrage — races réellement élevées au Sahel. */
export const ANIMAUX_SEED: Animal[] = [
  { id: 'BV-001', espece: 'Bovin', race: 'Zébu Peul', sexe: 'Mâle', age: '4 ans', poids: '380 kg', etatSante: 'Sain', dateVaccination: jour(130), valeur: 485000, vendu: false, createdAt: jour(-54) },
  { id: 'BV-002', espece: 'Bovin', race: 'Zébu Peul', sexe: 'Femelle', age: '3 ans', poids: '290 kg', etatSante: 'Sain', dateVaccination: jour(88), valeur: 365000, vendu: false, createdAt: jour(-54) },
  { id: 'BV-003', espece: 'Bovin', race: 'Azawak', sexe: 'Femelle', age: '5 ans', poids: '310 kg', etatSante: 'Observation', dateVaccination: jour(6), valeur: 380000, vendu: false, createdAt: jour(-54) },
  { id: 'OV-001', espece: 'Ovin', race: 'Mouton Djallonké', sexe: 'Mâle', age: '2 ans', poids: '45 kg', etatSante: 'Sain', dateVaccination: jour(2), valeur: 72000, vendu: false, createdAt: jour(-40) },
  { id: 'OV-002', espece: 'Ovin', race: 'Mouton Peul-Peul', sexe: 'Femelle', age: '1.5 ans', poids: '38 kg', etatSante: 'Sain', dateVaccination: jour(47), valeur: 58000, vendu: false, createdAt: jour(-40) },
  { id: 'OV-003', espece: 'Ovin', race: 'Mouton Djallonké', sexe: 'Mâle', age: '3 ans', poids: '52 kg', etatSante: 'Traitement', dateVaccination: jour(3), valeur: 78000, vendu: false, createdAt: jour(-40) },
  { id: 'CP-001', espece: 'Caprin', race: 'Chèvre Sahélienne', sexe: 'Mâle', age: '2 ans', poids: '38 kg', etatSante: 'Sain', dateVaccination: jour(4), valeur: 52000, vendu: false, createdAt: jour(-30) },
  { id: 'CP-002', espece: 'Caprin', race: 'Chèvre Rousse de Maradi', sexe: 'Femelle', age: '1.5 ans', poids: '32 kg', etatSante: 'Sain', dateVaccination: jour(39), valeur: 48000, vendu: false, createdAt: jour(-30) },
  { id: 'VL-001', espece: 'Volaille', race: 'Poule locale', sexe: 'Femelle', age: '8 mois', poids: '1.8 kg', etatSante: 'Sain', dateVaccination: jour(32), valeur: 4500, vendu: false, createdAt: jour(-20) },
  { id: 'VL-002', espece: 'Volaille', race: 'Poule locale', sexe: 'Femelle', age: '6 mois', poids: '1.5 kg', etatSante: 'Sain', dateVaccination: jour(32), valeur: 3800, vendu: false, createdAt: jour(-20) },
  { id: 'VL-003', espece: 'Volaille', race: 'Coq local', sexe: 'Mâle', age: '10 mois', poids: '2.2 kg', etatSante: 'Sain', dateVaccination: jour(32), valeur: 5200, vendu: false, createdAt: jour(-20) },
]

export const SOINS_SEED: Soin[] = [
  { id: 'S-001', date: jour(-1), animal: 'BV-001', groupe: 'Bovins', type: 'Vaccination', description: 'Fièvre aphteuse', veterinaire: 'Dr Konaté', cout: 15000, statut: 'Fait', prochaine: jour(130) },
  { id: 'S-002', date: jour(-4), animal: 'OV-003', groupe: 'Ovins', type: 'Traitement', description: 'Parasites intestinaux — Albendazole', veterinaire: 'Dr Diallo', cout: 8500, statut: 'En cours', prochaine: jour(3) },
  { id: 'S-003', date: jour(-13), animal: 'BV-002', groupe: 'Bovins', type: 'Vaccination', description: 'Charbon bactéridien', veterinaire: 'Dr Konaté', cout: 12000, statut: 'Fait', prochaine: jour(88) },
  { id: 'S-004', date: jour(4), animal: 'CP-001', groupe: 'Caprins', type: 'Vaccination', description: 'Pasteurellose', veterinaire: 'Dr Traoré', cout: 9000, statut: 'Planifié' },
  { id: 'S-005', date: jour(2), animal: 'OV-001', groupe: 'Ovins', type: 'Vaccination', description: 'Clavelée', veterinaire: 'Dr Diallo', cout: 7500, statut: 'Planifié' },
  { id: 'S-006', date: jour(6), animal: 'BV-003', groupe: 'Bovins', type: 'Contrôle', description: 'Bilan mensuel de santé', veterinaire: 'Dr Konaté', cout: 5000, statut: 'Planifié' },
  { id: 'S-007', date: jour(-9), animal: 'CP-002', groupe: 'Caprins', type: 'Traitement', description: 'Gale — Ivermectine', veterinaire: 'Dr Traoré', cout: 6000, statut: 'Fait' },
]

export const VENTES_SEED: Vente[] = [
  { id: 'V-001', animalId: 'OV-004', espece: 'Ovin', acheteur: 'Boucherie Rood Woko', date: jour(-22), prix: 68000, paiement: 'Orange Money', createdAt: jour(-22) },
  { id: 'V-002', animalId: 'CP-003', espece: 'Caprin', acheteur: 'Marché de Pouytenga', date: jour(-27), prix: 45000, paiement: 'Espèces', createdAt: jour(-27) },
  { id: 'V-003', animalId: 'BV-004', espece: 'Bovin', acheteur: 'Exportateur Sankara', date: jour(-8), prix: 410000, paiement: 'Crédit', createdAt: jour(-8) },
]
