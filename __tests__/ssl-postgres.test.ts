import { describe, it, expect } from 'vitest'

import { estBoucleLocale, sslPourPostgres } from '@/lib/db/ssl'

/**
 * Le défaut que ces tests verrouillent : le TLS de la base se décidait par
 * `process.env.DATABASE_URL?.includes('localhost')`. Une sous-chaîne cherchée
 * dans l'URL entière, alors que l'URL entière contient le mot de passe, le nom
 * de la base et les paramètres — autant de parties où « localhost » peut
 * apparaître sans que l'hôte soit local.
 *
 * Les trois premiers cas ci-dessous sont des chaînes Neon de PRODUCTION que
 * l'ancien test faisait passer en clair sur le réseau. Ils échouent avec
 * l'ancien code et passent avec le nouveau.
 */
const EXIGE_TLS = { rejectUnauthorized: true }

describe('TLS de Postgres — les cas où l’ancien test mettait la production en clair', () => {
  it('un mot de passe contenant « localhost » ne désactive pas le TLS', () => {
    const url = 'postgresql://eleveur:localhost123@ep-x.eu-central-1.aws.neon.tech/livestock'
    expect(url.includes('localhost')).toBe(true) // l'ancien test disait « local »
    expect(sslPourPostgres(url)).toEqual(EXIGE_TLS)
  })

  it('une base nommée « localhost » ne désactive pas le TLS', () => {
    expect(sslPourPostgres('postgresql://u:p@ep-x.neon.tech/localhost')).toEqual(EXIGE_TLS)
  })

  it('un paramètre contenant « localhost » ne désactive pas le TLS', () => {
    const url = 'postgresql://u:p@ep-x.neon.tech/db?application_name=localhost-test'
    expect(sslPourPostgres(url)).toEqual(EXIGE_TLS)
  })
})

describe('TLS de Postgres — les bases locales que l’ancien test refusait de reconnaître', () => {
  it.each([
    ['localhost', 'postgresql://u:p@localhost:5432/livestock'],
    ['LOCALHOST en capitales', 'postgresql://u:p@LOCALHOST:5432/livestock'],
    ['127.0.0.1', 'postgresql://u:p@127.0.0.1:5432/livestock'],
    ['127.0.0.2, aussi du bouclage', 'postgresql://u:p@127.0.0.2:5432/livestock'],
    ['::1 entre crochets', 'postgresql://u:p@[::1]:5432/livestock'],
  ])('%s : pas de TLS', (_nom, url) => {
    expect(sslPourPostgres(url)).toBe(false)
  })
})

describe('TLS de Postgres — Neon et tout le reste', () => {
  it.each([
    'postgresql://u:p@ep-cool-name-123456.eu-central-1.aws.neon.tech/livestock?sslmode=require',
    'postgres://u:p@db.interne.example:5432/livestock',
    'postgresql://u:p@db.local:5432/livestock',
  ])('%s : TLS exigé', (url) => {
    expect(sslPourPostgres(url)).toEqual(EXIGE_TLS)
  })

  it('`db.local` n’est pas la boucle locale : c’est du mDNS, donc une autre machine', () => {
    expect(estBoucleLocale('db.local')).toBe(false)
  })
})

describe('TLS de Postgres — ce qu’on n’arrive pas à lire compte comme distant', () => {
  it.each([
    ['variable absente', undefined],
    ['chaîne vide', ''],
    ['chaîne illisible', 'pas-une-url'],
  ])('%s : TLS exigé, jamais l’exemption', (_nom, url) => {
    expect(sslPourPostgres(url as string | undefined)).toEqual(EXIGE_TLS)
  })

  it('une variable absente exigeait déjà le TLS, et continue de l’exiger', () => {
    // Vérifié en rejouant l'ancienne expression, pas supposé :
    // `undefined?.includes(...)` rend `undefined`, qui est faux, donc l'ancien
    // ternaire prenait DÉJÀ la branche sécurisée. C'est le seul des six cas
    // qu'il traitait correctement, et le nouveau code ne le régresse pas.
    expect(sslPourPostgres(undefined)).toEqual(EXIGE_TLS)
  })
})

describe('les adresses qui ressemblent à du bouclage sans en être', () => {
  it.each([
    ['128.0.0.1', false],
    ['127.0.0.999', false],
    ['1127.0.0.1', false],
    ['127.0.0', false],
    ['127.0.0.1', true],
    ['127.255.255.255', true],
  ])('%s -> %s', (hote, attendu) => {
    expect(estBoucleLocale(hote)).toBe(attendu)
  })
})
