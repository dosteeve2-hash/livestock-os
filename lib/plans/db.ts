import { Pool } from 'pg'
import { estPlan, planEffectif, type Plan } from './plans'

/**
 * Abonnements — une ligne par compte, absence de ligne = plan Éleveur (gratuit).
 *
 * L'activation est manuelle pour les premiers clients : paiement Orange Money,
 * puis `npm run plan:activer -- <email> troupeau 12`. Un agrégateur viendra
 * quand il y aura plus de dix payeurs — pas avant.
 *
 * Schéma : scripts/migrations/001_abonnement.sql
 */

let pool: Pool | null = null

function db() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost')
        ? false
        : { rejectUnauthorized: true },
      max: 3,
    })
  }
  return pool
}

export interface Abonnement {
  plan: Plan
  expireLe: string | null
  /** Plan réellement applicable : `plan` si l'abonnement court, sinon Éleveur. */
  effectif: Plan
}

const GRATUIT: Abonnement = { plan: 'eleveur', expireLe: null, effectif: 'eleveur' }

/** Le compte de démonstration montre le produit complet : il est toujours en plan Troupeau. */
const EMAIL_DEMO = 'demo@livestockos.app'

export async function abonnementDe(userId: string, email?: string): Promise<Abonnement> {
  if (email === EMAIL_DEMO) {
    return { plan: 'troupeau', expireLe: null, effectif: 'troupeau' }
  }

  try {
    const { rows } = await db().query<{ plan: string; expire_le: Date | null }>(
      `SELECT plan, expire_le FROM abonnement WHERE user_id = $1`,
      [userId]
    )
    const r = rows[0]
    if (!r || !estPlan(r.plan)) return GRATUIT
    const expireLe = r.expire_le?.toISOString() ?? null
    return { plan: r.plan, expireLe, effectif: planEffectif(r.plan, expireLe) }
  } catch {
    // Table absente (migration pas encore passée) ou base injoignable :
    // on ne bloque jamais l'éleveur, on le traite en plan gratuit.
    return GRATUIT
  }
}

export async function activerPlan(
  userId: string,
  plan: Plan,
  mois: number,
  reference: string | null
) {
  const { rows } = await db().query<{ expire_le: Date | null }>(
    `INSERT INTO abonnement (user_id, plan, expire_le, reference)
     VALUES ($1, $2, CASE WHEN $3::int > 0 THEN now() + ($3::int || ' months')::interval END, $4)
     ON CONFLICT (user_id) DO UPDATE
       SET plan = EXCLUDED.plan,
           expire_le = EXCLUDED.expire_le,
           reference = EXCLUDED.reference,
           active_le = now()
     RETURNING expire_le`,
    [userId, plan, mois, reference]
  )
  return rows[0]?.expire_le?.toISOString() ?? null
}
