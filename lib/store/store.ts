/**
 * Stockage local offline-first.
 *
 * localStorage est la source de vérité : l'éleveur saisit sur le terrain, sans réseau.
 * La synchronisation Supabase viendra par-dessus, elle ne remplace pas ce store.
 *
 * Le cache mémoire est indispensable : useSyncExternalStore exige un snapshot
 * référentiellement stable, or JSON.parse produit un nouveau tableau à chaque appel.
 */

const PREFIX = 'livestockos:v1'

type Listener = () => void

const listeners = new Set<Listener>()
const cache = new Map<string, unknown[]>()

function storageKey(userId: string, collection: string) {
  return `${PREFIX}:${userId}:${collection}`
}

function emit() {
  listeners.forEach((listener) => listener())
}

if (typeof window !== 'undefined') {
  // Un autre onglet a écrit : on invalide le cache local et on re-rend.
  window.addEventListener('storage', (event) => {
    if (event.key && event.key.startsWith(PREFIX)) {
      cache.delete(event.key)
      emit()
    }
  })
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Lit une collection. Au premier accès, sème `seed` et le persiste
 * pour que l'app ne démarre jamais sur un écran vide.
 */
export function read<T>(userId: string, collection: string, seed: T[]): T[] {
  const key = storageKey(userId, collection)

  const cached = cache.get(key)
  if (cached) return cached as T[]

  let rows: T[] = seed
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) {
      window.localStorage.setItem(key, JSON.stringify(seed))
    } else {
      rows = JSON.parse(raw) as T[]
    }
  } catch {
    // Mode privé ou quota plein : on reste en mémoire, l'app fonctionne quand même.
  }

  cache.set(key, rows as unknown[])
  return rows
}

export function write<T>(userId: string, collection: string, rows: T[]) {
  const key = storageKey(userId, collection)
  cache.set(key, rows as unknown[])
  try {
    window.localStorage.setItem(key, JSON.stringify(rows))
  } catch {
    // Idem : l'écriture disque peut échouer, l'état mémoire reste correct.
  }
  emit()
}

/** Identifiant court et lisible sur le terrain, ex. BV-4821. */
export function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString().slice(2, 6)}`
}
