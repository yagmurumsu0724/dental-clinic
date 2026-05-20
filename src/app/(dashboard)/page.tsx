'use client'

import { motion } from 'framer-motion'
import {
  Calendar, Users, Activity, Clock,
  ArrowUpRight, ArrowDownRight, Minus,
  Stethoscope, CheckCircle2, AlertTriangle, UserPlus
} from 'lucide-react'
import { mockAppointments, mockTreatments, mockPatients } from '@/lib/mock-data'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'

// ─── Stat Card ────────────────────────────────────────
const statCards = [
  {
    title: 'Toplam Hasta',
    value: mockPatients.length.toString(),
    change: '+5',
    trend: 'up' as const,
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Bugünkü Randevular',
    value: mockAppointments.length.toString(),
    change: '+2',
    trend: 'up' as const,
    icon: Calendar,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    title: 'Bekleyen Hastalar',
    value: '3', // Mock
    change: '-1',
    trend: 'down' as const,
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    title: 'Tamamlanan Tedaviler',
    value: mockTreatments.filter(t => t.status === 'Tamamlandı').length.toString(),
    change: '+8',
    trend: 'up' as const,
    icon: Activity,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
]

function StatCard({ card, index }: { card: typeof statCards[0]; index: number }) {
  const Icon = card.icon
  const TrendIcon =
    card.trend === 'up' ? ArrowUpRight :
    card.trend === 'down' ? ArrowDownRight : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
          <Icon className={`h-5 w-5 ${card.color}`} />
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground tracking-tight mb-1.5">
        {card.value}
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className={`flex items-center gap-0.5 font-semibold ${
          card.trend === 'up' ? 'text-emerald-600' :
          card.trend === 'down' ? 'text-emerald-600' : 'text-muted-foreground'
        }`}>
          <TrendIcon className="h-3 w-3" />
          {card.change}
        </span>
        <span className="text-muted-foreground">bu hafta</span>
      </div>
    </motion.div>
  )
}

// ─── Appointments List ─────────────────────────────────
function AppointmentRow({ appt, idx }: { appt: typeof mockAppointments[0]; idx: number }) {
  const initials = appt.patient?.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('') ?? 'NN'
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.2 }}
      className="flex items-center gap-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 -mx-5 px-5 transition-colors group"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{appt.patient?.full_name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{appt.doctor?.full_name} · {appt.notes || 'Genel Kontrol'}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-primary mb-1">{appt.appointment_time}</p>
        <StatusBadge status={appt.status} />
      </div>
    </motion.div>
  )
}

// ─── Patient Row ──────────────────────────────────────
function PatientRow({ p, idx }: { p: typeof mockPatients[0]; idx: number }) {
  const initials = p.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.2 }}
      className="flex items-center gap-3 py-3 border-b border-border last:border-0"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{p.full_name}</p>
        <p className="text-xs text-muted-foreground truncate">{p.phone}</p>
      </div>
      <Button variant="ghost" size="sm" className="h-8 text-xs shrink-0">
        Profil
      </Button>
    </motion.div>
  )
}

// ─── Dashboard Page ───────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto pb-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Klinik İşleyişi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => <StatCard key={card.title} card={card} index={i} />)}
      </div>

      {/* Main Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="col-span-1 lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Bugünkü Randevular
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Günlük hasta akışı ve randevu saatleri</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full px-2.5 py-0.5 font-semibold">
              {mockAppointments.length} Bekleyen
            </span>
          </div>
          <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
            {mockAppointments.map((a, i) => <AppointmentRow key={a.id} appt={a} idx={i} />)}
            {mockAppointments.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">Bugün için randevu bulunmuyor.</div>
            )}
          </div>
        </motion.div>

        {/* Clinical Sidebar Column */}
        <div className="flex flex-col gap-6">
          
          {/* Waiting Room Alert */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 p-5 shadow-sm"
          >
            <h2 className="text-base font-semibold text-amber-900 dark:text-amber-500 flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              Bekleme Salonu
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-amber-800 dark:text-amber-400">Ahmet Yılmaz</span>
                <span className="text-xs text-amber-600 dark:text-amber-500 font-semibold">15 dk bekliyor</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-amber-800 dark:text-amber-400">Ayşe Demir</span>
                <span className="text-xs text-amber-600 dark:text-amber-500 font-semibold">5 dk bekliyor</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Patients */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Yeni Kayıtlar
              </h2>
            </div>
            <div className="space-y-1">
              {mockPatients.slice(0, 4).map((p, i) => <PatientRow key={p.id} p={p} idx={i} />)}
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs font-medium">Tüm Hastaları Gör</Button>
          </motion.div>
        </div>
      </div>
      
      {/* Operational Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.3 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
            Devam Eden Tedaviler
          </h2>
          <div className="space-y-3">
            {mockTreatments.filter(t => t.status !== 'Tamamlandı').slice(0,3).map((t, i) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                <div>
                  <p className="text-sm font-semibold">{t.patient?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{t.treatment_type} - Diş {t.tooth_number}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            Klinik Uyarıları & Görevler
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
              <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400">Stok Uyarısı</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80">Kompozit dolgu malzemesi kritik seviyenin altında.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Laboratuvar Teslimatı</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Mehmet Demir'in zirkonyum kaplamaları bugün teslim edilecek.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
