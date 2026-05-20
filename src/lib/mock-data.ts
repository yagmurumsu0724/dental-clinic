// Mock data layer — Supabase bağlanana kadar kullanılır
import type { Patient, Appointment, Treatment, Payment } from '@/types'

export const mockDoctors = [
  { id: 'doc-1', full_name: 'Dr. Ahmet Yılmaz', specialty: 'Genel Diş Hekimi' },
  { id: 'doc-2', full_name: 'Dr. Zeynep Kaya', specialty: 'Ortodonti' },
  { id: 'doc-3', full_name: 'Dr. Murat Demir', specialty: 'İmplantoloji' },
]

export const mockPatients: Patient[] = [
  { id: 'p-1', tc_no: '12345678901', full_name: 'Ayşe Yılmaz', birth_date: '1985-03-15', gender: 'Kadın', phone: '0532 111 22 33', email: 'ayse@example.com', address: 'Kadıköy, İstanbul', allergies: 'Penisilin alerjisi', notes: null, created_at: '2024-01-10T10:00:00Z', updated_at: '2024-01-10T10:00:00Z' },
  { id: 'p-2', tc_no: '98765432109', full_name: 'Mehmet Demir', birth_date: '1978-07-22', gender: 'Erkek', phone: '0542 333 44 55', email: 'mehmet@example.com', address: 'Beşiktaş, İstanbul', allergies: null, notes: 'Diş eti hassasiyeti var', created_at: '2024-02-05T09:00:00Z', updated_at: '2024-02-05T09:00:00Z' },
  { id: 'p-3', tc_no: '45678901234', full_name: 'Fatma Kaya', birth_date: '1992-11-08', gender: 'Kadın', phone: '0554 555 66 77', email: 'fatma@example.com', address: 'Üsküdar, İstanbul', allergies: null, notes: null, created_at: '2024-03-20T14:00:00Z', updated_at: '2024-03-20T14:00:00Z' },
  { id: 'p-4', tc_no: '23456789012', full_name: 'Ali Çelik', birth_date: '1965-05-30', gender: 'Erkek', phone: '0505 777 88 99', email: 'ali@example.com', address: 'Şişli, İstanbul', allergies: 'Lateks alerjisi', notes: null, created_at: '2024-04-01T11:00:00Z', updated_at: '2024-04-01T11:00:00Z' },
  { id: 'p-5', tc_no: '34567890123', full_name: 'Zeynep Arslan', birth_date: '2001-09-14', gender: 'Kadın', phone: '0516 999 00 11', email: 'zeynep@example.com', address: 'Maltepe, İstanbul', allergies: null, notes: 'Ortodonti takibi', created_at: '2024-04-15T08:00:00Z', updated_at: '2024-04-15T08:00:00Z' },
  { id: 'p-6', tc_no: '56789012345', full_name: 'Hasan Yıldız', birth_date: '1954-12-01', gender: 'Erkek', phone: '0532 222 33 44', email: null, address: 'Bakırköy, İstanbul', allergies: 'Amoksisilin', notes: 'Hipertansiyon ilacı kullanıyor', created_at: '2024-05-01T09:30:00Z', updated_at: '2024-05-01T09:30:00Z' },
]

export const today = new Date().toISOString().split('T')[0]

export const mockAppointments: Appointment[] = [
  { id: 'a-1', patient_id: 'p-1', doctor_id: 'doc-1', appointment_date: today, appointment_time: '09:00', status: 'Tamamlandı', notes: 'Dolgu işlemi', created_at: '2026-05-10T08:00:00Z', updated_at: '2026-05-10T08:00:00Z', patient: { id: 'p-1', full_name: 'Ayşe Yılmaz', phone: '0532 111 22 33' }, doctor: { id: 'doc-1', full_name: 'Dr. Ahmet Yılmaz' } },
  { id: 'a-2', patient_id: 'p-2', doctor_id: 'doc-2', appointment_date: today, appointment_time: '10:30', status: 'Onaylandı', notes: null, created_at: '2026-05-12T09:00:00Z', updated_at: '2026-05-12T09:00:00Z', patient: { id: 'p-2', full_name: 'Mehmet Demir', phone: '0542 333 44 55' }, doctor: { id: 'doc-2', full_name: 'Dr. Zeynep Kaya' } },
  { id: 'a-3', patient_id: 'p-3', doctor_id: 'doc-1', appointment_date: today, appointment_time: '11:00', status: 'Bekliyor', notes: 'Kanal tedavisi konsültasyonu', created_at: '2026-05-14T10:00:00Z', updated_at: '2026-05-14T10:00:00Z', patient: { id: 'p-3', full_name: 'Fatma Kaya', phone: '0554 555 66 77' }, doctor: { id: 'doc-1', full_name: 'Dr. Ahmet Yılmaz' } },
  { id: 'a-4', patient_id: 'p-4', doctor_id: 'doc-3', appointment_date: today, appointment_time: '14:00', status: 'Bekliyor', notes: 'İmplant kontrolü', created_at: '2026-05-15T11:00:00Z', updated_at: '2026-05-15T11:00:00Z', patient: { id: 'p-4', full_name: 'Ali Çelik', phone: '0505 777 88 99' }, doctor: { id: 'doc-3', full_name: 'Dr. Murat Demir' } },
  { id: 'a-5', patient_id: 'p-5', doctor_id: 'doc-2', appointment_date: today, appointment_time: '15:30', status: 'Onaylandı', notes: null, created_at: '2026-05-16T12:00:00Z', updated_at: '2026-05-16T12:00:00Z', patient: { id: 'p-5', full_name: 'Zeynep Arslan', phone: '0516 999 00 11' }, doctor: { id: 'doc-2', full_name: 'Dr. Zeynep Kaya' } },
  { id: 'a-6', patient_id: 'p-6', doctor_id: 'doc-1', appointment_date: today, appointment_time: '16:30', status: 'İptal Edildi', notes: 'Hasta iptal etti', created_at: '2026-05-17T13:00:00Z', updated_at: '2026-05-17T13:00:00Z', patient: { id: 'p-6', full_name: 'Hasan Yıldız', phone: '0532 222 33 44' }, doctor: { id: 'doc-1', full_name: 'Dr. Ahmet Yılmaz' } },
]

export const mockTreatments: Treatment[] = [
  { id: 't-1', patient_id: 'p-1', doctor_id: 'doc-1', treatment_type: 'Dolgu', tooth_number: '36', description: 'Kompozit dolgu uygulaması', price: 1500, treatment_date: '2026-05-18', status: 'Tamamlandı', notes: null, created_at: '2026-05-18T10:00:00Z', updated_at: '2026-05-18T10:00:00Z', patient: { id: 'p-1', full_name: 'Ayşe Yılmaz' }, doctor: { id: 'doc-1', full_name: 'Dr. Ahmet Yılmaz' } },
  { id: 't-2', patient_id: 'p-2', doctor_id: 'doc-1', treatment_type: 'Kanal Tedavisi', tooth_number: '46', description: 'Kök kanal tedavisi', price: 3500, treatment_date: '2026-05-17', status: 'Devam Ediyor', notes: '2. seans gerekli', created_at: '2026-05-17T10:00:00Z', updated_at: '2026-05-17T10:00:00Z', patient: { id: 'p-2', full_name: 'Mehmet Demir' }, doctor: { id: 'doc-1', full_name: 'Dr. Ahmet Yılmaz' } },
  { id: 't-3', patient_id: 'p-4', doctor_id: 'doc-3', treatment_type: 'İmplant', tooth_number: '16', description: 'Titanyum implant yerleştirme', price: 15000, treatment_date: '2026-05-15', status: 'Planlandı', notes: 'Kemik yoğunluğu uygun', created_at: '2026-05-15T10:00:00Z', updated_at: '2026-05-15T10:00:00Z', patient: { id: 'p-4', full_name: 'Ali Çelik' }, doctor: { id: 'doc-3', full_name: 'Dr. Murat Demir' } },
  { id: 't-4', patient_id: 'p-5', doctor_id: 'doc-2', treatment_type: 'Ortodonti', tooth_number: null, description: 'Braket uygulaması', price: 25000, treatment_date: '2026-05-14', status: 'Devam Ediyor', notes: 'Aylık kontrol', created_at: '2026-05-14T10:00:00Z', updated_at: '2026-05-14T10:00:00Z', patient: { id: 'p-5', full_name: 'Zeynep Arslan' }, doctor: { id: 'doc-2', full_name: 'Dr. Zeynep Kaya' } },
]

export const mockPayments: Payment[] = [
  { id: 'pay-1', patient_id: 'p-1', treatment_id: 't-1', total_amount: 1500, paid_amount: 1500, remaining_amount: 0, payment_method: 'Kredi Kartı', payment_status: 'Ödendi', payment_date: '2026-05-18', created_at: '2026-05-18T10:00:00Z', updated_at: '2026-05-18T10:00:00Z', patient: { id: 'p-1', full_name: 'Ayşe Yılmaz' } },
  { id: 'pay-2', patient_id: 'p-2', treatment_id: 't-2', total_amount: 3500, paid_amount: 1750, remaining_amount: 1750, payment_method: 'Nakit', payment_status: 'Kısmi Ödendi', payment_date: '2026-05-17', created_at: '2026-05-17T10:00:00Z', updated_at: '2026-05-17T10:00:00Z', patient: { id: 'p-2', full_name: 'Mehmet Demir' } },
  { id: 'pay-3', patient_id: 'p-4', treatment_id: 't-3', total_amount: 15000, paid_amount: 0, remaining_amount: 15000, payment_method: 'Taksit', payment_status: 'Bekliyor', payment_date: '2026-05-15', created_at: '2026-05-15T10:00:00Z', updated_at: '2026-05-15T10:00:00Z', patient: { id: 'p-4', full_name: 'Ali Çelik' } },
  { id: 'pay-4', patient_id: 'p-5', treatment_id: 't-4', total_amount: 25000, paid_amount: 8000, remaining_amount: 17000, payment_method: 'Banka Havalesi', payment_status: 'Kısmi Ödendi', payment_date: '2026-05-14', created_at: '2026-05-14T10:00:00Z', updated_at: '2026-05-14T10:00:00Z', patient: { id: 'p-5', full_name: 'Zeynep Arslan' } },
]

export const mockWeeklyRevenue = [
  { gun: 'Pzt', gelir: 8200, hedef: 10000 },
  { gun: 'Sal', gelir: 12400, hedef: 10000 },
  { gun: 'Çar', gelir: 9800, hedef: 10000 },
  { gun: 'Per', gelir: 15600, hedef: 10000 },
  { gun: 'Cum', gelir: 11200, hedef: 10000 },
  { gun: 'Cmt', gelir: 6400, hedef: 5000 },
  { gun: 'Paz', gelir: 0, hedef: 0 },
]

export const mockDashboardStats = {
  todayAppointments: 6,
  waitingPatients: 3,
  todayRevenue: 12450,
  completedTreatments: 4,
  monthlyRevenue: 284600,
  totalPatients: 312,
}
