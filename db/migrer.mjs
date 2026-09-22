/**
 * Applique `db/schema.sql` à la base pointée par DATABASE_URL.
 *
 *   node --env-file=.env.local db/migrer.mjs
 *   npm run db:migrer
 *
 * Le schéma n'est fait que de `create ... if not exists` : relancer ce script
 * sur une base déjà peuplée ne détruit rien et ne perd aucune ligne. C'est
 * voulu — un script de migration qu'on hésite à lancer ne sert à rien.
 *
 * `--verifier` n'applique rien : il compare les tables attendues à celles qui
 * existent et sort en erreur s'il en manque. À utiliser en CI, ou après un
 * incident, pour savoir où on en est sans rien toucher.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const ICI = dirname(fileURLToPath(import.meta.url))
const VERIFIER = process.argv.includes('--verifier')

const ATTENDUES = ['user', 'account', 'session', 'verification', 'passeport_snapshot', 'abonnement']

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL est absent.')
  process.exit(1)
}

/**
 * TLS pour tout ce qui n'est pas la machine locale.
 *
 * Le reste du dépôt teste `url.includes('localhost')`, ce qui rate
 * `127.0.0.1` et `::1` : un Postgres local atteint par son adresse IP échoue
 * alors sur « self-signed certificate ». On compare donc l'hôte, pas la chaîne.
 */
const LOCALES = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])
const hote = new URL(process.env.DATABASE_URL).hostname
const ssl = LOCALES.has(hote) ? false : { rejectUnauthorized: true }

const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl })

try {
  await client.connect()

  if (!VERIFIER) {
    await client.query(readFileSync(join(ICI, 'schema.sql'), 'utf8'))
    console.log('Schéma appliqué.')
  }

  const { rows } = await client.query(
    `select table_name from information_schema.tables where table_schema = 'public'`,
  )
  const presentes = new Set(rows.map((r) => r.table_name))
  const manquantes = ATTENDUES.filter((t) => !presentes.has(t))

  for (const t of ATTENDUES) console.log(`  ${presentes.has(t) ? '✓' : '✗'} ${t}`)

  if (manquantes.length > 0) {
    console.error(`\nTables manquantes : ${manquantes.join(', ')}`)
    process.exitCode = 1
  }
} catch (e) {
  console.error('Échec :', e.message)
  process.exitCode = 1
} finally {
  await client.end().catch(() => {})
}
