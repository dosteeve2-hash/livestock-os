import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/server'
import { demandesEnAttente } from '@/lib/paiement/db'
import { estPeriode, referenceAbonne, type Periode } from '@/lib/paiement/reference'
import { abonnementDe } from '@/lib/plans/db'
import { PLANS, estPlan, formatFcfa, type Plan } from '@/lib/plans/plans'
import PublicHeader from '@/components/public/PublicHeader'
import PublicFooter from '@/components/public/PublicFooter'
import SkipLink from '@/components/public/SkipLink'
import DeclarationForm from './DeclarationForm'

export const metadata: Metadata = {
  title: 'Payer — LivestockOS',
  description: 'Payer un plan LivestockOS par Orange Money. L’activation est faite à la main après vérification du transfert.',
  robots: { index: false },
}

const CONTACT_EMAIL = 'docompaore2@gmail.com'

function lireParams(sp: Record<string, string | string[] | undefined>): { plan: Exclude<Plan, 'eleveur'>; periode: Periode } {
  const plan = typeof sp.plan === 'string' && estPlan(sp.plan) && sp.plan !== 'eleveur' ? sp.plan : 'troupeau'
  const periode = typeof sp.periode === 'string' && estPeriode(sp.periode) ? sp.periode : 'an'
  return { plan, periode }
}

export default async function PayerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { plan, periode } = lireParams(await searchParams)
  const definition = PLANS[plan]
  const montant = periode === 'an' ? definition.prixAnnuel : definition.prixMensuel

  const session = await auth.api.getSession({ headers: await headers() })
  const abonnement = session ? await abonnementDe(session.user.id, session.user.email) : null
  const enAttente = session ? await demandesEnAttente(session.user.id) : []
  const reference = session ? referenceAbonne(session.user.id) : null

  // Numéro marchand : uniquement depuis l'environnement Vercel, jamais écrit dans le code.
  const numero = process.env.PAIEMENT_ORANGE_MONEY_NUMERO?.trim() || null
  const titulaire = process.env.PAIEMENT_ORANGE_MONEY_TITULAIRE?.trim() || null
  const whatsapp = process.env.NEXT_PUBLIC_ACTIVATION_WHATSAPP?.replace(/\D/g, '') || null

  const messageContact = `Bonjour, j'ai payé le plan ${definition.nom} de LivestockOS (${formatFcfa(montant)} ${periode === 'an' ? 'par an' : 'par mois'}).` +
    (session ? ` Compte : ${session.user.email}. Référence : ${reference}.` : '') + ' ID de transaction : '
  const lienContact = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(messageContact)}`
    : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Paiement plan ${definition.nom} — LivestockOS`)}&body=${encodeURIComponent(messageContact)}`

  return (
    <>
      <SkipLink />
      <PublicHeader />
      <main id="contenu" className="paper-grain min-h-screen bg-paper">
        <section className="px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre">Paiement par Orange Money</p>
            <h1 className="mt-4 font-display text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.03em] text-leather sm:text-5xl">
              Plan {definition.nom}, {formatFcfa(montant)} {periode === 'an' ? 'par an' : 'par mois'}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
              Le paiement n&apos;est pas automatique. Vous envoyez le montant par Orange Money, vous nous donnez l&apos;ID de transaction,
              et nous activons le plan à la main après vérification.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              {(['an', 'mois'] as const).map((p) => (
                <Link
                  key={p}
                  href={`/payer?plan=${plan}&periode=${p}`}
                  aria-current={p === periode ? 'true' : undefined}
                  className={`inline-flex min-h-[44px] items-center rounded-full border px-4 ${p === periode ? 'border-leather bg-leather text-paper-light' : 'border-leather/20 text-ink-soft hover:border-leather/50'}`}
                >
                  {p === 'an' ? `Annuel, ${formatFcfa(definition.prixAnnuel)}` : `Mensuel, ${formatFcfa(definition.prixMensuel)}`}
                </Link>
              ))}
              <Link href="/tarifs" className="inline-flex min-h-[44px] items-center px-2 text-sage underline underline-offset-4">Changer de plan</Link>
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8" aria-label="Étapes du paiement">
          <div className="mx-auto max-w-3xl space-y-4">
            {!session ? (
              <div className="rounded-[16px] border border-leather/12 bg-paper-light p-6">
                <h2 className="font-display text-xl font-semibold text-leather">Connectez-vous d&apos;abord</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Le plan s&apos;active sur votre compte. Connectez-vous ou créez un compte gratuit, puis revenez sur cette page depuis les tarifs.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/auth/login" className="inline-flex min-h-[48px] items-center rounded-full bg-leather px-5 text-sm font-semibold text-paper-light hover:bg-sage">Se connecter</Link>
                  <Link href="/auth/register" className="inline-flex min-h-[48px] items-center rounded-full border border-leather/25 px-5 text-sm font-semibold text-leather hover:border-sage">Créer un compte</Link>
                </div>
              </div>
            ) : (
              <>
                {abonnement && abonnement.effectif !== 'eleveur' && (
                  <p className="rounded-[12px] border border-sage/25 bg-sage/[0.06] p-4 text-sm text-sage">
                    Votre compte est déjà en plan {PLANS[abonnement.effectif].nom}
                    {abonnement.expireLe ? `, jusqu’au ${new Date(abonnement.expireLe).toLocaleDateString('fr-FR')}` : ''}. Un nouveau paiement prolonge ou change le plan.
                  </p>
                )}

                <ol className="space-y-4">
                  <li className="rounded-[16px] border border-leather/12 bg-paper-light p-6">
                    <span className="font-mono text-xs text-brick">01 / 03</span>
                    <h2 className="mt-3 font-display text-xl font-semibold text-leather">Envoyez {formatFcfa(montant)} par Orange Money</h2>
                    {numero ? (
                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-ink-muted">Numéro</dt>
                          <dd className="mt-1 font-mono text-2xl font-semibold tracking-wide text-ink">{numero}</dd>
                          {titulaire && <dd className="mt-1 text-ink-soft">Au nom de {titulaire}</dd>}
                        </div>
                        <div>
                          <dt className="text-ink-muted">Motif du transfert</dt>
                          <dd className="mt-1 font-mono text-2xl font-semibold tracking-wide text-ochre">{reference}</dd>
                          <dd className="mt-1 text-ink-soft">Votre code, toujours le même pour ce compte.</dd>
                        </div>
                      </dl>
                    ) : (
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                        Le numéro Orange Money de paiement n&apos;est pas encore affiché ici. Écrivez-nous et nous vous l&apos;envoyons, avec votre code <strong className="font-mono text-ochre">{reference}</strong>.
                      </p>
                    )}
                  </li>

                  <li className="rounded-[16px] border border-leather/12 bg-paper-light p-6">
                    <span className="font-mono text-xs text-brick">02 / 03</span>
                    <h2 className="mt-3 font-display text-xl font-semibold text-leather">Déclarez le transfert</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      Recopiez l&apos;ID de transaction reçu par SMS d&apos;Orange Money et le numéro qui a payé.
                    </p>
                    <DeclarationForm plan={plan} periode={periode} lienContact={lienContact} />
                    {enAttente.length > 0 && (
                      <div className="mt-5 border-t border-leather/10 pt-4">
                        <h3 className="text-sm font-semibold text-ink">Déjà déclaré, en attente de vérification</h3>
                        <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                          {enAttente.map((d) => (
                            <li key={d.referenceTransfert}>
                              {new Date(d.creeLe).toLocaleDateString('fr-FR')} : plan {estPlan(d.plan) ? PLANS[d.plan].nom : d.plan}, {formatFcfa(d.montant)}, ID <span className="font-mono">{d.referenceTransfert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>

                  <li className="rounded-[16px] border border-leather/12 bg-paper-light p-6">
                    <span className="font-mono text-xs text-brick">03 / 03</span>
                    <h2 className="mt-3 font-display text-xl font-semibold text-leather">Nous activons le plan</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      Nous vérifions le transfert dans notre historique Orange Money puis nous activons le plan sur votre compte. Ce n&apos;est pas instantané.
                      Si rien ne bouge, <a href={lienContact} target="_blank" rel="noreferrer" className="text-sage underline underline-offset-4">écrivez-nous</a>.
                    </p>
                  </li>
                </ol>
              </>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  )
}
