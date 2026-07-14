import { ValeurTroupeauChart, VentesAchatsChart } from './ChartSection'

type BilanMois = {
  mois: string
  animauxDebut: number
  animauxFin: number
  valeurTotal: number
  variation: number
  ventes: number
  achats: number
}

const BILAN: BilanMois[] = [
  { mois: 'Mai 2026', animauxDebut: 44, animauxFin: 46, valeurTotal: 12000000, variation: +4.5, ventes: 520000, achats: 150000 },
  { mois: 'Juin 2026', animauxDebut: 46, animauxFin: 47, valeurTotal: 12200000, variation: +1.7, ventes: 380000, achats: 320000 },
  { mois: 'Juillet 2026', animauxDebut: 47, animauxFin: 47, valeurTotal: 12400000, variation: +1.6, ventes: 570000, achats: 488000 },
]

function VariationText({ val }: { val: number }) {
  if (val > 0) return <span className="text-green-400">+{val.toFixed(1)}%</span>
  if (val < 0) return <span className="text-red-400">{val.toFixed(1)}%</span>
  return <span className="text-white/50">0%</span>
}

export default function RapportsPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#D4AF37]">📈 Rapports</h1>
        <p className="text-white/50 text-sm mt-1">Analyse de votre élevage</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-[#D4AF37] text-xl font-bold">12.4M</div>
          <div className="text-white/50 text-xs mt-1">Valeur troupeau (FCFA)</div>
          <div className="text-green-400 text-xs mt-1">+21.6% sur 12 mois</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-[#00BCD4] text-xl font-bold">47</div>
          <div className="text-white/50 text-xs mt-1">Animaux en stock</div>
          <div className="text-white/30 text-xs mt-1">+3 depuis août 2025</div>
        </div>
      </div>

      {/* Chart 1 — Valeur troupeau */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-sm mb-4">
          Valeur du troupeau — 12 mois
        </h2>
        <ValeurTroupeauChart />
      </div>

      {/* Chart 2 — Ventes / Achats */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-sm mb-4">
          Ventes & Achats — 6 mois (en milliers FCFA)
        </h2>
        <VentesAchatsChart />
      </div>

      {/* Table bilan */}
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
              {BILAN.map((b) => (
                <tr key={b.mois} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-3 py-3 text-white/80 font-medium">{b.mois}</td>
                  <td className="px-3 py-3 text-right text-white/70">
                    {b.animauxDebut}→{b.animauxFin}
                  </td>
                  <td className="px-3 py-3 text-right text-[#D4AF37] font-semibold">
                    {(b.valeurTotal / 1_000_000).toFixed(1)}M
                  </td>
                  <td className="px-3 py-3 text-right">
                    <VariationText val={b.variation} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
