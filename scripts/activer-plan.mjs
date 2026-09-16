// Activation manuelle d'un plan — les dix premiers clients paient par Orange Money,
// on active à la main. Usage :
//   npm run plan:activer -- eleveur@mail.com troupeau 12 "OM 4521-7788"
//   npm run plan:activer -- eleveur@mail.com eleveur            (retour au gratuit)
import { readFileSync } from 'node:fs'
import pg from 'pg'

const [email, plan = 'troupeau', moisArg = '12', reference = null] = process.argv.slice(2)
const PLANS = ['eleveur', 'troupeau', 'cooperative']

if (!email || !PLANS.includes(plan)) {
  console.error('Usage : npm run plan:activer -- <email> <eleveur|troupeau|cooperative> [mois=12] [reference]')
  process.exit(1)
}
const mois = Number(moisArg)
if (!Number.isInteger(mois) || mois < 0 || mois > 120) {
  console.error('mois doit être un entier entre 0 (sans échéance) et 120')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  try {
    for (const ligne of readFileSync('.env.local', 'utf8').split('\n')) {
      const m = ligne.match(/^DATABASE_URL=(.+)$/)
      if (m) process.env.DATABASE_URL = m[1].trim().replace(/^["']|["']$/g, '')
    }
  } catch {}
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL absente (ni env, ni .env.local)')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: true },
})

try {
  const u = await pool.query('SELECT id, name FROM "user" WHERE lower(email) = lower($1)', [email])
  if (u.rows.length === 0) {
    console.error(`Aucun compte pour ${email} — l'éleveur doit d'abord s'inscrire.`)
    process.exit(2)
  }
  const { id, name } = u.rows[0]
  const r = await pool.query(
    `INSERT INTO abonnement (user_id, plan, expire_le, reference)
     VALUES ($1, $2, CASE WHEN $3::int > 0 THEN now() + ($3::int || ' months')::interval END, $4)
     ON CONFLICT (user_id) DO UPDATE
       SET plan = EXCLUDED.plan, expire_le = EXCLUDED.expire_le, reference = EXCLUDED.reference, active_le = now()
     RETURNING plan, expire_le`,
    [id, plan, mois, reference]
  )
  const { expire_le } = r.rows[0]
  console.log(
    `✔ ${name || email} → plan ${plan}` +
      (expire_le ? `, jusqu'au ${new Date(expire_le).toLocaleDateString('fr-FR')}` : ', sans échéance') +
      (reference ? ` (réf. ${reference})` : '')
  )
} finally {
  await pool.end()
}
