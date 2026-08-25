type PrixMarche = {
  espece: string
  categorie: string
  prixMin: number
  prixMax: number
  prixMoyen: number
  variation: string
  tendance: 'hausse' | 'baisse' | 'stable'
  marche: string
  date: string
}

const MOCK_PRIX_MARCHE: PrixMarche[] = [
  {
    espece: 'Bovin',
    categorie: 'Taureau adulte',
    prixMin: 350000,
    prixMax: 600000,
    prixMoyen: 475000,
    variation: '+5.2%',
    tendance: 'hausse',
    marche: 'Marché Ouagadougou',
    date: '2026-07-13',
  },
  {
    espece: 'Bovin',
    categorie: 'Vache laitière',
    prixMin: 280000,
    prixMax: 450000,
    prixMoyen: 365000,
    variation: '+2.1%',
    tendance: 'hausse',
    marche: 'Marché Bobo-Dioulasso',
    date: '2026-07-13',
  },
  {
    espece: 'Bovin',
    categorie: 'Veau 6–12 mois',
    prixMin: 120000,
    prixMax: 200000,
    prixMoyen: 158000,
    variation: '+1.3%',
    tendance: 'stable',
    marche: 'Marché Ouagadougou',
    date: '2026-07-13',
  },
  {
    espece: 'Ovin',
    categorie: 'Mouton adulte',
    prixMin: 55000,
    prixMax: 95000,
    prixMoyen: 72000,
    variation: '-1.5%',
    tendance: 'baisse',
    marche: 'Marché Koudougou',
    date: '2026-07-13',
  },
  {
    espece: 'Ovin',
    categorie: 'Brebis',
    prixMin: 40000,
    prixMax: 70000,
    prixMoyen: 54000,
    variation: '-0.8%',
    tendance: 'baisse',
    marche: 'Marché Koudougou',
    date: '2026-07-13',
  },
  {
    espece: 'Caprin',
    categorie: 'Chèvre adulte',
    prixMin: 35000,
    prixMax: 65000,
    prixMoyen: 48000,
    variation: '+0.8%',
    tendance: 'stable',
    marche: 'Marché Koudougou',
    date: '2026-07-13',
  },
  {
    espece: 'Caprin',
    categorie: 'Bouc',
    prixMin: 42000,
    prixMax: 75000,
    prixMoyen: 57000,
    variation: '+1.1%',
    tendance: 'stable',
    marche: 'Marché Dori',
    date: '2026-07-13',
  },
]

const ESPECE_ICONS: Record<string, string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
}

function TendanceIcon({ tendance }: { tendance: PrixMarche['tendance'] }) {
  if (tendance === 'hausse') return <span className="text-green-400 font-bold">↑</span>
  if (tendance === 'baisse') return <span className="text-red-400 font-bold">↓</span>
  return <span className="text-[#00BCD4] font-bold">→</span>
}

function VariationBadge({ variation, tendance }: { variation: string; tendance: PrixMarche['tendance'] }) {
  const color =
    tendance === 'hausse'
      ? 'text-green-400 bg-green-500/10 border-green-500/20'
      : tendance === 'baisse'
      ? 'text-red-400 bg-red-500/10 border-red-500/20'
      : 'text-[#00BCD4] bg-[#00BCD4]/10 border-[#00BCD4]/20'
  return (
    <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${color}`}>
      {variation}
    </span>
  )
}

const ESPECES = ['Tous', 'Bovin', 'Ovin', 'Caprin']

const bonMomentVendre = MOCK_PRIX_MARCHE.filter(
  (p) => p.tendance === 'hausse' && parseFloat(p.variation) > 5
)

export default function MarchePage() {
  const groupes = ESPECES.slice(1).map((e) => ({
    espece: e,
    items: MOCK_PRIX_MARCHE.filter((p) => p.espece === e),
  }))

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#D4AF37]">📊 Prix du marché</h1>
        <p className="text-white/50 text-sm mt-1">Mis à jour le 13 juillet 2026</p>
      </div>

      {/* Recommandation */}
      {bonMomentVendre.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="text-green-400 font-semibold text-sm mb-1">
                Bon moment pour vendre !
              </div>
              {bonMomentVendre.map((p) => (
                <div key={p.categorie} className="text-white/70 text-xs">
                  • {p.categorie} en hausse de{' '}
                  <span className="text-green-400 font-medium">{p.variation}</span> — {p.marche}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {ESPECES.map((e) => (
          <button
            key={e}
            className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors"
          >
            {e}
          </button>
        ))}
      </div>

      {/* Prix par espèce */}
      {groupes.map(({ espece, items }) => (
        <div key={espece} className="mb-6">
          <h2 className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm mb-3 uppercase tracking-wide">
            <span className="text-base">{ESPECE_ICONS[espece]}</span>
            {espece}s
          </h2>
          <div className="space-y-3">
            {items.map((p) => (
              <div
                key={p.categorie}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#D4AF37]/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold text-sm">{p.categorie}</div>
                    <div className="text-white/40 text-xs mt-0.5">📍 {p.marche}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TendanceIcon tendance={p.tendance} />
                    <VariationBadge variation={p.variation} tendance={p.tendance} />
                  </div>
                </div>

                {/* Prix */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-white/40 text-[10px] mb-0.5">Min</div>
                    <div className="text-white/70 text-xs font-medium">
                      {(p.prixMin / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <div className="text-[#D4AF37]/60 text-[10px] mb-0.5">Moyen</div>
                    <div className="text-[#D4AF37] text-sm font-bold">
                      {(p.prixMoyen / 1000).toFixed(0)}K
                    </div>
                    <div className="text-white/30 text-[9px]">FCFA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/40 text-[10px] mb-0.5">Max</div>
                    <div className="text-white/70 text-xs font-medium">
                      {(p.prixMax / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Note */}
      <div className="mt-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <p className="text-white/40 text-xs text-center">
          ℹ️ Prix indicatifs basés sur les marchés locaux · Actualisés chaque semaine
        </p>
      </div>
    </div>
  )
}
