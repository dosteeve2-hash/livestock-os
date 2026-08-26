import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'
import PasseportClient from './PasseportClient'

export default async function PasseportPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/login')

  return (
    <PasseportClient
      nom={session.user.name || session.user.email.split('@')[0]}
      email={session.user.email}
      membreDepuis={new Date(session.user.createdAt).toISOString().slice(0, 10)}
    />
  )
}
