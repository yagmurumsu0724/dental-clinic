'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, Clock, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { usePayments } from '@/hooks/use-payments'
import { useRevenueReport } from '@/hooks/use-reports'

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">Gelir: <span className="font-bold text-foreground">₺{Number(payload[0]?.value ?? 0).toLocaleString('tr-TR')}</span></p>
    </div>
  )
}

export default function FinancePage() {
  // Use current month for finance report range
  const { start, end } = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now).toISOString(),
      end: endOfMonth(now).toISOString()
    }
  }, []);

  const { data: payments = [], isLoading: isPaymentsLoading } = usePayments();
  const { data: revenueData, isLoading: isRevLoading } = useRevenueReport(start, end);

  // Compute daily tahsilat manually or just use the current month's latest day from revenue trend
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayRevenue = revenueData?.monthlyTrend?.find(t => t.date === todayStr)?.revenue || 0;

  const summaryCards = [
    { label: 'Aylık Toplam Gelir', value: `₺${(revenueData?.totalRevenue || 0).toLocaleString('tr-TR')}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Günlük Tahsilat', value: `₺${todayRevenue.toLocaleString('tr-TR')}`, icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Bekleyen Tahsilat (Aylık)', value: `₺${(revenueData?.unpaidRevenue || 0).toLocaleString('tr-TR')}`, icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Toplam İşlem (Ay)', value: payments.length.toString(), icon: CreditCard, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Finans & Muhasebe</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ödeme takibi, nakit akışı ve gelir analizi</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 hidden sm:flex">
          <Download className="h-3.5 w-3.5" />
          Rapor İndir
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${card.color.split(' ').slice(1).join(' ')}`}>
                <Icon className={`h-5 w-5 ${card.color.split(' ')[0]}`} />
              </div>
              {isRevLoading || isPaymentsLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground tracking-tight">{card.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Aylık Gelir Analizi</h2>
            <p className="text-xs text-muted-foreground">Bu ayın günlük bazda gelir dağılımı</p>
          </div>
        </div>
        {isRevLoading ? (
          <Skeleton className="h-[240px] w-full" />
        ) : revenueData?.monthlyTrend?.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">Bu ay henüz ödeme kaydı bulunmuyor.</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData?.monthlyTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 250)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={v => format(new Date(v), 'd MMM', { locale: tr })} tick={{ fontSize: 12, fill: 'oklch(0.50 0.01 250)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'oklch(0.50 0.01 250)' }} axisLine={false} tickLine={false} tickFormatter={v => `₺${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.97 0.01 250)' }} />
              <Bar dataKey="revenue" name="Gelir" fill="oklch(0.52 0.16 253)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Payment list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Son Ödeme Kayıtları</h2>
          <Button size="sm" className="gap-1.5 shadow-sm shadow-primary/20">
            <Plus className="h-3.5 w-3.5" />
            Ödeme Ekle
          </Button>
        </div>
        <div className="divide-y divide-border">
          {isPaymentsLoading ? (
             Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="p-4 flex gap-4"><Skeleton className="h-10 w-10 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/4" /></div></div>
             ))
          ) : payments.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Kayıtlı ödeme bulunmuyor.</div>
          ) : (
            payments.map((pay, idx) => (
              <motion.div
                key={pay.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  pay.payment_status === 'Ödendi'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : pay.payment_status === 'Kısmi Ödendi'
                    ? 'bg-amber-50 dark:bg-amber-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  {pay.payment_status === 'Ödendi'
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    : pay.payment_status === 'Kısmi Ödendi'
                    ? <Clock className="h-5 w-5 text-amber-600" />
                    : <AlertCircle className="h-5 w-5 text-red-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{pay.patient?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{pay.payment_method} · {format(new Date(pay.payment_date), 'dd MMM yyyy', { locale: tr })}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-foreground">₺{(pay.total_amount || 0).toLocaleString('tr-TR')}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    {pay.paid_amount > 0 && pay.paid_amount < pay.total_amount && (
                      <span className="text-[11px] text-emerald-600">Ödenen: ₺{(pay.paid_amount || 0).toLocaleString('tr-TR')}</span>
                    )}
                    {pay.remaining_amount > 0 && (
                      <span className="text-[11px] text-amber-600">Kalan: ₺{(pay.remaining_amount || 0).toLocaleString('tr-TR')}</span>
                    )}
                    <StatusBadge status={pay.payment_status} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
