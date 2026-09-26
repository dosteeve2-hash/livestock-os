/**
 * Décider du TLS d'une connexion Postgres — d'après l'HÔTE, jamais la chaîne.
 *
 * Le code d'origine écrivait `process.env.DATABASE_URL?.includes('localhost')`.
 * Une sous-chaîne cherchée dans l'URL entière décide donc du chiffrement, et
 * l'URL entière contient des parties qu'on ne contrôle pas : le mot de passe,
 * le nom de la base, les paramètres. Trois chaînes de PRODUCTION vérifiées qui
 * désactivaient le TLS en silence :
 *
 *   postgresql://u:localhost123@ep-x.eu-central-1.aws.neon.tech/db   (mot de passe)
 *   postgresql://u:p@ep-x.neon.tech/localhost                        (nom de la base)
 *   postgresql://u:p@ep-x.neon.tech/db?application_name=localhost-x  (paramètre)
 *
 * Pour un logiciel qui porte l'identité d'éleveurs et les passeports présentés
 * à une microfinance, un mot de passe mal choisi ne doit pas pouvoir mettre
 * toute la base en clair sur le réseau.
 *
 * Et le test ratait l'inverse : `127.0.0.1`, `::1` et `LOCALHOST` en capitales
 * imposaient un TLS qu'un Postgres local n'offre pas — d'où l'échec en
 * *self-signed certificate* en développement.
 *
 * La règle tient en une phrase : **on ne chiffre pas vers la boucle locale, on
 * chiffre partout ailleurs.** Ce qu'on n'arrive pas à lire compte comme
 * « ailleurs » : une URL absente ou illisible reçoit le TLS, pas l'exemption —
 * ce que l'ancien ternaire faisait déjà correctement, et qu'il ne faut pas
 * régresser en croyant bien faire.
 */
export type SslPostgres = false | { rejectUnauthorized: true }

const EXIGER_TLS = { rejectUnauthorized: true } as const

/** Les noms de la boucle locale. `[::1]` est la forme que rend `URL.hostname`. */
const NOMS_LOCAUX = new Set([
  'localhost',
  '::1',
  '[::1]',
  '0:0:0:0:0:0:0:1',
  '[0:0:0:0:0:0:0:1]',
])

/** Vrai pour la boucle locale seule. `.local` n'en fait pas partie : c'est du mDNS,
 *  donc une autre machine du réseau, qu'il faut chiffrer comme n'importe quelle autre. */
export function estBoucleLocale(hote: string): boolean {
  const h = hote.toLowerCase()
  if (NOMS_LOCAUX.has(h)) return true
  // Tout 127.0.0.0/8, pas seulement 127.0.0.1.
  const octets = h.split('.')
  return (
    octets.length === 4 &&
    octets[0] === '127' &&
    octets.every((o) => /^\d{1,3}$/.test(o) && Number(o) <= 255)
  )
}

export function sslPourPostgres(url: string | undefined): SslPostgres {
  if (!url) return EXIGER_TLS
  let hote: string
  try {
    hote = new URL(url).hostname
  } catch {
    return EXIGER_TLS
  }
  return estBoucleLocale(hote) ? false : EXIGER_TLS
}
