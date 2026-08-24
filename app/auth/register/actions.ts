'use server'

import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'

export async function registerAction(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const email = formData.get('email')?.toString().trim() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const nom = formData.get('nom')?.toString().trim() ?? ''

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' }
  }

  if (password.length < 8) {
    return { error: 'Le mot de passe doit contenir au moins 8 caractères' }
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name: nom || email.split('@')[0] },
    })
  } catch (error) {
    if (error instanceof APIError) {
      const dejaPris = error.body?.code === 'USER_ALREADY_EXISTS'
      return {
        error: dejaPris
          ? 'Un compte existe déjà avec cet email'
          : 'Inscription impossible. Vérifiez vos informations et réessayez.',
      }
    }
    return { error: 'Inscription impossible. Vérifiez votre réseau et réessayez.' }
  }

  redirect('/dashboard/onboarding')
}
