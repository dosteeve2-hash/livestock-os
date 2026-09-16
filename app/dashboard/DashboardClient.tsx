'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Recharts mesure le DOM : pas de rendu serveur possible. `ssr: false` est le mecanisme
// prevu pour cela — sans effet, sans setState, sans rendu en cascade — et il retire
// Recharts du paquet initial, ce qui compte sur un Android d'entree de gamme en 2G.
const GraphiquesAccueil = dynamic(() => import('./GraphiquesAccueil'), {
  ssr: false,
  loading: () => (
    <div className="h-[140px] flex items-center justify-center text-white/20 text-xs">
      Chargement des graphiques…
    </div>
  ),
})
import { useCollection } from '@/lib/store/useCollection'
import { ANIMAUX_SEED, SOINS_SEED, VENTES_SEED } from '@/lib/store/seed'
import { COLLECTIONS, type Animal, type Soin, type Vente } from '@/lib/store/types'
import {
  alertes as calculerAlertes,
  chiffreAffairesDuMois,
  cheptelVivant,
  coutSoinsDuMois,
  formatFcfaCourt,
  joursRestants,
  mouvementsRecents,
  repartitionEspeces,
  serieCheptel,
  serieVentes,
  soinsAVenir,
  valeurTroupeau,
} from '@/lib/store/derive'
import { useUserId } from './UserContext'

interface Props {
  prenom: string
}

export default function DashboardClient({ prenom }: Props) {
  const userId = useUserId()
  const [animaux] = useCollection<Animal>(userId, COLLECTIONS.animaux, ANIMAUX_SEED)
  const [soins] = useCollection<Soin>(userId, COLLECTIONS.soins, SOINS_SEED)
  const [ventes] = useCollection<Vente>(userId, COLLECTIONS.ventes, VENTES_SEED)

  const stats = useMemo(() => {
    const vivants = cheptelVivant(animaux)
    const parEspece = repartitionEspeces(animaux)
    const prochains = soinsAVenir(soins, 30)
    return [
      { label: 'Animaux total', value: String(vivants.length), icon: '🐄', color: 'text-[#D4AF37]',
        detail: `${parEspece.Bovin} bovins · ${parEspece.Ovin} ovins · ${parEspece.Caprin} caprins` },
      { label: 'Valeur troupeau', value: formatFcfaCourt(valeurTroupeau(animaux)), icon: '💰', color: 'text-[#00BCD4]',
        detail: 'FCFA estimé' },
      { label: 'Soins à venir', value: String(prochains.length), icon: '🩺', color: 'text-orange-400',
        detail: 'Dans les 30 prochains jours' },
      { label: 'Ventes du mois', value: formatFcfaCourt(chiffreAffairesDuMois(ventes)), icon: '📊', color: 'text-green-400',
        detail: 'FCFA encaissés' },
      { label: 'Frais vétérinaires', value: formatFcfaCourt(coutSoinsDuMois(soins)), icon: '💊', color: 'text-purple-400',
        detail: 'FCFA ce mois' },
      { label: 'Volailles', value: String(parEspece.Volaille), icon: '🐔', color: 'text-emerald-400',
        detail: 'Têtes suivies' },
    ]
  }, [animaux, soins, ventes])

  const donneesCheptel = useMemo(() => serieCheptel(animaux, ventes), [animaux, ventes])
  const donneesVentes = useMemo(() => serieVentes(ventes), [ventes])
  const listeAlertes = useMemo(() => calculerAlertes(animaux, soins, ventes), [animaux, soins, ventes])
  const prochainsSoins = useMemo(() => soinsAVenir(soins, 30).slice(0, 4), [soins])
  const mouvements = useMemo(() => mouvementsRecents(soins, ventes), [soins, ventes])

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Salutation */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">
          Bonjour, <span className="text-[#D4AF37]">{prenom}</span> 👋
        </h1>
        <p className="text-white/50 text-sm mt-1">Tableau de bord élevage</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <div className="text-white/70 text-xs font-medium">{s.label}</div>
            <div className="text-white/40 text-[11px] mt-0.5">{s.detail}</div>
          </div>
        ))}
      </div>

      {/* Graphiques — charges sans SSR : Recharts mesure le DOM. */}
      <GraphiquesAccueil donneesCheptel={donneesCheptel} donneesVentes={donneesVentes} />

      {/* Alertes */}
      <div className="mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">Alertes sanitaires</h2>
        <div className="space-y-2">
          {listeAlertes.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${
              a.urgence === 'haute' ? 'bg-red-500/10 border-red-500/20'
              : a.urgence === 'info' ? 'bg-[#00BCD4]/10 border-[#00BCD4]/20'
              : 'bg-white/5 border-white/10'
            }`}>
              <span className="text-base mt-0.5">{a.icon}</span>
              <span className="text-white/80 text-xs leading-relaxed">{a.msg}</span>
            </div>
          ))}
          {listeAlertes.length === 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-base">✅</span>
              <span className="text-white/80 text-xs">Rien à signaler — aucun soin urgent ni impayé.</span>
            </div>
          )}
        </div>
      </div>

      {/* Vaccinations à venir */}
      <div className="mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">Vaccinations à venir</h2>
        <div className="space-y-2">
          {prochainsSoins.map((v) => {
            const j = joursRestants(v.date)
            return (
              <div key={v.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="min-w-0">
                  <span className="text-white font-medium text-sm">{v.animal}</span>
                  <span className="text-white/50 text-xs ml-2">{v.description}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {j <= 2 && <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />}
                  <span className="text-white/50 text-xs">J-{j}</span>
                </div>
              </div>
            )
          })}
          {prochainsSoins.length === 0 && (
            <div className="text-white/40 text-xs px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
              Aucun soin planifié dans les 30 prochains jours.
            </div>
          )}
        </div>
      </div>

      {/* Derniers mouvements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#D4AF37] font-semibold text-xs uppercase tracking-wide">Derniers mouvements</h2>
          <Link href="/dashboard/mouvements" className="text-[#00BCD4] text-xs">Voir tout →</Link>
        </div>
        <div className="space-y-2">
          {mouvements.map((m, i) => (
            <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div>
                <span className="text-white font-medium text-sm">{m.animal}</span>
                <span className="text-white/50 text-xs ml-2">{m.type}</span>
              </div>
              <div className="text-right">
                {m.montant > 0 && (
                  <div className="text-[#D4AF37] text-sm font-semibold">{m.montant.toLocaleString('fr-FR')} F</div>
                )}
                <div className="text-white/40 text-xs">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/dashboard/animaux', label: '+ Ajouter animal', icon: '🐄' },
            { href: '/dashboard/sante',   label: '+ Soin / vaccin',  icon: '🩺' },
            { href: '/dashboard/ventes',  label: '+ Enregistrer vente', icon: '💰' },
            { href: '/dashboard/marche',  label: 'Prix du marché', icon: '📊' },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all">
              <span className="text-xl">{a.icon}</span>
              <span className="text-white/80 text-xs font-medium">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* Le passeport est ce qui ouvre l'accès au crédit : il mérite sa propre place. */}
        <Link
          href="/dashboard/passeport"
          className="mt-3 flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl px-4 py-4 hover:bg-[#D4AF37]/15 transition-all"
        >
          <span className="text-2xl shrink-0">📄</span>
          <span className="min-w-0">
            <span className="block text-[#D4AF37] text-sm font-semibold">Passeport du cheptel</span>
            <span className="block text-white/50 text-[11px] mt-0.5">
              Dossier imprimable à présenter à une microfinance
            </span>
          </span>
          <span className="text-[#D4AF37] ml-auto shrink-0">→</span>
        </Link>
      </div>
    </div>
  )
}
