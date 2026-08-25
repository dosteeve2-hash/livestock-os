'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-white/50 hover:text-red-400 transition-colors px-2 py-1 rounded"
    >
      Déconnexion
    </button>
  )
}
