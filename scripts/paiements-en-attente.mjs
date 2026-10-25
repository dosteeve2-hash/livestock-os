// Liste les déclarations « j'ai payé » à vérifier. Usage : npm run paiement:liste
// Puis, transfert vu dans l'historique Orange Money :
//   npm run plan:activer -- <email> <plan> <mois> "<ID transaction>"
// (l'activation marque la déclaration correspondante comme validée)
import { readFileSync } from 'node:fs'
import pg from 'pg'

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
  const { rows } = await pool.query(
    `SELECT cree_le, email, plan, periode, montant, reference_abonne, reference_transfert, telephone
     FROM demande_paiement WHERE statut = 'en_attente' ORDER BY cree_le`
  )
  if (rows.length === 0) console.log('Aucune déclaration en attente.')
  for (const r of rows) {
    const mois = r.periode === 'an' ? 12 : 1
    console.log(
      `${new Date(r.cree_le).toLocaleString('fr-FR')}  ${r.email}  ${r.plan}/${r.periode}  ${r.montant} F  ` +
        `motif ${r.reference_abonne}  ID ${r.reference_transfert}  tél ${r.telephone}\n` +
        `   → npm run plan:activer -- ${r.email} ${r.plan} ${mois} "${r.reference_transfert}"`
    )
  }
} finally {
  await pool.end()
}
