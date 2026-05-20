import { createClient } from '@/lib/supabase/client'
import type { ClinicSettings } from '@/types/settings'

const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
  clinic_name: 'DentFlow Klinik',
  clinic_phone: '',
  clinic_email: '',
  clinic_address: '',
  working_days: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  working_hours_start: '09:00',
  working_hours_end: '18:00',
  appointment_duration: 30,
  currency: 'TRY',
  timezone: 'Europe/Istanbul',
  date_format: 'dd.MM.yyyy',
}

export async function getClinicSettings(): Promise<ClinicSettings> {
  const supabase = createClient()
  const { data, error } = await supabase.from('clinic_settings').select('*').limit(1).single()
  
  if (error) {
    // If table doesn't exist or no rows, return defaults
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      return DEFAULT_CLINIC_SETTINGS
    }
    throw new Error(`Klinik ayarları alınamadı: ${error.message}`)
  }
  
  return data as ClinicSettings
}

export async function updateClinicSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings> {
  const supabase = createClient()
  
  // Try to get existing to decide whether to insert or update
  const { data: existing } = await supabase.from('clinic_settings').select('id').limit(1).single()

  if (existing) {
    const { data, error } = await supabase
      .from('clinic_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()
      
    if (error) throw new Error(`Ayarlar güncellenemedi: ${error.message}`)
    return data as ClinicSettings
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('clinic_settings')
      .insert({ ...DEFAULT_CLINIC_SETTINGS, ...settings })
      .select()
      .single()
      
    if (error) throw new Error(`Ayarlar oluşturulamadı: ${error.message}`)
    return data as ClinicSettings
  }
}
