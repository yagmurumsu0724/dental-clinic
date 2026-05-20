'use client'

import { use, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Phone, Mail, MapPin, AlertTriangle, FileText,
  Calendar, CreditCard, Activity, Stethoscope, Edit, Plus,
  CheckCircle2, Clock, Upload, Trash2, Eye, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { usePatient } from '@/hooks/use-patients'
import { useAppointments } from '@/hooks/use-appointments'
import { useTreatments } from '@/hooks/use-treatments'
import { usePayments } from '@/hooks/use-payments'
import { useFiles } from '@/hooks/use-files'
import { OdontogramArch } from '@/components/dental/odontogram-arch'
import { Legend } from '@/components/dental/legend'
import { PatientFormDialog } from '@/components/patients/patient-form-dialog'
import { AppointmentFormDialog } from '@/components/appointments/appointment-form-dialog'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const tabs = ['Genel Bakış', 'Odontogram', 'Tedaviler', 'Randevular', 'Ödemeler', 'Dosyalar']

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [patientFormOpen, setPatientFormOpen] = useState(false)
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false)
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null)

  // Real Data Fetching
  const { data: patient, isLoading: patientLoading, error: patientError } = usePatient(id)
  const { data: appointments = [], isLoading: apptLoading } = useAppointments({ patientId: id })
  const { data: treatments = [], isLoading: treatLoading } = useTreatments(id)
  const { data: payments = [], isLoading: payLoading } = usePayments(id)
  const { data: files = [], isLoading: filesLoading } = useFiles(id)

  if (patientLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-screen-xl mx-auto py-10 animate-pulse">
        {/* Back button */}
        <Skeleton className="h-4 w-28 rounded-md" />
        {/* Profile Card Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="h-32 bg-muted/40 rounded-xl" />
          <div className="flex items-center gap-4 -mt-12 px-4">
            <Skeleton className="h-24 w-24 rounded-2xl border-4 border-card" />
            <div className="space-y-2 flex-1 mt-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        {/* Bottom content preview skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (patientError || !patient) {
    return notFound()
  }

  const totalDebt = payments.reduce((s, p) => s + (p.remaining_amount || 0), 0)
  const totalPaid = payments.reduce((s, p) => s + (p.paid_amount || 0), 0)

  const age = patient.birth_date
    ? new Date().getFullYear() - new Date(patient.birth_date).getFullYear()
    : null
  const initials = patient.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')

  const handleNewTreatment = (toothNumber: number) => {
    // Open treatment modal specifically for this tooth (Would hook into a global treatment modal)
    alert(`Diş ${toothNumber} için yeni tedavi ekleme ekranı açılacak.`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-screen-xl mx-auto pb-10">
      {/* Back */}
      <Link href="/patients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" />
        Hastalara Dön
      </Link>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-sky-200/20 dark:from-primary/10 dark:via-primary/5 dark:to-sky-900/10" />
        <div className="px-6 sm:px-10 pb-8 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-white text-3xl font-bold border-4 border-card shadow-sm shadow-primary/20">
                {initials}
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{patient.full_name}</h1>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {age ? `${age} yaşında · ` : ''}{patient.gender ?? 'Bilinmiyor'}
                  {patient.tc_no ? ` · TC: ${patient.tc_no}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setPatientFormOpen(true)}>
                <Edit className="h-4 w-4" />
                Düzenle
              </Button>
              <Button size="sm" className="gap-1.5 shadow-sm shadow-primary/20" onClick={() => setAppointmentFormOpen(true)}>
                <Calendar className="h-4 w-4" />
                Randevu Al
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {patient.phone && (
              <div className="flex items-center gap-2.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {patient.phone}
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-2.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                {patient.email}
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                {patient.address}
              </div>
            )}
          </div>

          {patient.allergies && (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-5 py-3.5 text-sm">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <span className="font-semibold text-red-700 dark:text-red-400">Alerji ve Medikal Uyarı: </span>
                <span className="text-red-600 dark:text-red-400">{patient.allergies}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-t border-border px-6 sm:px-10 flex gap-6 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="patient-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* TAB CONTENTS */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* 1. GENEL BAKIŞ */}
            {activeTab === 'Genel Bakış' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {patient.notes && (
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                      <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-primary" /> Medikal Notlar
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{patient.notes}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                      <p className="text-sm text-muted-foreground mb-1">Toplam Tedavi</p>
                      <p className="text-2xl font-bold text-foreground">{treatments.length}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                      <p className="text-sm text-muted-foreground mb-1">Toplam Randevu</p>
                      <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-5">
                      <CreditCard className="h-5 w-5 text-primary" /> Finansal Özet
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">Ödenen Tutar</span>
                        <span className="font-semibold text-emerald-600">₺{totalPaid.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Kalan Bakiye</span>
                        <span className={`font-bold ${totalDebt > 0 ? 'text-amber-600' : 'text-foreground'}`}>
                          ₺{totalDebt.toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ODONTOGRAM */}
            {activeTab === 'Odontogram' && (
              <div className="rounded-2xl border border-border bg-card shadow-sm p-6 overflow-hidden">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Dental Harita</h3>
                    <p className="text-sm text-muted-foreground">Hastanın 32 diş odontogramı ve tedavi geçmişi</p>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <OdontogramArch patientId={patient.id} treatments={treatments} />
                  <Legend />
                </div>
              </div>
            )}

            {/* 3. TEDAVİLER */}
            {activeTab === 'Tedaviler' && (
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
                  <h3 className="font-semibold text-foreground">Tedavi Kayıtları</h3>
                  <Button size="sm" className="gap-1.5 shadow-sm">
                    <Plus className="h-3.5 w-3.5" />
                    Yeni Tedavi
                  </Button>
                </div>
                {treatLoading ? (
                  <div className="p-10 text-center text-muted-foreground">Yükleniyor...</div>
                ) : treatments.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">Tedavi kaydı bulunmuyor.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {treatments.map(t => (
                      <div key={t.id} className="p-5 hover:bg-muted/30 transition-colors flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{t.treatment_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {t.tooth_number ? `Diş ${t.tooth_number} · ` : ''}{t.doctor?.full_name} · {format(new Date(t.treatment_date), 'dd MMM yyyy', { locale: tr })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">₺{t.price.toLocaleString('tr-TR')}</p>
                          <StatusBadge status={t.status} className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. RANDEVULAR */}
            {activeTab === 'Randevular' && (
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
                  <h3 className="font-semibold text-foreground">Randevu Geçmişi</h3>
                  <Button size="sm" className="gap-1.5 shadow-sm" onClick={() => setAppointmentFormOpen(true)}>
                    <Calendar className="h-3.5 w-3.5" />
                    Yeni Randevu
                  </Button>
                </div>
                {apptLoading ? (
                  <div className="p-10 text-center text-muted-foreground">Yükleniyor...</div>
                ) : appointments.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">Randevu kaydı bulunmuyor.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {appointments.map(a => (
                      <div key={a.id} className="p-5 hover:bg-muted/30 transition-colors flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 bg-violet-50 dark:bg-violet-900/20 text-violet-600 rounded-xl flex items-center justify-center">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{format(new Date(a.appointment_date), 'dd MMMM yyyy', { locale: tr })} · {a.appointment_time}</p>
                          <p className="text-sm text-muted-foreground">Dr. {a.doctor?.full_name}</p>
                        </div>
                        <div>
                          <StatusBadge status={a.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. ÖDEMELER */}
            {activeTab === 'Ödemeler' && (
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
                  <h3 className="font-semibold text-foreground">Ödeme Kayıtları</h3>
                  <Button size="sm" className="gap-1.5 shadow-sm">
                    <CreditCard className="h-3.5 w-3.5" />
                    Ödeme Al
                  </Button>
                </div>
                {payLoading ? (
                  <div className="p-10 text-center text-muted-foreground">Yükleniyor...</div>
                ) : payments.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">Ödeme kaydı bulunmuyor.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {payments.map(p => (
                      <div key={p.id} className="p-5 hover:bg-muted/30 transition-colors flex items-center gap-4">
                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${p.payment_status === 'Ödendi' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {p.payment_status === 'Ödendi' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{p.payment_method}</p>
                          <p className="text-sm text-muted-foreground">{format(new Date(p.payment_date), 'dd MMM yyyy', { locale: tr })}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">₺{p.total_amount.toLocaleString('tr-TR')}</p>
                          <StatusBadge status={p.payment_status} className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. DOSYALAR */}
            {activeTab === 'Dosyalar' && (
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
                  <h3 className="font-semibold text-foreground">Hasta Dosyaları</h3>
                  <Button size="sm" className="gap-1.5 shadow-sm">
                    <Upload className="h-3.5 w-3.5" />
                    Dosya Yükle
                  </Button>
                </div>
                {filesLoading ? (
                  <div className="p-10 text-center text-muted-foreground">Yükleniyor...</div>
                ) : files.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">Kayıtlı dosya bulunmuyor.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5">
                    {files.map(f => (
                      <div key={f.id} className="border border-border rounded-xl p-4 flex flex-col gap-3 group hover:border-primary/30 transition-colors bg-muted/10">
                        <div className="flex items-start justify-between">
                          <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewFileUrl(f.file_url)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <a href={f.file_url} target="_blank" rel="noopener noreferrer" download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-sm truncate" title={f.file_name}>{f.file_name}</p>
                          <p className="text-xs text-muted-foreground">{f.file_type} · {format(new Date(f.created_at), 'dd MMM yyyy', { locale: tr })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <PatientFormDialog open={patientFormOpen} onClose={() => setPatientFormOpen(false)} patient={patient} />
      <AppointmentFormDialog open={appointmentFormOpen} onClose={() => setAppointmentFormOpen(false)} defaultPatientId={patient.id} />
      
      {/* File Preview Dialog */}
      <Dialog open={!!previewFileUrl} onOpenChange={() => setPreviewFileUrl(null)}>
        <DialogContent className="max-w-4xl bg-black/95 border-0 p-0 overflow-hidden">
          {previewFileUrl && (
            <div className="w-full h-[80vh] flex items-center justify-center relative group">
              <Button variant="secondary" size="sm" className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                <a href={previewFileUrl} target="_blank" rel="noopener noreferrer" download>İndir</a>
              </Button>
              {previewFileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={previewFileUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
              ) : previewFileUrl.match(/\.(pdf)$/i) ? (
                <iframe src={previewFileUrl} className="w-full h-full border-0 bg-white" />
              ) : (
                <p className="text-white">Önizleme desteklenmiyor.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
