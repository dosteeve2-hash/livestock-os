import type { Metadata } from 'next'
import { historiqueDuCode, parCode } from '@/lib/passeport/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Vérification de passeport — LivestockOS',
  // Un lien de vérification circule entre l'éleveur et son prêteur, pas sur le web.
  robots: { index: false, follow: false },
}

function fcfa(n: number) {
  return n.toLocaleString('fr-FR')
}

function dateHeure(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function dateCourte(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function joursDepuis(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export default async function VerifierPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const snapshot = await parCode(decodeURIComponent(code).toUpperCase())

  if (!snapshot) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-white font-bold text-lg mb-2">Code introuvable</h1>
          <p className="text-white/50 text-sm">
            Aucun passeport ne correspond à ce code. Vérifiez la saisie, ou demandez à
            l&apos;éleveur de vous renvoyer le lien.
          </p>
        </div>
      </div>
    )
  }

  const historique = await historiqueDuCode(snapshot.code)
  const anciennete = historique.premierePublication
    ? joursDepuis(historique.premierePublication)
    : 0
  const suiviEtabli = historique.total >= 3 && anciennete >= 60

  return (
    <div className="min-h-screen bg-[#0A1628] px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Bandeau d'authenticité */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🐄</span>
          <span className="font-bold text-[#D4AF37]">LivestockOS</span>
          <span className="text-white/30 text-xs ml-auto font-mono">{snapshot.code}</span>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-4 mb-6 flex items-start gap-3">
          <span className="text-xl shrink-0">✅</span>
          <div>
            <p className="text-green-300 text-sm font-semibold">Relevé authentique</p>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              Publié le <strong className="text-white/90">{dateHeure(snapshot.publieLe)}</strong>.
              Cette date est enregistrée par le serveur au moment de la publication — elle ne peut
              pas être modifiée après coup.
            </p>
          </div>
        </div>

        {/* Antériorité — le vrai signal */}
        <div
          className={`rounded-xl px-4 py-4 mb-6 border ${
            suiviEtabli
              ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30'
              : 'bg-orange-500/10 border-orange-500/30'
          }`}
        >
          <p className={`text-sm font-semibold ${suiviEtabli ? 'text-[#D4AF37]' : 'text-orange-300'}`}>
            {suiviEtabli ? 'Suivi établi dans la durée' : 'Suivi récent'}
          </p>
          <p className="text-white/60 text-xs mt-1 leading-relaxed">
            {historique.total === 1 ? (
              <>
                Il s&apos;agit du <strong className="text-white/90">premier relevé</strong> publié
                par cet éleveur. Un relevé isolé ne permet pas de constater une régularité.
              </>
            ) : (
              <>
                <strong className="text-white/90">{historique.total} relevés</strong> publiés,
                le premier {historique.premierePublication ? `le ${dateCourte(historique.premierePublication)}` : ''}
                {anciennete > 0 && ` — soit ${anciennete} jours de suivi`}.
              </>
            )}
          </p>
        </div>

        {/* Identité */}
        <div className="border border-white/10 rounded-xl p-5 mb-4">
          <div className="text-white/40 text-[10px] uppercase tracking-wide mb-1">Éleveur</div>
          <div className="text-white font-semibold">{snapshot.payload.eleveur}</div>
        </div>

        {/* Chiffres */}
        <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
          Situation au jour de la publication
        </h2>
        <div className="border border-white/10 rounded-xl p-5 mb-5">
          <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-3xl font-bold text-[#D4AF37]">{snapshot.nbTetes}</div>
              <div className="text-white/40 text-[11px]">
                {snapshot.nbTetes > 1 ? 'têtes déclarées' : 'tête déclarée'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#00BCD4]">{fcfa(snapshot.valeurTotale)}</div>
              <div className="text-white/40 text-[11px]">FCFA — valeur estimée</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">{snapshot.couvertureVaccinale}%</div>
              <div className="text-white/40 text-[10px] mt-0.5">couverture vaccinale</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{fcfa(snapshot.revenus12m)}</div>
              <div className="text-white/40 text-[10px] mt-0.5">FCFA sur 12 mois</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{snapshot.payload.moisActifs}/12</div>
              <div className="text-white/40 text-[10px] mt-0.5">mois avec vente</div>
            </div>
          </div>
        </div>

        {/* Composition */}
        {snapshot.payload.parEspece && (
          <div className="border border-white/10 rounded-xl p-5 mb-5">
            <div className="text-white/40 text-[10px] uppercase tracking-wide mb-3">Composition</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {Object.entries(snapshot.payload.parEspece).map(([espece, n]) => (
                <div key={espece}>
                  <div className="text-white font-semibold text-sm">{n}</div>
                  <div className="text-white/40 text-[10px]">{espece}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ventes */}
        {snapshot.payload.ventes?.length > 0 && (
          <>
            <h2 className="text-[#D4AF37] font-semibold text-xs mb-3 uppercase tracking-wide">
              Ventes déclarées sur douze mois
            </h2>
            <div className="border border-white/10 rounded-xl p-5 mb-5 overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1.5 text-white/40 font-medium">Date</th>
                    <th className="text-left py-1.5 text-white/40 font-medium">Acheteur</th>
                    <th className="text-right py-1.5 text-white/40 font-medium">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.payload.ventes.slice(0, 12).map((v, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-1.5 text-white/60 whitespace-nowrap">
                        {new Date(v.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </td>
                      <td className="py-1.5 text-white/80">{v.acheteur}</td>
                      <td className="py-1.5 text-right text-[#D4AF37] font-semibold whitespace-nowrap">
                        {fcfa(v.prix)} F
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Portée du document — la partie qui rend le reste crédible */}
        <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
          <div className="text-white/60 text-xs font-semibold mb-3">Ce que ce relevé établit</div>
          <ul className="space-y-2 text-[11px] text-white/50 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-green-400 shrink-0">✓</span>
              <span>
                La <strong className="text-white/80">date de publication</strong>, horodatée par le
                serveur et non modifiable.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400 shrink-0">✓</span>
              <span>
                L&apos;<strong className="text-white/80">antériorité du suivi</strong> : combien de
                relevés cet éleveur a publiés, et depuis quand.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-400 shrink-0">✗</span>
              <span>
                <strong className="text-white/80">L&apos;existence physique des animaux.</strong> Les
                quantités et les valeurs sont saisies par l&apos;éleveur et n&apos;ont pas été
                contrôlées par un tiers.
              </span>
            </li>
          </ul>
          <p className="text-white/30 text-[10px] mt-4 leading-relaxed">
            Une visite de contrôle reste recommandée avant tout engagement financier. La régularité
            des publications dans le temps est le meilleur indicateur disponible dans ce document.
          </p>
        </div>

        <p className="text-center text-white/20 text-[10px] mt-6">
          Vérifié sur livestock-os.vercel.app — code {snapshot.code}
        </p>
      </div>
    </div>
  )
}
