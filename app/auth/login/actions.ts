'use server'

import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get('email')?.toString().trim() ?? ''
  const password = formData.get('password')?.toString() ?? ''

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' }
  }

  try {
    // Le plugin nextCookies pose le cookie de session depuis cette Server Action.
    await auth.api.signInEmail({ body: { email, password } })
  } catch (error) {
    if (error instanceof APIError) {
      // Message volontairement identique quel que soit le motif : ne pas
      // révéler si l'adresse existe.
      return { error: 'Email ou mot de passe incorrect' }
    }
    return { error: 'Connexion impossible. Vérifiez votre réseau et réessayez.' }
  }

  redirect('/dashboard')
}
