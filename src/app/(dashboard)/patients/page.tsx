'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, UserPlus, Phone, Mail, Calendar, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { TableRowSkeleton } from '@/components/ui/skeleton'
import { PatientFormDialog } from '@/components/patients/patient-form-dialog'
import { AppointmentFormDialog } from '@/components/appointments/appointment-form-dialog'
import { usePatients, useDeletePatient } from '@/hooks/use-patients'
import type { Patient } from '@/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function PatientRow({
  patient,
  idx,
  onEdit,
  onNewAppointment,
}: {
  patient: Patient
  idx: number
  onEdit: (p: Patient) => void
  onNewAppointment: (patientId: string) => void
}) {
  const router = useRouter()
  const deletePatient = useDeletePatient()
  const initials = patient.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')
  const age = patient.birth_date
    ? new Date().getFullYear() - new Date(patient.birth_date).getFullYear()
    : null

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) {
      return
    }
    router.push(`/patients/${patient.id}`)
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.2 }}
      onClick={handleRowClick}
      className="group hover:bg-muted/40 transition-colors border-b border-border last:border-0 cursor-pointer"
    >
      <TableCell className="py-3.5 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary border border-primary/15">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">{patient.full_name}</p>
            <p className="text-xs text-muted-foreground">{patient.tc_no}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3.5 text-sm text-muted-foreground">
        {age ? `${age} yaş` : '—'} · {patient.gender ?? '—'}
      </TableCell>
      <TableCell className="py-3.5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {patient.phone ?? '—'}
        </div>
      </TableCell>
      <TableCell className="py-3.5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground truncate max-w-[200px]">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          {patient.email ?? '—'}
        </div>
      </TableCell>
      <TableCell className="py-3.5">
        {patient.allergies ? (
          <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-1 ring-red-600/20 px-2.5 py-0.5 text-xs font-medium">
            ⚠ Alerji
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="py-3.5 text-right px-5">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost" size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={() => onNewAppointment(patient.id)}
          >
            <Calendar className="h-3.5 w-3.5" />
            Randevu
          </Button>
          <Button
            variant="ghost" size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={() => onEdit(patient)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Düzenle
          </Button>
          <Button
            variant="ghost" size="sm"
            className="h-8 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`${patient.full_name} adlı hastayı silmek istediğinize emin misiniz?`)) {
                deletePatient.mutate(patient.id)
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </motion.tr>
  )
}

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [patientFormOpen, setPatientFormOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>()
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>()

  const { data: patients = [], isLoading, error } = usePatients()

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.tc_no?.includes(search) ||
    p.phone?.includes(search)
  )

  const handleEdit = (p: Patient) => {
    setEditingPatient(p)
    setPatientFormOpen(true)
  }

  const handleNewAppointment = (patientId: string) => {
    setSelectedPatientId(patientId)
    setAppointmentFormOpen(true)
  }

  const handleFormClose = () => {
    setPatientFormOpen(false)
    setEditingPatient(undefined)
  }

  return (
    <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Hastalar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? 'Yükleniyor...'
              : `Toplam ${patients.length} kayıtlı hasta`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filtrele
          </Button>
          <Button
            size="sm"
            className="gap-1.5 shadow-sm shadow-primary/20"
            onClick={() => setPatientFormOpen(true)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Yeni Hasta
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ad, TC No veya telefon ile ara..."
          className="pl-11 h-11 rounded-xl bg-background border-border"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Hastalar yüklenirken hata oluştu: {(error as Error).message}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
              {['Hasta', 'Yaş · Cinsiyet', 'Telefon', 'E-posta', 'Durum', 'İşlemler'].map(h => (
                <TableHead key={h} className={`py-3 ${h === 'İşlemler' ? 'px-5 text-right' : 'px-4'} text-xs font-semibold uppercase tracking-wider text-muted-foreground`}>
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={<UserPlus className="h-8 w-8" />}
                    title={search ? 'Sonuç bulunamadı' : 'Henüz hasta yok'}
                    description={search ? `"${search}" için kayıt bulunamadı.` : 'İlk hastanızı ekleyerek başlayın.'}
                    action={
                      !search ? (
                        <Button size="sm" className="gap-1.5" onClick={() => setPatientFormOpen(true)}>
                          <Plus className="h-3.5 w-3.5" />İlk Hastayı Ekle
                        </Button>
                      ) : undefined
                    }
                  />
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <PatientRow
                  key={p.id}
                  patient={p}
                  idx={i}
                  onEdit={handleEdit}
                  onNewAppointment={handleNewAppointment}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {filtered.length} hasta gösteriliyor{search ? ` · "${search}" araması` : ''}
        </p>
      )}

      {/* Dialogs */}
      <PatientFormDialog
        open={patientFormOpen}
        onClose={handleFormClose}
        patient={editingPatient}
      />
      <AppointmentFormDialog
        open={appointmentFormOpen}
        onClose={() => setAppointmentFormOpen(false)}
        defaultPatientId={selectedPatientId}
      />
    </div>
  )
}
