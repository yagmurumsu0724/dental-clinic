import { createClient } from '@/lib/supabase/client'
import { treatmentSchema, type TreatmentFormValues } from '@/lib/validations'
import type { Treatment } from '@/types'

export const treatmentsApi = {
  async list(patientId?: string): Promise<Treatment[]> {
    const supabase = createClient()
    let query = supabase
      .from('treatments')
      .select('*, patient:patients(id, full_name), doctor:users(id, full_name)')
      .order('treatment_date', { ascending: false })

    if (patientId) query = query.eq('patient_id', patientId)

    const { data, error } = await query
    if (error) throw new Error(`Tedaviler getirilirken hata: ${error.message}`)
    return data as Treatment[]
  },

  async create(data: TreatmentFormValues): Promise<Treatment> {
    const parsed = treatmentSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Geçersiz tedavi bilgileri')
    }

    const supabase = createClient()
    const { data: newTreatment, error } = await supabase
      .from('treatments')
      .insert(parsed.data)
      .select('*, patient:patients(id, full_name), doctor:users(id, full_name)')
      .single()

    if (error) throw new Error(`Tedavi oluşturulamadı: ${error.message}`)
    return newTreatment as Treatment
  },

  async update(id: string, data: Partial<TreatmentFormValues>): Promise<Treatment> {
    const supabase = createClient()
    const { data: updatedTreatment, error } = await supabase
      .from('treatments')
      .update(data)
      .eq('id', id)
      .select('*, patient:patients(id, full_name), doctor:users(id, full_name)')
      .single()

    if (error) throw new Error(`Tedavi güncellenemedi: ${error.message}`)
    return updatedTreatment as Treatment
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('treatments').delete().eq('id', id)
    if (error) throw new Error(`Tedavi silinemedi: ${error.message}`)
  }
}
