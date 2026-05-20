import { createClient } from '@/lib/supabase/client'
import type { NotificationSettings } from '@/types/settings'

const DEFAULT_NOTIFICATION_SETTINGS: Omit<NotificationSettings, 'user_id'> = {
  email_notifications: true,
  browser_notifications: true,
  appointment_reminders: true,
  payment_reminders: true,
  treatment_alerts: false,
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.')

  const { data, error } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, user_id: user.id }
    }
    throw new Error(`Bildirim ayarları alınamadı: ${error.message}`)
  }
  
  return data as NotificationSettings
}

export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.')
  
  const { data: existing } = await supabase.from('notification_settings').select('id').eq('user_id', user.id).single()

  if (existing) {
    const { data, error } = await supabase
      .from('notification_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()
      
    if (error) throw new Error(`Bildirim ayarları güncellenemedi: ${error.message}`)
    return data as NotificationSettings
  } else {
    const { data, error } = await supabase
      .from('notification_settings')
      .insert({ ...DEFAULT_NOTIFICATION_SETTINGS, ...settings, user_id: user.id })
      .select()
      .single()
      
    if (error) throw new Error(`Bildirim ayarları oluşturulamadı: ${error.message}`)
    return data as NotificationSettings
  }
}
