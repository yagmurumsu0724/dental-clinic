import { createClient } from '@/lib/supabase/client'
import { patientSchema, type PatientFormValues } from '@/lib/validations'
import type { Patient } from '@/types'

export const patientService = {
  async list(): Promise<Patient[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Hastalar getirilirken hata: ${error.message}`)
    return data as Patient[]
  },

  async getById(id: string): Promise<Patient> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('patients')
      .select('*, appointments(*), treatments(*), payments(*), uploaded_files(*)')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Hasta detayı bulunamadı: ${error.message}`)
    return data as Patient
  },

  async create(data: PatientFormValues): Promise<Patient> {
    const parsed = patientSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Geçersiz veri formatı')
    }

    const supabase = createClient()
    
    // TC Benzersizlik kontrolü
    if (parsed.data.tc_no) {
      const { data: existing } = await supabase.from('patients').select('id').eq('tc_no', parsed.data.tc_no).single()
      if (existing) throw new Error('Bu TC Kimlik numarasıyla kayıtlı bir hasta zaten var.')
    }

    const { data: newPatient, error } = await supabase
      .from('patients')
      .insert(parsed.data)
      .select()
      .single()

    if (error) throw new Error(`Hasta oluşturulamadı: ${error.message}`)
    return newPatient as Patient
  },

  async update(id: string, data: Partial<PatientFormValues>): Promise<Patient> {
    const supabase = createClient()
    const { data: updatedPatient, error } = await supabase
      .from('patients')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Hasta güncellenemedi: ${error.message}`)
    return updatedPatient as Patient
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Hasta silinemedi: ${error.message}`)
  }
}
