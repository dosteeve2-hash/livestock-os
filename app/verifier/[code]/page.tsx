import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BadgeCheck, CircleAlert, ShieldCheck } from 'lucide-react'
import { historiqueDuCode, parCode } from '@/lib/passeport/db'
import PublicHeader from '@/components/public/PublicHeader'
import PublicFooter from '@/components/public/PublicFooter'
import SkipLink from '@/components/public/SkipLink'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Vérification de passeport — LivestockOS',
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

export default async function VerifierPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const snapshot = await parCode(decodeURIComponent(code).toUpperCase())

  if (!snapshot) {
    return (
      <>
        <SkipLink />
        <PublicHeader />
        <main id="contenu" className="paper-grain flex min-h-[70vh] items-center justify-center bg-paper px-5 py-16">
          <div className="max-w-md text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-paper-deep text-ochre" aria-hidden="true">
              <CircleAlert size={25} strokeWidth={1.6} />
            </span>
            <h1 className="mt-5 font-display text-3xl font-semibold text-leather">Code introuvable</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Aucun passeport ne correspond à ce code. Vérifiez la saisie ou demandez à l&apos;éleveur de vous renvoyer le lien.
            </p>
            <Link href="/" className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-leather/25 px-5 text-sm font-semibold text-leather hover:bg-paper-light">
              <ArrowLeft size={15} aria-hidden="true" /> Retour à l&apos;accueil
            </Link>
          </div>
        </main>
        <PublicFooter />
      </>
    )
  }

  const historique = await historiqueDuCode(snapshot.code)
  const anciennete = historique.premierePublication
    ? joursDepuis(historique.premierePublication)
    : 0
  const suiviEtabli = historique.total >= 3 && anciennete >= 60

  return (
    <>
      <SkipLink />
      <PublicHeader />
      <main id="contenu" className="paper-grain min-h-screen bg-paper px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre">Passeport du cheptel</p>
              <p className="mt-1 font-mono text-xs text-ink-muted">Code · {snapshot.code}</p>
            </div>
            <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-sage/25 bg-sage/[0.06] px-3 text-xs font-semibold text-sage">
              <BadgeCheck size={15} aria-hidden="true" /> Publication vérifiée
            </span>
          </div>

          <section className="rounded-[18px] border border-sage/20 bg-sage/[0.06] p-4 sm:p-5" aria-labelledby="titre-publication">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-sage" aria-hidden="true" />
              <div>
                <h1 id="titre-publication" className="font-display text-xl font-semibold text-sage sm:text-2xl">Date enregistrée par le serveur</h1>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Ce relevé a été publié le <strong className="text-ink">{dateHeure(snapshot.publieLe)}</strong>. La date de publication ne peut pas être modifiée après coup.
                </p>
              </div>
            </div>
          </section>

          <section className={`mt-4 rounded-[18px] border p-4 sm:p-5 ${suiviEtabli ? 'border-ochre/25 bg-ochre/[0.05]' : 'border-brick/20 bg-brick/[0.04]'}`} aria-labelledby="titre-anciennete">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">Historique de publication</p>
            <h2 id="titre-anciennete" className={`mt-2 font-display text-xl font-semibold ${suiviEtabli ? 'text-ochre' : 'text-brick'}`}>
              {suiviEtabli ? 'Plusieurs relevés publiés dans la durée' : 'Historique de publication récent'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {historique.total === 1 ? (
                <>Il s&apos;agit du <strong>premier relevé</strong> publié par cet éleveur. Un relevé isolé ne permet pas de constater une régularité.</>
              ) : (
                <><strong>{historique.total} relevés</strong> publiés, le premier {historique.premierePublication ? `le ${dateCourte(historique.premierePublication)}` : ''}{anciennete > 0 && `, soit ${anciennete} jours de suivi`}.</>
              )}
            </p>
          </section>

          <section className="mt-4 rounded-[18px] border border-leather/12 bg-paper-light p-5 sm:p-6" aria-labelledby="titre-releve">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-leather/12 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">Éleveur</p>
                <h2 id="titre-releve" className="mt-1 font-display text-2xl font-semibold text-leather">{snapshot.payload.eleveur}</h2>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Situation au jour de publication</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-muted">Têtes déclarées</p>
                <p className="mt-1 font-display text-3xl font-semibold text-ochre">{snapshot.nbTetes}</p>
              </div>
              <div className="rounded-xl bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-muted">Valeur estimée</p>
                <p className="mt-1 break-words font-display text-2xl font-semibold text-sage">{fcfa(snapshot.valeurTotale)} <span className="font-sans text-xs font-medium">FCFA</span></p>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="border-t border-leather/12 px-1 pt-3 sm:border-t-0 sm:border-l sm:pl-4">
                <p className="text-xs text-ink-muted">Couverture vaccinale déclarée</p>
                <p className="mt-1 font-display text-xl font-semibold text-sage">{snapshot.couvertureVaccinale}%</p>
              </div>
              <div className="border-t border-leather/12 px-1 pt-3 sm:border-l sm:border-t-0 sm:pl-4">
                <p className="text-xs text-ink-muted">Revenus déclarés sur 12 mois</p>
                <p className="mt-1 break-words font-display text-xl font-semibold text-ink">{fcfa(snapshot.revenus12m)} FCFA</p>
              </div>
              <div className="border-t border-leather/12 px-1 pt-3 sm:border-l sm:border-t-0 sm:pl-4">
                <p className="text-xs text-ink-muted">Mois avec vente</p>
                <p className="mt-1 font-display text-xl font-semibold text-ink">{snapshot.payload.moisActifs}/12</p>
              </div>
            </div>
          </section>

          {snapshot.payload.parEspece && (
            <section className="mt-4 rounded-[18px] border border-leather/12 bg-paper-light p-5 sm:p-6" aria-labelledby="titre-composition">
              <h2 id="titre-composition" className="font-display text-xl font-semibold text-leather">Composition déclarée</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(snapshot.payload.parEspece).map(([espece, nombre]) => (
                  <div key={espece} className="rounded-xl bg-paper p-3">
                    <dt className="text-xs text-ink-muted">{espece}</dt>
                    <dd className="mt-1 font-display text-xl font-semibold text-ink">{nombre}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {snapshot.payload.ventes?.length > 0 && (
            <section className="mt-4 rounded-[18px] border border-leather/12 bg-paper-light p-5 sm:p-6" aria-labelledby="titre-ventes">
              <h2 id="titre-ventes" className="font-display text-xl font-semibold text-leather">Ventes déclarées sur douze mois</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[430px] text-sm">
                  <thead>
                    <tr className="border-b border-leather/12 text-left text-xs text-ink-muted">
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 pr-3 font-medium">Acheteur</th>
                      <th className="py-2 text-right font-medium">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.payload.ventes.slice(0, 12).map((vente, index) => (
                      <tr key={`${vente.date}-${index}`} className="border-b border-leather/8 last:border-0">
                        <td className="whitespace-nowrap py-3 pr-3 text-ink-muted">{new Date(vente.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                        <td className="py-3 pr-3 text-ink">{vente.acheteur}</td>
                        <td className="whitespace-nowrap py-3 text-right font-medium text-ochre">{fcfa(vente.prix)} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="mt-4 rounded-[18px] border border-brick/20 bg-brick/[0.04] p-5 sm:p-6" aria-labelledby="titre-portee">
            <h2 id="titre-portee" className="font-display text-xl font-semibold text-leather">Ce que ce relevé établit</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              <li className="flex gap-2.5"><span className="mt-0.5 text-sage" aria-hidden="true">✓</span><span>La date de publication, horodatée par le serveur et non modifiable.</span></li>
              <li className="flex gap-2.5"><span className="mt-0.5 text-sage" aria-hidden="true">✓</span><span>Le nombre de relevés publiés et la date du premier relevé, lorsqu&apos;elle est disponible.</span></li>
              <li className="flex gap-2.5"><span className="mt-0.5 text-brick" aria-hidden="true">!</span><span>L&apos;existence physique des animaux et les montants ne sont pas contrôlés par un tiers ; ces données sont déclarées par l&apos;éleveur.</span></li>
            </ul>
            <p className="mt-4 border-t border-brick/15 pt-4 text-xs leading-relaxed text-ink-muted">
              Une visite de contrôle reste recommandée avant tout engagement financier. La régularité des publications ne remplace pas une vérification sur le terrain.
            </p>
          </section>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.13em] text-ink-muted">Passeport LivestockOS · {snapshot.code}</p>
        </div>
      </main>
      <PublicFooter />
    </>
  )
}
