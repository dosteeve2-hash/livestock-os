import { Pool } from 'pg'
import type { Plan } from '@/lib/plans/plans'
import type { Periode } from './reference'

/**
 * Déclarations de paiement manuel. Schéma : scripts/migrations/002_demande_paiement.sql
 * Rien ici n'active un plan : l'activation reste `npm run plan:activer`.
 */

let pool: Pool | null = null

function db() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: true },
      max: 3,
    })
  }
  return pool
}

export interface Declaration {
  userId: string
  email: string
  plan: Exclude<Plan, 'eleveur'>
  periode: Periode
  montant: number
  referenceAbonne: string
  referenceTransfert: string
  telephone: string
}

export type ResultatDeclaration = 'enregistree' | 'deja_declaree' | 'trop_de_demandes'

/** Au-delà, l'éleveur nous écrit : évite qu'un compte remplisse la file. */
const MAX_EN_ATTENTE = 3

export async function declarerPaiement(d: Declaration): Promise<ResultatDeclaration> {
  const { rows } = await db().query<{ n: string }>(
    `SELECT count(*) AS n FROM demande_paiement WHERE user_id = $1 AND statut = 'en_attente'`,
    [d.userId]
  )
  if (Number(rows[0]?.n ?? 0) >= MAX_EN_ATTENTE) return 'trop_de_demandes'

  const r = await db().query(
    `INSERT INTO demande_paiement
       (user_id, email, plan, periode, montant, reference_abonne, reference_transfert, telephone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (reference_transfert) DO NOTHING`,
    [d.userId, d.email, d.plan, d.periode, d.montant, d.referenceAbonne, d.referenceTransfert, d.telephone]
  )
  return r.rowCount === 1 ? 'enregistree' : 'deja_declaree'
}

export interface DemandeEnAttente {
  plan: string
  periode: string
  montant: number
  referenceTransfert: string
  creeLe: string
}

export async function demandesEnAttente(userId: string): Promise<DemandeEnAttente[]> {
  try {
    const { rows } = await db().query<{
      plan: string; periode: string; montant: number; reference_transfert: string; cree_le: Date
    }>(
      `SELECT plan, periode, montant, reference_transfert, cree_le FROM demande_paiement
       WHERE user_id = $1 AND statut = 'en_attente' ORDER BY cree_le DESC LIMIT 5`,
      [userId]
    )
    return rows.map((r) => ({
      plan: r.plan,
      periode: r.periode,
      montant: r.montant,
      referenceTransfert: r.reference_transfert,
      creeLe: r.cree_le.toISOString(),
    }))
  } catch {
    // Migration 002 pas encore passée : la page reste utilisable.
    return []
  }
}
