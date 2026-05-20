import type { Patient } from './patient'
export * from './patient'

// Reusable UI and Domain primitives for DentFlow AI

export type UserRole = 'Admin' | 'Doktor' | 'Sekreter' | 'Asistan'

export type User = {
  id: string
  full_name: string
  email: string
  phone?: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type AppointmentStatus = 'Bekliyor' | 'Onaylandı' | 'Tamamlandı' | 'İptal Edildi'

export type Appointment = {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  notes?: string | null
  created_at: string
  updated_at: string
  patient?: Partial<Patient>
  doctor?: Partial<User>
}

export type TreatmentType =
  | 'Dolgu'
  | 'Kanal Tedavisi'
  | 'İmplant'
  | 'Diş Çekimi'
  | 'Diş Temizliği'
  | 'Kaplama'
  | 'Ortodonti'
  | 'Diğer'

export type TreatmentStatus = 'Planlandı' | 'Devam Ediyor' | 'Tamamlandı' | 'İptal'

export type Treatment = {
  id: string
  patient_id: string
  doctor_id: string
  treatment_type: TreatmentType
  tooth_number?: string | null
  description?: string | null
  price: number
  treatment_date: string
  status: TreatmentStatus
  notes?: string | null
  created_at: string
  updated_at: string
  patient?: Partial<Patient>
  doctor?: Partial<User>
}

export type PaymentMethod = 'Nakit' | 'Kredi Kartı' | 'Banka Havalesi' | 'Taksit'
export type PaymentStatus = 'Ödendi' | 'Bekliyor' | 'Kısmi Ödendi'

export type Payment = {
  id: string
  patient_id: string
  treatment_id?: string | null
  total_amount: number
  paid_amount: number
  remaining_amount: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  payment_date: string
  notes?: string | null
  created_at: string
  updated_at: string
  patient?: Partial<Patient>
}

export type FileType = 'Röntgen' | 'Klinik Fotoğrafı' | 'PDF' | 'Tedavi Belgesi' | 'Reçete' | 'Diğer'

export type UploadedFile = {
  id: string
  patient_id: string
  file_name: string
  file_url: string
  file_type: FileType
  uploaded_by?: string | null
  created_at: string
  updated_at: string
  patient?: {
    id: string
    full_name: string
  }
}

export type NotificationType = 
  | 'Yeni Hasta' 
  | 'Yeni Randevu' 
  | 'Yaklaşan Randevu' 
  | 'İptal Edilen Randevu' 
  | 'Yeni Tedavi' 
  | 'Yeni Ödeme' 
  | 'Eksik Ödeme' 
  | 'Sistem Uyarısı' 
  | 'Dosya Yüklendi' 
  | 'Doktor Bildirimi'

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  notification_type: NotificationType
  link?: string | null
  created_at: string
}

export type AuditLog = {
  id: string
  user_id?: string | null
  action: string
  table_name: string
  record_id: string
  changes?: Record<string, unknown> | null
  created_at: string
}
