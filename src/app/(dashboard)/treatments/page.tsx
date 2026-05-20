'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { mockTreatments, mockDoctors } from '@/lib/mock-data'
import type { TreatmentType } from '@/types'

const TREATMENT_TYPES: TreatmentType[] = [
  'Dolgu', 'Kanal Tedavisi', 'İmplant', 'Diş Çekimi', 'Diş Temizliği', 'Ortodonti', 'Kaplama', 'Diğer',
]

const typeColorMap: Record<TreatmentType, string> = {
  'Dolgu':          'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  'Kanal Tedavisi': 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/20 dark:text-red-400',
  'İmplant':        'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
  'Diş Çekimi':     'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
  'Diş Temizliği':  'bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400',
  'Ortodonti':      'bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-900/20 dark:text-pink-400',
  'Kaplama':        'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
  'Diğer':          'bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-900/20 dark:text-slate-400',
}

export default function TreatmentsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const filtered = mockTreatments.filter(t => {
    const matchSearch = (t.patient?.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      t.treatment_type.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || t.treatment_type === filterType
    return matchSearch && matchType
  })

  const totalRevenue = filtered.reduce((s, t) => s + t.price, 0)

  return (
    <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Tedaviler</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-semibold text-foreground">{filtered.length}</span> tedavi · Toplam{' '}
            <span className="font-semibold text-foreground">₺{totalRevenue.toLocaleString('tr-TR')}</span>
          </p>
        </div>
        <Button size="sm" className="gap-1.5 shadow-sm shadow-primary/20 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          Yeni Tedavi
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hasta adı veya tedavi türü ara..."
            className="pl-11 h-11 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            Tümü
          </button>
          {TREATMENT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
              {['Hasta', 'Tedavi Türü', 'Diş No', 'Doktor', 'Tarih', 'Ücret', 'Durum'].map(h => (
                <TableHead key={h} className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={<Stethoscope className="h-8 w-8" />}
                    title="Tedavi bulunamadı"
                    description="Filtrelere uygun tedavi kaydı yok."
                  />
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {t.patient?.full_name?.split(' ').map(n => n[0]).slice(0,2).join('') ?? 'NN'}
                      </div>
                      <span className="font-medium text-sm text-foreground">{t.patient?.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <span className={`inline-flex items-center rounded-full ring-1 px-2.5 py-0.5 text-xs font-medium ${typeColorMap[t.treatment_type as TreatmentType]}`}>
                      {t.treatment_type}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-sm text-muted-foreground">
                    {t.tooth_number ?? '—'}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-sm text-muted-foreground">
                    {t.doctor?.full_name}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-sm text-muted-foreground">
                    {new Date(t.treatment_date).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-sm font-bold text-foreground">
                    ₺{t.price.toLocaleString('tr-TR')}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <StatusBadge status={t.status} />
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  )
}
