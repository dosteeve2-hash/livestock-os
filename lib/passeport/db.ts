import { randomBytes } from 'node:crypto'
import { Pool } from 'pg'

import { sslPourPostgres } from '@/lib/db/ssl'

/**
 * Publication et vérification des passeports.
 *
 * Le principe de confiance tient en une ligne : `publie_le` est un défaut
 * serveur (`now()`), jamais fourni par le client. On ne peut donc pas
 * antidater une publication. Le contenu reste déclaratif — c'est l'historique
 * des publications qui devient, lui, incontestable.
 */

let pool: Pool | null = null

function db() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: sslPourPostgres(process.env.DATABASE_URL),
      max: 3,
    })
  }
  return pool
}

/** Alphabet sans caractères confondables : un code se dicte au téléphone. */
const ALPHABET = 'ACDEFGHJKLMNPQRSTUVWXYZ23456789'

function genererCode() {
  const octets = randomBytes(10)
  let brut = ''
  for (const o of octets) brut += ALPHABET[o % ALPHABET.length]
  return `${brut.slice(0, 4)}-${brut.slice(4, 7)}-${brut.slice(7, 10)}`
}

export interface Payload {
  eleveur: string
  parEspece: Record<string, number>
  investiSante: number
  moisActifs: number
  inventaire: { id: string; espece: string; race: string; age: string; valeur: number }[]
  ventes: { date: string; acheteur: string; prix: number }[]
}

export interface Snapshot {
  code: string
  publieLe: string
  nbTetes: number
  valeurTotale: number
  couvertureVaccinale: number
  revenus12m: number
  nbVentes12m: number
  payload: Payload
}

export interface Historique {
  total: number
  premierePublication: string | null
}

/** Un éleveur ne publie pas vingt fois par jour : au-delà, c'est un abus. */
const MAX_PAR_JOUR = 5

export async function compterPublicationsDuJour(userId: string) {
  const { rows } = await db().query<{ n: string }>(
    `SELECT count(*) AS n FROM passeport_snapshot
     WHERE user_id = $1 AND publie_le > now() - interval '24 hours'`,
    [userId]
  )
  return Number(rows[0]?.n ?? 0)
}

export async function publier(
  userId: string,
  bilan: Omit<Snapshot, 'code' | 'publieLe'>
): Promise<{ code: string; publieLe: string } | { erreur: 'trop_de_publications' }> {
  if ((await compterPublicationsDuJour(userId)) >= MAX_PAR_JOUR) {
    return { erreur: 'trop_de_publications' }
  }

  const code = genererCode()
  const { rows } = await db().query<{ code: string; publie_le: Date }>(
    `INSERT INTO passeport_snapshot
       (code, user_id, nb_tetes, valeur_totale, couverture_vaccinale, revenus_12m, nb_ventes_12m, payload)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING code, publie_le`,
    [
      code,
      userId,
      bilan.nbTetes,
      bilan.valeurTotale,
      bilan.couvertureVaccinale,
      bilan.revenus12m,
      bilan.nbVentes12m,
      JSON.stringify(bilan.payload),
    ]
  )

  return { code: rows[0].code, publieLe: rows[0].publie_le.toISOString() }
}

export async function parCode(code: string): Promise<Snapshot | null> {
  const { rows } = await db().query(
    `SELECT code, publie_le, nb_tetes, valeur_totale, couverture_vaccinale,
            revenus_12m, nb_ventes_12m, payload, user_id
     FROM passeport_snapshot WHERE code = $1`,
    [code]
  )
  if (rows.length === 0) return null

  const r = rows[0]
  return {
    code: r.code,
    publieLe: r.publie_le.toISOString(),
    nbTetes: r.nb_tetes,
    valeurTotale: Number(r.valeur_totale),
    couvertureVaccinale: r.couverture_vaccinale,
    revenus12m: Number(r.revenus_12m),
    nbVentes12m: r.nb_ventes_12m,
    payload: r.payload as Payload,
  }
}

/**
 * Antériorité du suivi. C'est ce chiffre qui vaut preuve : un relevé isolé
 * publié aujourd'hui ne dit rien, huit relevés étalés sur huit mois disent tout.
 */
export async function historiqueDuCode(code: string): Promise<Historique> {
  const { rows } = await db().query<{ total: string; premiere: Date | null }>(
    `SELECT count(*) AS total, min(publie_le) AS premiere
     FROM passeport_snapshot
     WHERE user_id = (SELECT user_id FROM passeport_snapshot WHERE code = $1)`,
    [code]
  )
  return {
    total: Number(rows[0]?.total ?? 0),
    premierePublication: rows[0]?.premiere?.toISOString() ?? null,
  }
}

export async function mesPublications(userId: string) {
  const { rows } = await db().query<{ code: string; publie_le: Date; nb_tetes: number }>(
    `SELECT code, publie_le, nb_tetes FROM passeport_snapshot
     WHERE user_id = $1 ORDER BY publie_le DESC LIMIT 10`,
    [userId]
  )
  return rows.map((r) => ({
    code: r.code,
    publieLe: r.publie_le.toISOString(),
    nbTetes: r.nb_tetes,
  }))
}
