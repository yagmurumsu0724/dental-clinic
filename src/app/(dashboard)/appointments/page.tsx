'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronLeft, ChevronRight, Filter, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { mockAppointments, mockDoctors } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Appointment } from '@/types'
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns'
import { tr } from 'date-fns/locale'

const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`)

function AppointmentChip({ appt }: { appt: Appointment }) {
  const colorMap: Record<string, string> = {
    'Bekliyor':     'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200',
    'Onaylandı':    'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200',
    'Tamamlandı':   'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-200',
    'İptal Edildi': 'bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200',
  }
  return (
    <div className={cn('rounded-lg border p-2 cursor-pointer hover:shadow-sm transition-shadow text-xs', colorMap[appt.status] ?? 'bg-muted border-border')}>
      <p className="font-semibold truncate">{appt.patient?.full_name}</p>
      <p className="opacity-75 truncate">{appt.appointment_time} · {appt.doctor?.full_name?.replace('Dr. ', '')}</p>
    </div>
  )
}

export default function AppointmentsPage() {
  const [view, setView] = useState<'week' | 'day'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterDoctor, setFilterDoctor] = useState<string>('all')

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const filtered = mockAppointments.filter(a =>
    filterDoctor === 'all' || a.doctor_id === filterDoctor
  )

  const getApptForDayHour = (day: Date, hour: string) =>
    filtered.filter(a => {
      const d = new Date(a.appointment_date + 'T00:00:00')
      return isSameDay(d, day) && a.appointment_time.startsWith(hour.split(':')[0].padStart(2, '0'))
    })

  const todayAppts = mockAppointments.filter(a => isSameDay(new Date(a.appointment_date + 'T00:00:00'), new Date()))

  return (
    <div className="flex flex-col gap-5 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Randevular</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bugün <span className="font-semibold text-foreground">{todayAppts.length}</span> randevu planlandı
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Doctor filter */}
          <select
            value={filterDoctor}
            onChange={e => setFilterDoctor(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">Tüm Doktorlar</option>
            {mockDoctors.map(d => (
              <option key={d.id} value={d.id}>{d.full_name}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden">
            {(['week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn('px-3 py-1.5 text-xs font-medium transition-colors', view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
              >
                {v === 'week' ? 'Hafta' : 'Gün'}
              </button>
            ))}
          </div>

          <Button size="sm" className="gap-1.5 shadow-sm shadow-primary/20">
            <Plus className="h-3.5 w-3.5" />
            Yeni Randevu
          </Button>
        </div>
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentDate(d => subWeeks(d, 1))} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Önceki
        </button>
        <h2 className="text-sm font-semibold text-foreground">
          {format(weekStart, 'd MMMM', { locale: tr })} — {format(addDays(weekStart, 6), 'd MMMM yyyy', { locale: tr })}
        </h2>
        <button onClick={() => setCurrentDate(d => addWeeks(d, 1))} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          Sonraki
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-border bg-muted/30">
          <div className="p-3 text-xs text-muted-foreground font-medium" />
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date())
            return (
              <div key={day.toISOString()} className={cn('p-3 text-center border-l border-border', isToday && 'bg-primary/5')}>
                <p className="text-[11px] font-medium text-muted-foreground uppercase">
                  {format(day, 'EEE', { locale: tr })}
                </p>
                <p className={cn('text-lg font-bold mt-0.5', isToday ? 'text-primary' : 'text-foreground')}>
                  {format(day, 'd')}
                </p>
              </div>
            )
          })}
        </div>

        {/* Time rows */}
        <div className="overflow-y-auto max-h-[520px] scrollbar-hide">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-border/60 last:border-0 min-h-[72px]">
              <div className="flex items-start justify-end pr-4 pt-2">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />{hour}
                </span>
              </div>
              {weekDays.map((day) => {
                const appts = getApptForDayHour(day, hour)
                const isToday = isSameDay(day, new Date())
                return (
                  <div key={day.toISOString()} className={cn('border-l border-border/60 p-1.5 space-y-1', isToday && 'bg-primary/[0.03]')}>
                    {appts.map(a => <AppointmentChip key={a.id} appt={a} />)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Today's list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Bugünkü Randevu Listesi</h2>
        </div>
        {todayAppts.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Bugün randevu bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-border">
            {todayAppts.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="text-center shrink-0 w-14">
                  <p className="text-sm font-bold text-primary">{a.appointment_time}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {a.patient?.full_name?.split(' ').map(n => n[0]).slice(0,2).join('') ?? 'NN'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{a.patient?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{a.doctor?.full_name}{a.notes ? ` · ${a.notes}` : ''}</p>
                </div>
                <StatusBadge status={a.status} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
