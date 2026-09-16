'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

// Recharts mesure le DOM : il ne peut pas rendre cote serveur, et le faire monter dans
// un useEffect declenchait un rendu en cascade (react-hooks/set-state-in-effect).
// `ssr: false` est le mecanisme prevu pour cela — et il sort Recharts du paquet initial,
// ce qui compte sur un Android d'entree de gamme en 2G.
const Attente = ({ h }: { h: number }) => (
  <div
    style={{ height: h }}
    className="flex items-center justify-center text-white/20 text-xs"
  >
    Chargement du graphique…
  </div>
)

const ValeurTroupeauChart = dynamic(
  () => import('./ChartSection').then((m) => m.ValeurTroupeauChart),
  { ssr: false, loading: () => <Attente h={200} /> }
)
const VentesAchatsChart = dynamic(
  () => import('./ChartSection').then((m) => m.VentesAchatsChart),
  { ssr: false, loading: () => <Attente h={200} /> }
)
const ValeurTroupeauBarChart = dynamic(
  () => import('./ChartSection').then((m) => m.ValeurTroupeauBarChart),
  { ssr: false, loading: () => <Attente h={200} /> }
)

// ─── Types ────────────────────────────────────────────────────────────────────

type Espece = 'Bovin' | 'Ovin' | 'Caprin' | 'Volaille'
type Gravite = 'Faible' | 'Modérée' | 'Élevée'

interface Incident {
  id: string
  date: string
  espece: Espece
  animal: string
  description: string
  gravite: Gravite
}

// ─── Génération déterministe des données mensuelles ───────────────────────────

const MOIS_NOMS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]
const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
const ANNEES = [2025, 2026]

function genererDonneesMois(annee: number, moisIndex: number) {
  const moisEcoules = (annee - 2025) * 12 + moisIndex
  const tendance = moisEcoules * 0.12
  const saison = Math.sin((moisIndex / 12) * Math.PI * 2) * 0.4
  const valeur = +(9.5 + tendance + saison).toFixed(1)
  const animauxFin = Math.round(38 + moisEcoules * 0.32 + Math.sin(moisIndex) * 1.5)
  const animauxDebut = Math.round(animauxFin - (1 + Math.abs(Math.sin(moisIndex * 1.7)) * 3))
  const ventes = Math.round(280 + Math.abs(Math.sin(moisIndex * 1.3)) * 320)
  const achats = Math.round(140 + Math.abs(Math.cos(moisIndex * 1.1)) * 300)
  return { valeur, animauxDebut, animauxFin, ventes, achats }
}

function moisPrecedent(annee: number, moisIndex: number) {
  return moisIndex === 0 ? { annee: annee - 1, moisIndex: 11 } : { annee, moisIndex: moisIndex - 1 }
}

function derniersMois(annee: number, moisIndex: number, count: number) {
  const result: { mois: string; annee: number; moisIndex: number; valeur: number }[] = []
  let a = annee
  let m = moisIndex
  for (let i = 0; i < count; i++) {
    const { valeur } = genererDonneesMois(a, m)
    result.unshift({ mois: MOIS_COURTS[m], annee: a, moisIndex: m, valeur })
    const prec = moisPrecedent(a, m)
    a = prec.annee
    m = prec.moisIndex
  }
  return result
}

// ─── Répartition par espèce ────────────────────────────────────────────────────

const ESPECE_ICONS: Record<Espece, string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
  Volaille: '🐔',
}

const REPARTITION: Record<Espece, { effectifPct: number; valeurPct: number }> = {
  Bovin: { effectifPct: 0.35, valeurPct: 0.68 },
  Ovin: { effectifPct: 0.30, valeurPct: 0.14 },
  Caprin: { effectifPct: 0.20, valeurPct: 0.09 },
  Volaille: { effectifPct: 0.15, valeurPct: 0.09 },
}

// ─── Incidents sanitaires mock ─────────────────────────────────────────────────

const MOCK_INCIDENTS: Incident[] = [
  { id: '1', date: '2025-09-12', espece: 'Ovin', animal: 'OV-014', description: 'Parasites intestinaux traités', gravite: 'Faible' },
  { id: '2', date: '2025-11-03', espece: 'Bovin', animal: 'BV-007', description: 'Fièvre aphteuse — foyer isolé', gravite: 'Élevée' },
  { id: '3', date: '2026-01-20', espece: 'Caprin', animal: 'CP-009', description: 'Gale traitée à l\'ivermectine', gravite: 'Modérée' },
  { id: '4', date: '2026-03-08', espece: 'Volaille', animal: 'VL-021', description: 'Suspicion de coccidiose', gravite: 'Modérée' },
  { id: '5', date: '2026-05-15', espece: 'Bovin', animal: 'BV-003', description: 'Blessure à la patte — soignée', gravite: 'Faible' },
  { id: '6', date: '2026-07-10', espece: 'Ovin', animal: 'OV-003', description: 'Parasites intestinaux — en cours', gravite: 'Modérée' },
]

const GRAVITE_STYLES: Record<Gravite, string> = {
  Faible: 'bg-green-500/20 text-green-400 border-green-500/30',
  Modérée: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Élevée: 'bg-red-500/20 text-red-400 border-red-500/30',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function VariationText({ val }: { val: number }) {
  if (val > 0) return <span className="text-green-400">+{val.toFixed(1)}%</span>
  if (val < 0) return <span className="text-red-400">{val.toFixed(1)}%</span>
  return <span className="text-white/50">0%</span>
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function RapportsPage() {
  const [annee, setAnnee] = useState(2026)
  const [moisIndex, setMoisIndex] = useState(6) // Juillet

  const donnees = useMemo(() => genererDonneesMois(annee, moisIndex), [annee, moisIndex])
  const { annee: anneePrec, moisIndex: moisIndexPrec } = moisPrecedent(annee, moisIndex)
  const donneesPrec = useMemo(
    () => genererDonneesMois(anneePrec, moisIndexPrec),
    [anneePrec, moisIndexPrec],
  )
  const variationValeur = ((donnees.valeur - donneesPrec.valeur) / donneesPrec.valeur) * 100

  const bilan6Mois = useMemo(() => derniersMois(annee, moisIndex, 6), [annee, moisIndex])

  const incidentsMois = useMemo(() => {
    const prefixe = `${annee}-${String(moisIndex + 1).padStart(2, '0')}`
    return MOCK_INCIDENTS.filter(i => i.date.startsWith(prefixe))
  }, [annee, moisIndex])

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#D4AF37]">📈 Rapports</h1>
        <p className="text-white/50 text-sm mt-1">Analyse de votre élevage</p>
      </div>

      {/* Sélecteur mois / année */}
      <div className="flex gap-3 mb-5">
        <select
          value={moisIndex}
          onChange={e => setMoisIndex(Number(e.target.value))}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
        >
          {MOIS_NOMS.map((m, i) => (
            <option key={m} value={i} className="bg-[#0A1628]">{m}</option>
          ))}
        </select>
        <select
          value={annee}
          onChange={e => setAnnee(Number(e.target.value))}
          className="w-28 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
        >
          {ANNEES.map(a => (
            <option key={a} value={a} className="bg-[#0A1628]">{a}</option>
          ))}
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-[#D4AF37] text-xl font-bold">{donnees.valeur.toFixed(1)}M</div>
          <div className="text-white/50 text-xs mt-1">Valeur troupeau (FCFA)</div>
          <div className="text-xs mt-1">
            <VariationText val={variationValeur} /> vs mois précédent
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-[#00BCD4] text-xl font-bold">{donnees.animauxFin}</div>
          <div className="text-white/50 text-xs mt-1">Animaux en stock</div>
          <div className="text-white/30 text-xs mt-1">
            {donnees.animauxDebut}→{donnees.animauxFin} sur le mois
          </div>
        </div>
      </div>

      {/* Chart 1 — Valeur troupeau (vue longue) */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-sm mb-4">
          Valeur du troupeau — 12 mois
        </h2>
        <ValeurTroupeauChart />
      </div>

      {/* Chart 2 — Valeur troupeau 6 mois glissants (sélection) */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-sm mb-4">
          Valeur troupeau — 6 derniers mois ({MOIS_NOMS[moisIndex]} {annee})
        </h2>
        <ValeurTroupeauBarChart data={bilan6Mois} />
      </div>

      {/* Table bilan mensuel (6 mois glissants) */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-[#D4AF37] font-semibold text-sm">Bilan mensuel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 text-left text-white/40 font-medium">Mois</th>
                <th className="px-3 py-2 text-right text-white/40 font-medium">Animaux</th>
                <th className="px-3 py-2 text-right text-white/40 font-medium">Valeur</th>
                <th className="px-3 py-2 text-right text-white/40 font-medium">Variation</th>
              </tr>
            </thead>
            <tbody>
              {bilan6Mois.map(b => {
                const { animauxDebut, animauxFin } = genererDonneesMois(b.annee, b.moisIndex)
                const { annee: aPrec, moisIndex: mPrec } = moisPrecedent(b.annee, b.moisIndex)
                const prec = genererDonneesMois(aPrec, mPrec)
                const variation = ((b.valeur - prec.valeur) / prec.valeur) * 100
                return (
                  <tr key={`${b.annee}-${b.moisIndex}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3 text-white/80 font-medium">{b.mois} {b.annee}</td>
                    <td className="px-3 py-3 text-right text-white/70">{animauxDebut}→{animauxFin}</td>
                    <td className="px-3 py-3 text-right text-[#D4AF37] font-semibold">{b.valeur.toFixed(1)}M</td>
                    <td className="px-3 py-3 text-right">
                      <VariationText val={variation} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table détail par espèce */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-[#D4AF37] font-semibold text-sm">
            Détail par espèce — {MOIS_NOMS[moisIndex]} {annee}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 text-left text-white/40 font-medium">Espèce</th>
                <th className="px-3 py-2 text-right text-white/40 font-medium">Effectif</th>
                <th className="px-3 py-2 text-right text-white/40 font-medium">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(REPARTITION) as Espece[]).map(esp => {
                const { effectifPct, valeurPct } = REPARTITION[esp]
                const effectif = Math.round(donnees.animauxFin * effectifPct)
                const valeurEspece = donnees.valeur * valeurPct
                return (
                  <tr key={esp} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3 text-white/80 font-medium">
                      <span className="mr-1.5">{ESPECE_ICONS[esp]}</span>{esp}s
                    </td>
                    <td className="px-3 py-3 text-right text-white/70">{effectif}</td>
                    <td className="px-3 py-3 text-right text-[#D4AF37] font-semibold">{valeurEspece.toFixed(2)}M</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart 3 — Ventes / Achats */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-sm mb-4">
          Ventes & Achats — 6 mois (en milliers FCFA)
        </h2>
        <VentesAchatsChart />
      </div>

      {/* Incidents sanitaires */}
      <div className="mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          🚨 Incidents sanitaires — {MOIS_NOMS[moisIndex]} {annee}
        </h2>
        {incidentsMois.length > 0 ? (
          <div className="space-y-2">
            {incidentsMois.map(inc => (
              <div
                key={inc.id}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="text-lg shrink-0">{ESPECE_ICONS[inc.espece]}</span>
                  <div className="min-w-0">
                    <div className="text-white text-xs font-semibold">{inc.animal} — {inc.description}</div>
                    <div className="text-white/40 text-[10px] mt-0.5">{formatDate(inc.date)}</div>
                  </div>
                </div>
                <span className={`text-[10px] border px-2 py-0.5 rounded-full shrink-0 ${GRAVITE_STYLES[inc.gravite]}`}>
                  {inc.gravite}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-center">
            <span className="text-green-400 text-xs font-medium">✅ Aucun incident sanitaire ce mois</span>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <p className="text-white/40 text-xs text-center">
          ℹ️ Données issues de votre registre · Valeurs estimées sur prix marché
        </p>
      </div>
    </div>
  )
}
