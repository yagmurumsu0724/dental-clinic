import { createClient } from '@/lib/supabase/client'
import { paymentSchema, type PaymentFormValues } from '@/lib/validations'
import type { Payment } from '@/types'

export const paymentsApi = {
  async list(patientId?: string): Promise<Payment[]> {
    const supabase = createClient()
    let query = supabase
      .from('payments')
      .select('*, patient:patients(id, full_name)')
      .order('payment_date', { ascending: false })

    if (patientId) query = query.eq('patient_id', patientId)

    const { data, error } = await query
    if (error) throw new Error(`Ödemeler getirilirken hata: ${error.message}`)
    return data as Payment[]
  },

  async create(data: PaymentFormValues): Promise<Payment> {
    const parsed = paymentSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Geçersiz ödeme bilgileri')
    }

    const supabase = createClient()
    const { data: newPayment, error } = await supabase
      .from('payments')
      .insert(parsed.data)
      .select('*, patient:patients(id, full_name)')
      .single()

    if (error) throw new Error(`Ödeme oluşturulamadı: ${error.message}`)
    return newPayment as Payment
  },

  async update(id: string, data: Partial<PaymentFormValues>): Promise<Payment> {
    const supabase = createClient()
    const { data: updatedPayment, error } = await supabase
      .from('payments')
      .update(data)
      .eq('id', id)
      .select('*, patient:patients(id, full_name)')
      .single()

    if (error) throw new Error(`Ödeme güncellenemedi: ${error.message}`)
    return updatedPayment as Payment
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('payments').delete().eq('id', id)
    if (error) throw new Error(`Ödeme silinemedi: ${error.message}`)
  }
}
