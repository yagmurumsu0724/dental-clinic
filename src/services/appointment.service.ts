import { createClient } from '@/lib/supabase/client'
import { appointmentSchema, type AppointmentFormValues } from '@/lib/validations'
import type { Appointment } from '@/types'

export const appointmentsApi = {
  async list(filters?: { doctorId?: string; date?: string; patientId?: string }): Promise<Appointment[]> {
    const supabase = createClient()
    let query = supabase
      .from('appointments')
      .select('*, patient:patients(id, full_name, phone), doctor:users(id, full_name)')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (filters?.doctorId && filters.doctorId !== 'all') query = query.eq('doctor_id', filters.doctorId)
    if (filters?.date) query = query.eq('appointment_date', filters.date)
    if (filters?.patientId) query = query.eq('patient_id', filters.patientId)

    const { data, error } = await query
    if (error) throw new Error(`Randevular getirilirken hata: ${error.message}`)
    return data as Appointment[]
  },

  async create(data: AppointmentFormValues): Promise<Appointment> {
    const parsed = appointmentSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error('Geçersiz randevu bilgileri')
    }

    const supabase = createClient()

    // Çakışma Kontrolü
    const { data: conflict } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', parsed.data.doctor_id)
      .eq('appointment_date', parsed.data.appointment_date)
      .eq('appointment_time', parsed.data.appointment_time)
      .neq('status', 'İptal Edildi')
      .single()

    if (conflict) {
      throw new Error('Bu saatte doktorun başka bir randevusu bulunmaktadır.')
    }

    const { data: newAppt, error } = await supabase
      .from('appointments')
      .insert(parsed.data)
      .select('*, patient:patients(id, full_name, phone), doctor:users(id, full_name)')
      .single()

    if (error) throw new Error(`Randevu oluşturulamadı: ${error.message}`)
    return newAppt as Appointment
  },

  async update(id: string, data: Partial<AppointmentFormValues>): Promise<Appointment> {
    const supabase = createClient()
    const { data: updatedAppt, error } = await supabase
      .from('appointments')
      .update(data)
      .eq('id', id)
      .select('*, patient:patients(id, full_name, phone), doctor:users(id, full_name)')
      .single()

    if (error) throw new Error(`Randevu güncellenemedi: ${error.message}`)
    return updatedAppt as Appointment
  },
  
  async updateStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    return this.update(id, { status } as any);
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) throw new Error(`Randevu silinemedi: ${error.message}`)
  }
}
