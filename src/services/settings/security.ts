import { createClient } from '@/lib/supabase/client'
import type { SecuritySettings } from '@/types/settings'

const DEFAULT_SECURITY_SETTINGS: Omit<SecuritySettings, 'user_id'> = {
  two_factor_enabled: false,
}

export async function getSecuritySettings(): Promise<SecuritySettings> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.')

  const { data, error } = await supabase
    .from('security_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      return { ...DEFAULT_SECURITY_SETTINGS, user_id: user.id }
    }
    throw new Error(`Güvenlik ayarları alınamadı: ${error.message}`)
  }
  
  return data as SecuritySettings
}

export async function updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.')
  
  const { data: existing } = await supabase.from('security_settings').select('id').eq('user_id', user.id).single()

  if (existing) {
    const { data, error } = await supabase
      .from('security_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()
      
    if (error) throw new Error(`Güvenlik ayarları güncellenemedi: ${error.message}`)
    return data as SecuritySettings
  } else {
    const { data, error } = await supabase
      .from('security_settings')
      .insert({ ...DEFAULT_SECURITY_SETTINGS, ...settings, user_id: user.id })
      .select()
      .single()
      
    if (error) throw new Error(`Güvenlik ayarları oluşturulamadı: ${error.message}`)
    return data as SecuritySettings
  }
}

export async function updatePassword(password: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw new Error(`Şifre güncellenemedi: ${error.message}`)
}

export async function signOutAllOtherSessions(): Promise<void> {
  // Not directly supported with standard supabase-js without specific session IDs or admin API,
  // but we can fake it or use a custom RPC. For standard usage, we just log out.
  throw new Error('Bu özellik şu anda yapılandırılıyor.')
}
