'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import { TOOLTIP_STYLE } from './tooltipStyle'
import { ESPECES, cleEspece, type PointCheptel } from '@/lib/store/derive'
import type { Espece } from '@/lib/store/types'

/**
 * Une couleur par espece. Le type `Record<Espece, …>` est exhaustif : ajouter une
 * espece au type Espece fait echouer la compilation ici tant qu'on ne lui a pas donne
 * son trait. C'est ce qui empeche le graphique de rediverger des donnees — il dessinait
 * trois courbes ecrites a la main pour QUATRE especes calculees, et les volailles
 * n'apparaissaient nulle part.
 */
const TRAIT: Record<Espece, { couleur: string; rempli: boolean }> = {
  Bovin: { couleur: '#D4AF37', rempli: true },
  Ovin: { couleur: '#00BCD4', rempli: true },
  Caprin: { couleur: '#a78bfa', rempli: false },
  Volaille: { couleur: '#f472b6', rempli: false },
}

interface PointVente {
  mois: string
  montant: number
}

/**
 * Les deux graphiques de la page d'accueil du tableau de bord.
 *
 * Ils vivaient dans DashboardClient derriere un drapeau `mounted` pose par un effet,
 * parce que Recharts mesure le DOM et ne peut pas rendre cote serveur. Mais appeler
 * setState dans un effet declenche un rendu en cascade — react-hooks/set-state-in-effect
 * le signale a juste titre. `next/dynamic` avec `ssr: false` est le mecanisme prevu pour
 * dire « ce composant ne rend pas sur le serveur », sans effet ni second rendu. Il sort
 * en prime Recharts du paquet initial, ce qui compte sur un telephone d'entree de gamme.
 */
export default function GraphiquesAccueil({
  donneesCheptel,
  donneesVentes,
}: {
  donneesCheptel: PointCheptel[]
  donneesVentes: PointVente[]
}) {
  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wide mb-3">Évolution cheptel</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={donneesCheptel}>
            <defs>
              {ESPECES.filter((e) => TRAIT[e].rempli).map((e) => (
                <linearGradient key={e} id={cleEspece(e)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={TRAIT[e].couleur} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={TRAIT[e].couleur} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            {ESPECES.map((espece) => (
              <Area
                key={espece}
                type="monotone"
                dataKey={cleEspece(espece)}
                name={`${espece}s`}
                stroke={TRAIT[espece].couleur}
                fill={TRAIT[espece].rempli ? `url(#${cleEspece(espece)})` : 'none'}
                strokeWidth={TRAIT[espece].rempli ? 2 : 1.5}
                strokeDasharray={TRAIT[espece].rempli ? undefined : '4 2'}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
       <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wide mb-3">Ventes (k FCFA)</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={donneesVentes}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}k`} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v}k FCFA`, 'Ventes'] as [string, string]} />
            <Bar dataKey="montant" fill="#D4AF37" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
