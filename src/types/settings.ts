export type ClinicSettings = {
  id?: string
  clinic_name: string
  clinic_phone: string
  clinic_email: string
  clinic_address: string
  website?: string
  tax_number?: string
  tax_office?: string
  working_days: string[]
  working_hours_start: string
  working_hours_end: string
  appointment_duration: number // in minutes
  primary_color?: string
  accent_color?: string
  currency: string
  timezone: string
  date_format: string
  created_at?: string
  updated_at?: string
}

export type UserSettings = {
  id?: string
  user_id: string
  theme_preference: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  created_at?: string
  updated_at?: string
}

export type NotificationSettings = {
  id?: string
  user_id: string
  email_notifications: boolean
  browser_notifications: boolean
  appointment_reminders: boolean
  payment_reminders: boolean
  treatment_alerts: boolean
  created_at?: string
  updated_at?: string
}

export type SecuritySettings = {
  id?: string
  user_id: string
  two_factor_enabled: boolean
  last_password_change?: string
  active_sessions_count?: number
  created_at?: string
  updated_at?: string
}
