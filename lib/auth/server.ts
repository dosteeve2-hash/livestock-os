import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'

/**
 * Authentification — Neon Postgres + Better Auth.
 *
 * Better Auth est utilisé en direct plutôt que via le SDK managé de Neon :
 * ce dernier est encore en bêta, et l'authentification d'un produit vendu à
 * des éleveurs n'est pas l'endroit où prendre ce risque.
 *
 * Le Pool se construit sans se connecter : une URL absente échoue à la
 * première requête, pas au chargement du module — le build reste possible
 * sans base configurée.
 */
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon impose TLS.
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: true },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  session: {
    // 30 jours : un éleveur en brousse ne se reconnecte pas chaque matin.
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  // `nextCookies` doit rester le dernier plugin : c'est lui qui autorise les
  // Server Actions à poser le cookie de session.
  plugins: [nextCookies()],
})
