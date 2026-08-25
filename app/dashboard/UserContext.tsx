'use client'

import { createContext, useContext, type ReactNode } from 'react'

const UserIdContext = createContext<string | null>(null)

export function UserIdProvider({
  userId,
  children,
}: {
  userId: string
  children: ReactNode
}) {
  return <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
}

/** Cloisonne les données par compte : le cheptel de démo ne pollue pas celui d'un vrai éleveur. */
export function useUserId() {
  const userId = useContext(UserIdContext)
  if (!userId) {
    throw new Error('useUserId doit être utilisé dans le layout /dashboard')
  }
  return userId
}
