import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/server'
import { abonnementDe } from '@/lib/plans/db'
import TarifsClient from './TarifsClient'
import PublicHeader from '@/components/public/PublicHeader'
import PublicFooter from '@/components/public/PublicFooter'
import SkipLink from '@/components/public/SkipLink'

export const metadata: Metadata = {
  title: 'Tarifs — LivestockOS',
  description: 'Un plan gratuit jusqu’à 20 têtes, puis des offres Troupeau et Coopérative activées manuellement.',
}

const ETAPES = [
  {
    n: '01',
    titre: 'Choisissez votre plan',
    texte: 'Le plan Éleveur est gratuit jusqu’à 20 têtes. Les plans payants étendent les limites de suivi et de passeports.',
  },
  {
    n: '02',
    titre: 'Payez et déclarez le transfert',
    texte: 'Sur la page Payer : envoyez le montant par Orange Money avec votre code, puis saisissez l’ID de transaction reçu par SMS.',
  },
  {
    n: '03',
    titre: 'L’activation est manuelle',
    texte: 'Nous vérifions le transfert puis activons le plan. Vous recevez une confirmation.',
  },
]

const FAQ = [
  {
    q: 'Que comprend le plan gratuit ?',
    r: 'Le plan Éleveur est gratuit jusqu’à 20 têtes. Il comprend le registre du cheptel, la santé, les ventes, le fonctionnement hors réseau et une publication de passeport par an.',
  },
  {
    q: 'Que prouve un passeport vérifiable ?',
    r: 'Le lien permet de consulter un relevé publié et sa date horodatée par le serveur. Les informations viennent des saisies de l’éleveur : le passeport ne confirme ni la présence physique des animaux ni leur valeur.',
  },
  {
    q: 'Que se passe-t-il si mon abonnement expire ?',
    r: 'Le compte revient au plan Éleveur. Les données déjà enregistrées ne sont pas supprimées.',
  },
  {
    q: 'Le paiement et l’activation sont-ils automatiques ?',
    r: 'Non. Vous payez par Orange Money et déclarez l’ID de transaction sur la page Payer. Le plan est activé manuellement après vérification.',
  },
]

export default async function TarifsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const abonnement = session
    ? await abonnementDe(session.user.id, session.user.email)
    : null

  const contactEmail = 'docompaore2@gmail.com'

  return (
    <>
      <SkipLink />
      <PublicHeader />
      <main id="contenu" className="paper-grain min-h-screen bg-paper">
        <section className="px-5 pb-10 pt-16 text-center sm:px-8 sm:pb-14 sm:pt-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre">Des tarifs lisibles</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.035em] text-leather sm:text-6xl">
            Un carnet gratuit pour commencer.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Jusqu&apos;à 20 têtes sans frais. Les plans payants s&apos;activent manuellement après vérification du transfert.
          </p>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-24" aria-label="Comparer les plans">
          <TarifsClient
            planActuel={abonnement?.effectif ?? null}
            connecte={Boolean(session)}
          />
          <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-ink-muted">
            Les prix affichés sont les tarifs des plans LivestockOS. Le paiement n&apos;est pas automatisé ; l&apos;activation intervient après vérification manuelle du transfert.
          </p>
        </section>

        <section className="bg-paper-light px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="titre-activer">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">Après le choix du plan</p>
              <h2 id="titre-activer" className="mt-3 font-display text-3xl font-semibold text-leather sm:text-4xl">Comment activer un plan</h2>
            </div>
            <ol className="mt-8 grid gap-3 md:grid-cols-3">
              {ETAPES.map((etape) => (
                <li key={etape.n} className="rounded-[16px] border border-leather/12 bg-paper p-5 sm:p-6">
                  <span className="font-mono text-xs text-brick">{etape.n} / 03</span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-leather">{etape.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{etape.texte}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-ink-muted">
              Contact : <a href={`mailto:${contactEmail}`} className="inline-flex min-h-[44px] items-center font-medium text-sage underline decoration-sage/35 underline-offset-4 hover:decoration-sage">{contactEmail}</a>
            </p>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="titre-faq">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre">Avant de commencer</p>
            <h2 id="titre-faq" className="mt-3 font-display text-3xl font-semibold text-leather sm:text-4xl">Questions fréquentes</h2>
            <div className="mt-7 divide-y divide-leather/15 border-y border-leather/15">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-5 font-medium text-ink marker:content-none">
                    {item.q}
                    <span aria-hidden="true" className="shrink-0 font-mono text-xl text-ochre transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pb-1 pr-8 text-sm leading-relaxed text-ink-soft">{item.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  )
}
