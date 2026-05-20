export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: 'Admin' | 'Doktor' | 'Sekreter' | 'Asistan'
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role?: 'Admin' | 'Doktor' | 'Sekreter' | 'Asistan'
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          role?: 'Admin' | 'Doktor' | 'Sekreter' | 'Asistan'
          phone?: string | null
          created_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          tc_no: string | null
          full_name: string
          birth_date: string | null
          gender: string | null
          phone: string | null
          email: string | null
          address: string | null
          allergies: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tc_no?: string | null
          full_name: string
          birth_date?: string | null
          gender?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          allergies?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tc_no?: string | null
          full_name?: string
          birth_date?: string | null
          gender?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          allergies?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          status: 'Bekliyor' | 'Onaylandı' | 'Tamamlandı' | 'İptal Edildi'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          status?: 'Bekliyor' | 'Onaylandı' | 'Tamamlandı' | 'İptal Edildi'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_time?: string
          status?: 'Bekliyor' | 'Onaylandı' | 'Tamamlandı' | 'İptal Edildi'
          notes?: string | null
          created_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          treatment_type: string
          tooth_number: string | null
          description: string | null
          price: number
          treatment_date: string
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          treatment_type: string
          tooth_number?: string | null
          description?: string | null
          price: number
          treatment_date: string
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          treatment_type?: string
          tooth_number?: string | null
          description?: string | null
          price?: number
          treatment_date?: string
          status?: string
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
