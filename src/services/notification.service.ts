import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types'

export const notificationsApi = {
  async list(): Promise<Notification[]> {
    const supabase = createClient()
    // Ideally we should filter by the current logged-in user, but for demo we can get all or a specific role.
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    if (error) throw new Error(`Bildirimler alınamadı: ${error.message}`)
    return data as Notification[]
  },

  async getUnreadCount(): Promise<number> {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw new Error(error.message)
    return count || 0
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw new Error(`Bildirim okundu işaretlenemedi: ${error.message}`)
  },

  async markAllAsRead(): Promise<void> {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw new Error(`Tüm bildirimler okundu işaretlenemedi: ${error.message}`)
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('notifications').delete().eq('id', id)
    if (error) throw new Error(`Bildirim silinemedi: ${error.message}`)
  }
}
