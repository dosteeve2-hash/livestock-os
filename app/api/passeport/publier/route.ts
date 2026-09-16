import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { compterPublicationsDepuis, publier, type Payload } from '@/lib/passeport/db'
import { abonnementDe } from '@/lib/plans/db'
import { PLANS, tetesAutorisees } from '@/lib/plans/plans'

/** Bornes de bon sens : un troupeau de 100 000 têtes n'existe pas chez un éleveur. */
const MAX_TETES = 100_000
const MAX_MONTANT = 100_000_000_000

function entierBorne(v: unknown, max: number) {
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 && n <= max ? Math.round(n) : null
}

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

  const nbTetes = entierBorne(corps.nbTetes, MAX_TETES)
  const valeurTotale = entierBorne(corps.valeurTotale, MAX_MONTANT)
  const couvertureVaccinale = entierBorne(corps.couvertureVaccinale, 100)
  const revenus12m = entierBorne(corps.revenus12m, MAX_MONTANT)
  const nbVentes12m = entierBorne(corps.nbVentes12m, MAX_TETES)

  if (
    nbTetes === null ||
    valeurTotale === null ||
    couvertureVaccinale === null ||
    revenus12m === null ||
    nbVentes12m === null ||
    typeof corps.payload !== 'object' ||
    corps.payload === null
  ) {
    return NextResponse.json({ erreur: 'donnees_invalides' }, { status: 400 })
  }

  // Bornes du plan — vérifiées ici, pas dans le navigateur : c'est le seul
  // endroit que l'éleveur ne peut pas contourner.
  const abonnement = await abonnementDe(session.user.id, session.user.email)
  const plan = PLANS[abonnement.effectif]

  if (!tetesAutorisees(abonnement.effectif, nbTetes)) {
    return NextResponse.json(
      {
        erreur: 'plan_insuffisant',
        message: `Le plan ${plan.nom} couvre ${plan.maxTetes} têtes ; votre troupeau en compte ${nbTetes}. Passez au plan Troupeau pour publier.`,
      },
      { status: 402 }
    )
  }

  if (
    plan.passeportsParAn !== null &&
    (await compterPublicationsDepuis(session.user.id, 365)) >= plan.passeportsParAn
  ) {
    return NextResponse.json(
      {
        erreur: 'plan_insuffisant',
        message: `Le plan ${plan.nom} permet ${plan.passeportsParAn} publication par an. Passez au plan Troupeau pour publier sans limite.`,
      },
      { status: 402 }
    )
  }

  // Le nom affiché vient de la session, pas du client : on ne publie pas
  // un passeport au nom de quelqu'un d'autre.
  const payload: Payload = {
    ...(corps.payload as Payload),
    eleveur: session.user.name || session.user.email.split('@')[0],
  }

  const resultat = await publier(session.user.id, {
    nbTetes,
    valeurTotale,
    couvertureVaccinale,
    revenus12m,
    nbVentes12m,
    payload,
  })

  if ('erreur' in resultat) {
    return NextResponse.json(
      { erreur: resultat.erreur, message: 'Limite de 5 publications par 24 heures atteinte.' },
      { status: 429 }
    )
  }

  return NextResponse.json(resultat, { status: 201 })
}
