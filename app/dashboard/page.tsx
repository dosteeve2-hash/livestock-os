import { headers } from 'next/headers'
import { auth } from '@/lib/auth/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user
  const prenom = user?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Éleveur'

  // Les chiffres se calculent côté client : le cheptel vit dans le stockage
  // local de l'appareil, pas dans la base.
  return <DashboardClient prenom={prenom} />
}
