import { type AppointmentStatus, type PaymentStatus, type TreatmentStatus } from '@/types'
import { cn } from '@/lib/utils'

type StatusVariant = AppointmentStatus | PaymentStatus | TreatmentStatus | string

const statusMap: Record<string, string> = {
  // Randevu
  'Bekliyor':       'status-waiting',
  'Onaylandı':      'status-confirmed',
  'Tamamlandı':     'status-done',
  'İptal Edildi':   'status-cancelled',
  // Ödeme
  'Ödendi':         'status-done',
  'Kısmi Ödendi':   'status-waiting',
  // Tedavi
  'Planlandı':      'status-waiting',
  'Devam Ediyor':   'status-confirmed',
  'İptal':          'status-cancelled',
}

interface StatusBadgeProps {
  status: StatusVariant
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cls = statusMap[status] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', cls, className)}>
      {status}
    </span>
  )
}
