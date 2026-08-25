'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { read, subscribe, write } from './store'

interface Row {
  id: string
}

export interface CollectionApi<T extends Row> {
  add: (row: T) => void
  update: (id: string, patch: Partial<T>) => void
  remove: (id: string) => void
}

/**
 * Collection réactive persistée en local.
 * Rend le tableau courant et les opérations d'écriture ; tout composant
 * abonné à la même collection se met à jour, y compris dans un autre onglet.
 */
export function useCollection<T extends Row>(
  userId: string,
  collection: string,
  seed: T[]
): [T[], CollectionApi<T>] {
  const getSnapshot = useCallback(
    () => read<T>(userId, collection, seed),
    [userId, collection, seed]
  )

  // Le serveur ne connaît pas localStorage : il rend la graine, l'hydratation corrige.
  const getServerSnapshot = useCallback(() => seed, [seed])

  const rows = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const api = useMemo<CollectionApi<T>>(
    () => ({
      add(row) {
        write<T>(userId, collection, [row, ...read<T>(userId, collection, seed)])
      },
      update(id, patch) {
        write<T>(
          userId,
          collection,
          read<T>(userId, collection, seed).map((row) =>
            row.id === id ? { ...row, ...patch } : row
          )
        )
      },
      remove(id) {
        write<T>(
          userId,
          collection,
          read<T>(userId, collection, seed).filter((row) => row.id !== id)
        )
      },
    }),
    [userId, collection, seed]
  )

  return [rows, api]
}
