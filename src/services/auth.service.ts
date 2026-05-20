import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth'
import type { User } from '@/types'

export const authService = {
  /**
   * Tüm sistem kullanıcılarını getirir (Sadece Admin yetkisine sahip olanlar çağırabilir)
   */
  async listUsers(): Promise<User[]> {
    await requireAuth(['Admin'])

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) throw new Error(`Kullanıcılar getirilirken hata: ${error.message}`)
    return data as User[]
  },

  /**
   * Sistemdeki doktorları getirir (Randevu/Tedavi seçimleri için, herkes görebilir)
   */
  async listDoctors(): Promise<User[]> {
    await requireAuth() // Giriş yapmış herkes görebilir

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'Doktor')
      .order('full_name', { ascending: true })

    if (error) throw new Error(`Doktorlar getirilirken hata: ${error.message}`)
    return data as User[]
  }
}
