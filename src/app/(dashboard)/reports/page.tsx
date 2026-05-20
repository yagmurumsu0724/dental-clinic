'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { BarChart3, TrendingUp, Users, Calendar, Activity, CreditCard, Clock, CheckCircle2, AlertTriangle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { 
  useDashboardStats, 
  useRevenueReport, 
  useAppointmentReport, 
  useTreatmentReport, 
  usePatientAnalytics 
} from '@/hooks/use-reports'

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#64748b'];

type DateFilter = 'today' | 'week' | 'month' | 'year' | 'all';

function getDateRange(filter: DateFilter) {
  const now = new Date();
  switch (filter) {
    case 'today':
      return { start: startOfDay(now).toISOString(), end: endOfDay(now).toISOString() };
    case 'week':
      return { start: startOfWeek(now, { weekStartsOn: 1 }).toISOString(), end: endOfWeek(now, { weekStartsOn: 1 }).toISOString() };
    case 'month':
      return { start: startOfMonth(now).toISOString(), end: endOfMonth(now).toISOString() };
    case 'year':
      return { start: startOfYear(now).toISOString(), end: endOfYear(now).toISOString() };
    case 'all':
      return { start: new Date(2020, 0, 1).toISOString(), end: endOfDay(now).toISOString() };
  }
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-bold text-foreground">
            {entry.name.toLowerCase().includes('gelir') || entry.name.toLowerCase().includes('tutar') 
              ? `₺${Number(entry.value).toLocaleString('tr-TR')}` 
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [filter, setFilter] = useState<DateFilter>('month');
  const { start, end } = useMemo(() => getDateRange(filter), [filter]);

  // Queries
  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useDashboardStats();
  const { data: rev, isLoading: isRevLoading } = useRevenueReport(start, end);
  const { data: appt, isLoading: isApptLoading } = useAppointmentReport(start, end);
  const { data: treat, isLoading: isTreatLoading } = useTreatmentReport(start, end);
  const { data: pat, isLoading: isPatLoading } = usePatientAnalytics(start, end);

  const isLoading = isStatsLoading || isRevLoading || isApptLoading || isTreatLoading || isPatLoading;

  if (isStatsError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Raporlar Yüklenemedi</h2>
        <p className="text-muted-foreground">Veritabanı bağlantısında bir sorun oluştu. Lütfen sayfayı yenileyin.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Raporlar & Analitikler
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Klinik performansınızı ve finansal durumunuzu gerçek zamanlı analiz edin.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Select value={filter} onValueChange={(v) => setFilter(v as DateFilter)}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="Tarih Seçimi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Bugün</SelectItem>
              <SelectItem value="week">Bu Hafta</SelectItem>
              <SelectItem value="month">Bu Ay</SelectItem>
              <SelectItem value="year">Bu Yıl</SelectItem>
              <SelectItem value="all">Tüm Zamanlar</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-1.5 hidden sm:flex">
            <Download className="h-3.5 w-3.5" />
            PDF İndir
          </Button>
        </div>
      </div>

      {/* Global Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Hasta', value: stats?.totalPatients, icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Bugünkü Randevular', value: stats?.dailyAppointments, icon: Calendar, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
          { label: 'Aylık Ciro', value: `₺${stats?.monthlyRevenue?.toLocaleString('tr-TR')}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Bekleyen Alacak', value: `₺${stats?.pendingPayments?.toLocaleString('tr-TR')}`, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${s.color.split(' ').slice(1).join(' ')}`}>
                <Icon className={`h-5 w-5 ${s.color.split(' ')[0]}`} />
              </div>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-24 mb-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground tracking-tight">{s.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row 1: Revenue & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-foreground">Gelir Eğilimi</h2>
            <p className="text-xs text-muted-foreground">Seçili dönemdeki günlük gelir değişimi</p>
          </div>
          {isRevLoading ? <Skeleton className="h-[280px] w-full rounded-lg" /> : (
            rev?.monthlyTrend.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">Veri bulunamadı</div>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rev?.monthlyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 250)" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(v) => format(new Date(v), 'd MMM', { locale: tr })} tick={{ fontSize: 11, fill: 'oklch(0.50 0.01 250)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'oklch(0.50 0.01 250)' }} axisLine={false} tickLine={false} tickFormatter={v => `₺${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" name="Gelir" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </motion.div>

        {/* Appointment Trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold text-foreground">Randevu Yoğunluğu</h2>
              <p className="text-xs text-muted-foreground">Günlük randevu sayıları</p>
            </div>
            {!isApptLoading && (
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{appt?.completionRate.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Tamamlanma Oranı</p>
              </div>
            )}
          </div>
          {isApptLoading ? <Skeleton className="h-[280px] w-full rounded-lg" /> : (
            appt?.dailyTrend.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">Veri bulunamadı</div>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appt?.dailyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 250)" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(v) => format(new Date(v), 'd MMM', { locale: tr })} tick={{ fontSize: 11, fill: 'oklch(0.50 0.01 250)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'oklch(0.50 0.01 250)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.97 0.01 250)' }} />
                    <Bar dataKey="count" name="Randevu" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* Charts Row 2: Treatments & Patients */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Treatment Distribution */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-foreground">Tedavi Dağılımı</h2>
            <p className="text-xs text-muted-foreground">En çok uygulanan tedaviler</p>
          </div>
          {isTreatLoading ? <Skeleton className="h-[240px] w-full rounded-lg" /> : (
            treat?.distribution.length === 0 ? (
               <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">Veri bulunamadı</div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={treat?.distribution} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2}>
                      {treat?.distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </motion.div>

        {/* Financial Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Finansal Özet</h2>
            <p className="text-xs text-muted-foreground">Seçili dönem nakit akışı</p>
          </div>
          {isRevLoading ? <Skeleton className="h-[180px] w-full rounded-lg mt-4" /> : (
            <div className="flex flex-col gap-4 mt-6">
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <p className="text-xs text-muted-foreground mb-1">Kazanılan Ciro</p>
                <p className="text-2xl font-bold text-foreground">₺{rev?.totalRevenue.toLocaleString('tr-TR')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Tahsil Edilen</p>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">₺{rev?.paidRevenue.toLocaleString('tr-TR')}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Bekleyen</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">₺{rev?.unpaidRevenue.toLocaleString('tr-TR')}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Doctor Workload */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-foreground">Doktor İş Yükü</h2>
            <p className="text-xs text-muted-foreground">Randevu sayılarına göre</p>
          </div>
          {isApptLoading ? <Skeleton className="h-[240px] w-full rounded-lg" /> : (
            appt?.doctorWorkload.length === 0 ? (
               <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">Veri bulunamadı</div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appt?.doctorWorkload} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.91 0.005 250)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="doctorName" type="category" width={100} tick={{ fontSize: 11, fill: 'oklch(0.50 0.01 250)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.97 0.01 250)' }} />
                    <Bar dataKey="count" name="Randevu" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  )
}
