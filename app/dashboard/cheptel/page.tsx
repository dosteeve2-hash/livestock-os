import Link from 'next/link'

type Animal = {
  id: string
  espece: string
  sexe: string
  age: string
  poids: string
  statut: string
  valeur: number
}

const MOCK_ANIMAUX: Animal[] = [
  { id: 'BV-001', espece: 'Bovin', sexe: 'Mâle', age: '4 ans', poids: '380 kg', statut: 'Sain', valeur: 485000 },
  { id: 'BV-002', espece: 'Bovin', sexe: 'Femelle', age: '3 ans', poids: '290 kg', statut: 'Sain', valeur: 365000 },
  { id: 'BV-003', espece: 'Bovin', sexe: 'Femelle', age: '5 ans', poids: '310 kg', statut: 'Sain', valeur: 380000 },
  { id: 'OV-001', espece: 'Ovin', sexe: 'Mâle', age: '2 ans', poids: '45 kg', statut: 'Sain', valeur: 72000 },
  { id: 'OV-002', espece: 'Ovin', sexe: 'Femelle', age: '1.5 ans', poids: '38 kg', statut: 'Sain', valeur: 58000 },
  { id: 'OV-003', espece: 'Ovin', sexe: 'Mâle', age: '3 ans', poids: '52 kg', statut: 'Traitement', valeur: 78000 },
  { id: 'CP-001', espece: 'Caprin', sexe: 'Mâle', age: '2 ans', poids: '38 kg', statut: 'Sain', valeur: 52000 },
  { id: 'CP-002', espece: 'Caprin', sexe: 'Femelle', age: '1.5 ans', poids: '32 kg', statut: 'Sain', valeur: 48000 },
]

const ESPECES = ['Tous', 'Bovin', 'Ovin', 'Caprin']

const ICONS: Record<string, string> = {
  Bovin: '🐄',
  Ovin: '🐑',
  Caprin: '🐐',
}

function StatutBadge({ statut }: { statut: string }) {
  if (statut === 'Sain') {
    return (
      <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
        {statut}
      </span>
    )
  }
  return (
    <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
      {statut}
    </span>
  )
}

const totalValeur = MOCK_ANIMAUX.reduce((sum, a) => sum + a.valeur, 0)

export default function CheptelPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#D4AF37]">🐄 Cheptel</h1>
        <p className="text-white/50 text-sm mt-1">Registre de vos animaux</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-[#D4AF37]">{MOCK_ANIMAUX.length}</div>
          <div className="text-white/50 text-xs mt-1">Total animaux</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-[#00BCD4]">
            {(totalValeur / 1_000_000).toFixed(1)}M
          </div>
          <div className="text-white/50 text-xs mt-1">FCFA total</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {MOCK_ANIMAUX.filter((a) => a.statut !== 'Sain').length}
          </div>
          <div className="text-white/50 text-xs mt-1">En traitement</div>
        </div>
      </div>

      {/* Filtre espèces */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {ESPECES.map((e) => (
          <button
            key={e}
            className="shrink-0 px-4 py-2 rounded-full text-xs font-medium border border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors"
          >
            {e}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {MOCK_ANIMAUX.map((a) => (
          <div
            key={a.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ICONS[a.espece]}</span>
                <div>
                  <div className="font-bold text-white text-sm">{a.id}</div>
                  <div className="text-white/50 text-xs">{a.espece} · {a.sexe}</div>
                </div>
              </div>
              <StatutBadge statut={a.statut} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-3 text-xs text-white/60">
                <span>⚖️ {a.poids}</span>
                <span>🗓 {a.age}</span>
              </div>
              <div className="text-[#D4AF37] font-semibold text-sm">
                {a.valeur.toLocaleString('fr-FR')} F
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton ajouter */}
      <div className="mt-6">
        <button className="w-full py-4 border-2 border-dashed border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-sm font-medium hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all">
          + Ajouter un animal
        </button>
      </div>
    </div>
  )
}
