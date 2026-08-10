import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

const STATS = [
  { label: 'Animaux total',   value: '47',    icon: '🐄', color: 'text-[#D4AF37]',    detail: 'Bovins + Ovins + Caprins' },
  { label: 'Valeur troupeau', value: '12.4M', icon: '💰', color: 'text-[#00BCD4]',    detail: 'FCFA estimé' },
  { label: 'Vaccinations',    value: '3',     icon: '🩺', color: 'text-orange-400',   detail: 'À planifier ce mois' },
  { label: 'Ventes août',     value: '420K',  icon: '📊', color: 'text-green-400',    detail: 'FCFA ce mois' },
  { label: 'Taux mortalité',  value: '0%',    icon: '❤️', color: 'text-emerald-400',  detail: 'Aucun décès ce mois' },
  { label: 'Naissances',      value: '2',     icon: '🐣', color: 'text-purple-400',   detail: 'Ce mois — veaux' },
]

const ALERTES = [
  { icon: '🩺', msg: 'OV-003 : Traitement antiparasitaire à compléter avant le 15/08', urgence: 'haute' },
  { icon: '💉', msg: 'BV-001 : Rappel vaccin fièvre aphteuse — rappel décembre', urgence: 'normale' },
  { icon: '📊', msg: 'Taureau adulte +5.2% cette semaine — bon moment pour vendre', urgence: 'info' },
]

const MOUVEMENTS = [
  { animal: 'BV-001', type: 'Sortie vente',       montant: 525000, date: '12 août' },
  { animal: 'OV-003', type: 'Entrée achat',        montant: 68000,  date: '11 août' },
  { animal: 'CP-002', type: 'Transfert pâturage',  montant: 0,      date: '10 août' },
  { animal: 'BV-004', type: 'Sortie vente',        montant: 680000, date: '08 août' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const prenom = user?.user_metadata?.nom?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Éleveur'

  return (
    <DashboardClient
      prenom={prenom}
      stats={STATS}
      alertes={ALERTES}
      mouvements={MOUVEMENTS}
    />
  )
}
