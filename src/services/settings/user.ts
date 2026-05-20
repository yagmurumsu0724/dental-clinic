import { createClient } from '@/lib/supabase/client'
import type { UserSettings } from '@/types/settings'

const DEFAULT_USER_SETTINGS: Omit<UserSettings, 'user_id'> = {
  theme_preference: 'system',
  language: 'tr-TR',
  timezone: 'Europe/Istanbul',
}

export async function getUserSettings(): Promise<UserSettings> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.')

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      return { ...DEFAULT_USER_SETTINGS, user_id: user.id }
    }
    throw new Error(`Kullanıcı ayarları alınamadı: ${error.message}`)
  }
  
  return data as UserSettings
}

export async function updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.')
  
  const { data: existing } = await supabase.from('user_settings').select('id').eq('user_id', user.id).single()

  if (existing) {
    const { data, error } = await supabase
      .from('user_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()
      
    if (error) throw new Error(`Ayarlar güncellenemedi: ${error.message}`)
    return data as UserSettings
  } else {
    const { data, error } = await supabase
      .from('user_settings')
      .insert({ ...DEFAULT_USER_SETTINGS, ...settings, user_id: user.id })
      .select()
      .single()
      
    if (error) throw new Error(`Ayarlar oluşturulamadı: ${error.message}`)
    return data as UserSettings
  }
}
