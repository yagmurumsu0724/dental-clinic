import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth'
import type { AuditLog } from '@/types'
import { AppError } from '@/lib/errors'

export const auditService = {
  async list(limit = 100): Promise<AuditLog[]> {
    await requireAuth(['Admin']) // Sadece Adminler logları görebilir

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, user:users(id, full_name, role)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new AppError(`Loglar getirilirken hata: ${error.message}`, undefined, 500)
    return data as AuditLog[]
  }
}
