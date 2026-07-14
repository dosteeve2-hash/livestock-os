type Mouvement = {
  id: string
  animal: string
  espece: string
  type: 'Sortie vente' | 'Entrée achat' | 'Transfert pâturage' | 'Naissance' | 'Décès'
  destination: string
  acheteur?: string
  vendeur?: string
  prix: number
  date: string
  statut: string
  transport: string
}

const MOCK_MOUVEMENTS: Mouvement[] = [
  {
    id: '1',
    animal: 'BV-001',
    espece: 'Bovin',
    type: 'Sortie vente',
    destination: 'Marché Ouaga',
    acheteur: 'Traoré Commerce',
    prix: 525000,
    date: '2026-07-12',
    statut: 'Finalisé',
    transport: 'Camion bétail',
  },
  {
    id: '2',
    animal: 'OV-003',
    espece: 'Ovin',
    type: 'Entrée achat',
    destination: 'Enclos 2',
    vendeur: 'Coopérative Dori',
    prix: 68000,
    date: '2026-07-11',
    statut: 'Finalisé',
    transport: 'Véhicule léger',
  },
  {
    id: '3',
    animal: 'BV-002',
    espece: 'Bovin',
    type: 'Transfert pâturage',
    destination: 'Pâturage Sud',
    prix: 0,
    date: '2026-07-10',
    statut: 'Effectué',
    transport: 'À pied',
  },
  {
    id: '4',
    animal: 'CP-002',
    espece: 'Caprin',
    type: 'Sortie vente',
    destination: 'Marché Koudougou',
    acheteur: 'Client particulier',
    prix: 45000,
    date: '2026-07-09',
    statut: 'Finalisé',
    transport: 'Moto',
  },
  {
    id: '5',
    animal: 'OV-004',
    espece: 'Ovin',
    type: 'Naissance',
    destination: 'Enclos 1',
    prix: 0,
    date: '2026-07-05',
    statut: 'Enregistré',
    transport: 'N/A',
  },
  {
    id: '6',
    animal: 'BV-004',
    espece: 'Bovin',
    type: 'Entrée achat',
    destination: 'Enclos principal',
    vendeur: 'Éleveur Kaboré',
    prix: 420000,
    date: '2026-07-03',
    statut: 'Finalisé',
    transport: 'Camion bétail',
  },
]

const TYPE_STYLES: Record<string, { color: string; bg: string; icon: string }> = {
  'Sortie vente': { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: '📤' },
  'Entrée achat': { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: '📥' },
  'Transfert pâturage': { color: 'text-[#00BCD4]', bg: 'bg-[#00BCD4]/10 border-[#00BCD4]/20', icon: '🔄' },
  Naissance: { color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20', icon: '🐣' },
  Décès: { color: 'text-white/50', bg: 'bg-white/5 border-white/10', icon: '✝️' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// Stats
const ventesJuillet = MOCK_MOUVEMENTS.filter(
  (m) => m.type === 'Sortie vente' && m.date.startsWith('2026-07')
).reduce((sum, m) => sum + m.prix, 0)

const achatsJuillet = MOCK_MOUVEMENTS.filter(
  (m) => m.type === 'Entrée achat' && m.date.startsWith('2026-07')
).reduce((sum, m) => sum + m.prix, 0)

const animauxVendus = MOCK_MOUVEMENTS.filter(
  (m) => m.type === 'Sortie vente' && m.date.startsWith('2026-07')
).length

export default function MouvementsPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#D4AF37]">🚛 Mouvements</h1>
        <p className="text-white/50 text-sm mt-1">Journal des entrées, sorties et transferts</p>
      </div>

      {/* Stats mois */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-red-400">
            {ventesJuillet > 0
              ? (ventesJuillet / 1000).toFixed(0) + 'K'
              : '0'}{' '}
            <span className="text-xs font-normal">F</span>
          </div>
          <div className="text-white/50 text-[11px] mt-1">Ventes juillet</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-green-400">
            {achatsJuillet > 0
              ? (achatsJuillet / 1000).toFixed(0) + 'K'
              : '0'}{' '}
            <span className="text-xs font-normal">F</span>
          </div>
          <div className="text-white/50 text-[11px] mt-1">Achats juillet</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[#D4AF37]">{animauxVendus}</div>
          <div className="text-white/50 text-[11px] mt-1">Vendus</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['Tous', 'Ventes', 'Achats', 'Transferts'].map((f) => (
          <button
            key={f}
            className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Journal */}
      <h2 className="text-[#D4AF37] font-semibold text-sm mb-3 uppercase tracking-wide">
        Journal
      </h2>
      <div className="space-y-3">
        {MOCK_MOUVEMENTS.map((m) => {
          const style = TYPE_STYLES[m.type] ?? TYPE_STYLES['Transfert pâturage']
          return (
            <div
              key={m.id}
              className={`border rounded-xl p-4 ${style.bg}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{style.icon}</span>
                  <div>
                    <span className="text-white font-semibold text-sm">{m.animal}</span>
                    <span className="text-white/40 text-xs ml-1">({m.espece})</span>
                  </div>
                </div>
                <span className="text-white/40 text-xs">{formatDate(m.date)}</span>
              </div>

              <div className="ml-8 space-y-1">
                <div className={`text-sm font-medium ${style.color}`}>{m.type}</div>
                <div className="text-white/60 text-xs">📍 {m.destination}</div>
                {m.acheteur && (
                  <div className="text-white/50 text-xs">👤 {m.acheteur}</div>
                )}
                {m.vendeur && (
                  <div className="text-white/50 text-xs">👤 {m.vendeur}</div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/40 text-xs">🚗 {m.transport}</span>
                  {m.prix > 0 && (
                    <span className={`font-bold text-sm ${style.color}`}>
                      {m.prix.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ajouter */}
      <div className="mt-6">
        <button className="w-full py-4 border-2 border-dashed border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-sm font-medium hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all">
          + Enregistrer un mouvement
        </button>
      </div>
    </div>
  )
}
