import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATS = [
  { label: 'Animaux total', value: '47', icon: '🐄', color: 'text-[#D4AF37]', detail: 'Bovins + Ovins + Caprins' },
  { label: 'Valeur troupeau', value: '12.4M', icon: '💰', color: 'text-[#00BCD4]', detail: 'FCFA estimé' },
  { label: 'Vaccinations', value: '3', icon: '🩺', color: 'text-orange-400', detail: 'À planifier ce mois' },
  { label: 'Ventes juillet', value: '570K', icon: '📊', color: 'text-green-400', detail: 'FCFA ce mois' },
]

const RECENT_MOUVEMENTS = [
  { animal: 'BV-001', type: 'Sortie vente', montant: 525000, date: '12 juil.' },
  { animal: 'OV-003', type: 'Entrée achat', montant: 68000, date: '11 juil.' },
  { animal: 'BV-002', type: 'Transfert', montant: 0, date: '10 juil.' },
]

const ALERTES = [
  { icon: '🩺', msg: 'OV-003 : Traitement antiparasitaire à compléter', urgence: 'haute' },
  { icon: '💉', msg: 'BV-001 : Rappel vaccin fièvre aphteuse (déc.)', urgence: 'normale' },
  { icon: '📊', msg: 'Taureau adulte +5.2% cette semaine — bon moment pour vendre', urgence: 'info' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const prenom = user?.user_metadata?.nom?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Éleveur'

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Salutation */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">
          Bonjour, <span className="text-[#D4AF37]">{prenom}</span> 👋
        </h1>
        <p className="text-white/50 text-sm mt-1">Lundi 13 juillet 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <div className="text-white/70 text-xs font-medium">{s.label}</div>
            <div className="text-white/40 text-[11px] mt-0.5">{s.detail}</div>
          </div>
        ))}
      </div>

      {/* Alertes */}
      <div className="mb-6">
        <h2 className="text-[#D4AF37] font-semibold text-sm mb-3 uppercase tracking-wide">
          Alertes
        </h2>
        <div className="space-y-2">
          {ALERTES.map((a, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${
                a.urgence === 'haute'
                  ? 'bg-red-500/10 border-red-500/20'
                  : a.urgence === 'info'
                  ? 'bg-[#00BCD4]/10 border-[#00BCD4]/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-base mt-0.5">{a.icon}</span>
              <span className="text-white/80 text-xs leading-relaxed">{a.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Derniers mouvements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wide">
            Derniers mouvements
          </h2>
          <Link href="/dashboard/mouvements" className="text-[#00BCD4] text-xs">
            Voir tout →
          </Link>
        </div>
        <div className="space-y-2">
          {RECENT_MOUVEMENTS.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            >
              <div>
                <span className="text-white font-medium text-sm">{m.animal}</span>
                <span className="text-white/50 text-xs ml-2">{m.type}</span>
              </div>
              <div className="text-right">
                {m.montant > 0 && (
                  <div className="text-[#D4AF37] text-sm font-semibold">
                    {m.montant.toLocaleString('fr-FR')} F
                  </div>
                )}
                <div className="text-white/40 text-xs">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-[#D4AF37] font-semibold text-sm mb-3 uppercase tracking-wide">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/dashboard/animaux', label: '+ Ajouter animal', icon: '🐄' },
            { href: '/dashboard/sante', label: '+ Soin / vaccin', icon: '🩺' },
            { href: '/dashboard/mouvements', label: '+ Enregistrer vente', icon: '💰' },
            { href: '/dashboard/marche', label: 'Prix du marché', icon: '📊' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all"
            >
              <span className="text-xl">{a.icon}</span>
              <span className="text-white/80 text-xs font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
