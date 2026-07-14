'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function registerAction(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()

  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const nom = formData.get('nom')?.toString() ?? ''

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' }
  }

  if (password.length < 8) {
    return { error: 'Le mot de passe doit contenir au moins 8 caractères' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nom },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard/onboarding')
}
