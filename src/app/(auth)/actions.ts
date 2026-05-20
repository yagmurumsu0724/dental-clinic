'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { redirect } from 'next/navigation'

export async function login(data: LoginFormValues) {
  // Validate input
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Geçersiz giriş bilgileri.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: 'E-posta veya şifre hatalı.' }
  }

  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
