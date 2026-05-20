import * as z from 'zod'

// ─── AUTHENTICATION ──────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

// ─── PATIENTS ────────────────────────────────────────────────────────────────
export const patientSchema = z.object({
  tc_no: z.string().min(11, 'TC No 11 haneli olmalıdır').max(11).optional().or(z.literal('')),
  full_name: z.string().min(3, 'Ad soyad en az 3 karakter olmalıdır'),
  birth_date: z.string().optional().or(z.literal('')),
  gender: z.enum(['Erkek', 'Kadın', 'Diğer']).optional().or(z.literal('')),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz').optional().or(z.literal('')),
  email: z.string().email('Geçerli e-posta giriniz').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  allergies: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})
export type PatientFormValues = z.infer<typeof patientSchema>

// ─── APPOINTMENTS ────────────────────────────────────────────────────────────
export const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Hasta seçimi zorunludur'),
  doctor_id: z.string().min(1, 'Doktor seçimi zorunludur'),
  appointment_date: z.string().min(1, 'Tarih seçimi zorunludur'),
  appointment_time: z.string().min(1, 'Saat seçimi zorunludur'),
  status: z.enum(['Bekliyor', 'Onaylandı', 'Tamamlandı', 'İptal Edildi']).default('Bekliyor'),
  notes: z.string().optional().or(z.literal('')),
})
export type AppointmentFormValues = z.infer<typeof appointmentSchema>

// ─── TREATMENTS ──────────────────────────────────────────────────────────────
export const treatmentSchema = z.object({
  patient_id: z.string().min(1, 'Hasta seçimi zorunludur'),
  doctor_id: z.string().min(1, 'Doktor seçimi zorunludur'),
  treatment_type: z.enum([
    'Dolgu', 'Kanal Tedavisi', 'İmplant', 'Diş Çekimi', 
    'Diş Temizliği', 'Kaplama', 'Ortodonti', 'Diğer'
  ]),
  tooth_number: z.string().optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  price: z.coerce.number().min(0, 'Tutar negatif olamaz'),
  treatment_date: z.string().min(1, 'Tarih seçimi zorunludur'),
  status: z.enum(['Planlandı', 'Devam Ediyor', 'Tamamlandı', 'İptal']).default('Planlandı'),
  notes: z.string().optional().or(z.literal('')),
})
export type TreatmentFormValues = z.infer<typeof treatmentSchema>

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
export const paymentSchema = z.object({
  patient_id: z.string().min(1, 'Hasta seçimi zorunludur'),
  treatment_id: z.string().optional().or(z.literal('')),
  total_amount: z.coerce.number().positive('Toplam tutar 0\'dan büyük olmalıdır'),
  paid_amount: z.coerce.number().min(0, 'Ödenen tutar negatif olamaz'),
  payment_method: z.enum(['Nakit', 'Kredi Kartı', 'Banka Havalesi', 'Taksit']),
  payment_status: z.enum(['Ödendi', 'Bekliyor', 'Kısmi Ödendi']).default('Bekliyor'),
  payment_date: z.string().min(1, 'Ödeme tarihi zorunludur'),
  notes: z.string().optional().or(z.literal('')),
}).refine(data => data.paid_amount <= data.total_amount, {
  message: "Ödenen tutar toplam tutardan büyük olamaz",
  path: ["paid_amount"]
})
export type PaymentFormValues = z.infer<typeof paymentSchema>

// ─── UPLOADED FILES ──────────────────────────────────────────────────────────
export const uploadFileSchema = z.object({
  patient_id: z.string().min(1, 'Hasta seçimi zorunludur'),
  file_type: z.enum(['Röntgen', 'Fotoğraf', 'PDF', 'Diğer']),
})
export type UploadFileFormValues = z.infer<typeof uploadFileSchema>

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
export const notificationSchema = z.object({
  user_id: z.string().min(1, 'Kullanıcı zorunludur'),
  title: z.string().min(1, 'Başlık zorunludur'),
  message: z.string().min(1, 'Mesaj zorunludur'),
  notification_type: z.enum(['Yeni Randevu', 'Yaklaşan Randevu', 'Yeni Tedavi', 'Yeni Ödeme', 'Sistem Uyarısı']),
})
export type NotificationFormValues = z.infer<typeof notificationSchema>
