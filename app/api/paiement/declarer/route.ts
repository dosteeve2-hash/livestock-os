import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { declarerPaiement } from '@/lib/paiement/db'
import { estPeriode, referenceAbonne } from '@/lib/paiement/reference'
import { PLANS, estPlan } from '@/lib/plans/plans'

/** ID de transaction Orange Money : lettres, chiffres, points et tirets. */
const REF_TRANSFERT = /^[A-Za-z0-9.\-]{6,40}$/
/** Numéro burkinabè, avec ou sans indicatif. */
const TELEPHONE = /^(?:\+?226)?[0-9]{8}$/

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ erreur: 'non_authentifie' }, { status: 401 })
  }

  let corps: Record<string, unknown>
  try {
    corps = await request.json()
  } catch {
    return NextResponse.json({ erreur: 'corps_invalide' }, { status: 400 })
  }

  const plan = corps.plan
  const periode = corps.periode
  const referenceTransfert = String(corps.referenceTransfert ?? '').trim().toUpperCase()
  const telephone = String(corps.telephone ?? '').replace(/[\s.]/g, '')

  if (!estPlan(plan) || plan === 'eleveur' || !estPeriode(periode)) {
    return NextResponse.json({ erreur: 'plan_invalide' }, { status: 400 })
  }
  if (!REF_TRANSFERT.test(referenceTransfert)) {
    return NextResponse.json({ erreur: 'reference_invalide', message: 'Recopiez l’ID de transaction du SMS Orange Money.' }, { status: 400 })
  }
  if (!TELEPHONE.test(telephone)) {
    return NextResponse.json({ erreur: 'telephone_invalide', message: 'Indiquez le numéro à 8 chiffres qui a envoyé l’argent.' }, { status: 400 })
  }

  // Montant recalculé ici : le navigateur ne choisit pas le prix.
  const montant = periode === 'an' ? PLANS[plan].prixAnnuel : PLANS[plan].prixMensuel

  try {
    const resultat = await declarerPaiement({
      userId: session.user.id,
      email: session.user.email,
      plan,
      periode,
      montant,
      referenceAbonne: referenceAbonne(session.user.id),
      referenceTransfert,
      telephone,
    })
    if (resultat === 'deja_declaree') {
      return NextResponse.json({ erreur: 'deja_declaree', message: 'Cet ID de transaction a déjà été déclaré.' }, { status: 409 })
    }
    if (resultat === 'trop_de_demandes') {
      return NextResponse.json({ erreur: 'trop_de_demandes', message: 'Vous avez déjà des demandes en attente. Écrivez-nous si l’activation tarde.' }, { status: 429 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ erreur: 'indisponible', message: 'Enregistrement impossible pour le moment. Écrivez-nous avec l’ID de transaction.' }, { status: 503 })
  }
}
