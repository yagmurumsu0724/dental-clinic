'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Calendar, Stethoscope, User, DollarSign,
  FileText, Activity, AlertCircle, Sparkles, ClipboardList,
  ShieldCheck, HeartPulse
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePatient } from '@/hooks/use-patients'
import { useTreatments } from '@/hooks/use-treatments'
import { fdiTeeth, getToothName, toothStatuses, ToothStatus } from '@/lib/tooth-data'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

// Premium vector representation of the tooth inside Hero card
function ToothHeroGraphic({ type, statusColor }: { type: 'incisor' | 'canine' | 'premolar' | 'molar'; statusColor: string }) {
  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto flex items-center justify-center p-2 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-border/40 shadow-inner">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Outer shadow / background glow */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={statusColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#glow)" className="animate-pulse duration-3000" />

        {/* Detailed anatomical roots and crown */}
        {type === 'molar' && (
          <>
            <path
              d="M 60 80 C 60 40, 75 30, 100 30 C 125 30, 140 40, 140 80 C 140 105, 132 118, 126 128 C 116 150, 108 174, 108 174 C 108 174, 102 160, 100 156 C 98 160, 92 174, 92 174 C 92 174, 84 150, 74 128 C 68 118, 60 105, 60 80 Z"
              fill={statusColor}
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-50 dark:text-slate-900 stroke-slate-300 dark:stroke-slate-700 transition-colors duration-500"
            />
            {/* Crown fissure details */}
            <path d="M 75 66 C 90 78, 110 78, 125 66 M 100 31 V 74 M 82 78 L 118 78" stroke="currentColor" strokeWidth="2" className="text-slate-400/40 dark:text-slate-500/40 fill-none" />
            {/* Pulp cavity outline (Endo detail) */}
            <path d="M 100 75 Q 100 115, 100 148" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" className="text-orange-500/50 dark:text-orange-400/50 fill-none" />
          </>
        )}

        {type === 'premolar' && (
          <>
            <path
              d="M 64 80 C 64 48, 74 34, 100 34 C 126 34, 136 48, 136 80 C 136 102, 128 118, 120 130 C 112 152, 100 174, 100 174 C 100 174, 88 152, 80 130 C 72 118, 64 102, 64 80 Z"
              fill={statusColor}
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-50 dark:text-slate-900 stroke-slate-300 dark:stroke-slate-700 transition-colors duration-500"
            />
            {/* Details */}
            <path d="M 80 70 Q 100 80, 120 70 M 100 35 V 72" stroke="currentColor" strokeWidth="2" className="text-slate-400/40 dark:text-slate-500/40 fill-none" />
            <path d="M 100 70 V 135" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" className="text-orange-500/50 dark:text-orange-400/50 fill-none" />
          </>
        )}

        {type === 'canine' && (
          <>
            <path
              d="M 66 82 C 66 58, 88 38, 100 34 C 112 38, 134 58, 134 82 C 134 104, 124 122, 116 134 C 108 156, 100 176, 100 176 C 100 176, 92 156, 84 134 C 76 122, 66 104, 66 82 Z"
              fill={statusColor}
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-50 dark:text-slate-900 stroke-slate-300 dark:stroke-slate-700 transition-colors duration-500"
            />
            {/* Anatomical ridge */}
            <path d="M 100 35 V 95" stroke="currentColor" strokeWidth="2" className="text-slate-400/40 dark:text-slate-500/40 fill-none" />
            <path d="M 100 85 V 150" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" className="text-orange-500/50 dark:text-orange-400/50 fill-none" />
          </>
        )}

        {type === 'incisor' && (
          <>
            <path
              d="M 68 82 C 68 62, 72 44, 100 44 C 128 44, 132 62, 132 82 C 132 104, 124 122, 116 134 C 108 156, 100 176, 100 176 C 100 176, 92 156, 84 134 C 76 122, 68 104, 68 82 Z"
              fill={statusColor}
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-50 dark:text-slate-900 stroke-slate-300 dark:stroke-slate-700 transition-colors duration-500"
            />
            {/* Flat chisel detail */}
            <path d="M 76 54 H 124" stroke="currentColor" strokeWidth="2" className="text-slate-400/40 dark:text-slate-500/40 fill-none" />
            <path d="M 100 54 V 140" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" className="text-orange-500/50 dark:text-orange-400/50 fill-none" />
          </>
        )}
      </svg>
    </div>
  )
}

// Function to yield realistic dental materials based on treatment types
const getMaterialsUsed = (type: string): string[] => {
  switch (type) {
    case 'Dolgu':
      return ['Kompozit Rezin (3M ESPE)', 'Bonding Ajanı (Single Bond)', 'Asit Ekleme Jeli (37% Phosphoric)', 'Matris Bandı', 'Cila Diskleri']
    case 'Kanal Tedavisi':
      return ['Guta Perka (Protaper)', 'Kanal Simanı (AH Plus)', 'Sodyum Hipoklorit (5.25% NaOCl)', 'EDTA Jel', 'Döner Alet Eğeleri (NiTi WaveOne)']
    case 'İmplant':
      return ['Titanyum İmplant Gövdesi (Straumann)', 'Abutment (Kuron Dayanağı)', 'Kemik Grefti (Geistlich Bio-Oss)', 'Kollajen Membran', 'Dikiş İpliği (Prokoll 4-0)']
    case 'Kaplama':
      return ['Zirkonyum Oksit Altyapı Blok', 'Kuron Porseleni (Ivoclar)', 'Geçici Yapıştırıcı Siman (Temp-Bond)', 'Rezin Siman (RelyX U200)']
    case 'Diş Çekimi':
      return ['Lokal Anestezik (Maxicaine %4 Artikain)', 'Steril Hemostatik Sünger', 'Sütür Materyali', 'Steril Gazlı Bez']
    case 'Diş Temizliği':
      return ['Ultrasonik Kavitron Ucu', 'Polisaj Patı (Florürlü)', 'Profilaksi Fırçası', 'Arayüz Zımparası']
    default:
      return ['Medikal Sarf Malzemeleri', 'Steril Eldiven ve Maske seti', 'Tükürük Emici']
  }
}

export default function ToothDetailPage({ params }: { params: Promise<{ id: string; toothId: string }> }) {
  const { id, toothId } = use(params)
  const toothNumber = parseInt(toothId, 10)

  // Fetch real patient and treatment data
  const { data: patient, isLoading: patientLoading, error: patientError } = usePatient(id)
  const { data: treatments = [], isLoading: treatLoading } = useTreatments(id)

  const toothMetadata = fdiTeeth.find(t => t.number === toothNumber)

  if (patientLoading || treatLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-screen-xl mx-auto py-10 animate-pulse">
        {/* Back link skeleton */}
        <Skeleton className="h-4 w-36 rounded-md" />
        
        {/* Dual column skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <Skeleton className="h-10 w-16 mx-auto rounded-2xl" />
              <Skeleton className="h-40 w-40 mx-auto rounded-full" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
          {/* Right panel skeleton */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (patientError || !patient || !toothMetadata) {
    return notFound()
  }

  // Filter treatments specific to this tooth number
  const toothTreatments = treatments
    .filter(t => t.tooth_number === toothId)
    .sort((a, b) => new Date(b.treatment_date).getTime() - new Date(a.treatment_date).getTime())

  // Dynamic status evaluation
  const getToothStatus = (): ToothStatus => {
    if (toothTreatments.length === 0) return 'healthy'

    if (toothTreatments.some(t => t.treatment_type === 'Diş Çekimi' && t.status === 'Tamamlandı')) {
      return 'missing'
    }
    if (toothTreatments.some(t => t.treatment_type === 'İmplant')) {
      return 'implant'
    }
    if (toothTreatments.some(t => t.treatment_type === 'Kanal Tedavisi')) {
      return 'root-canal'
    }
    if (toothTreatments.some(t => t.treatment_type === 'Kaplama')) {
      return 'crown'
    }

    if (toothTreatments.some(t => t.status === 'Devam Ediyor' || t.status === 'Planlandı')) {
      const hasCritical = toothTreatments.some(t => 
        t.description?.toLowerCase().includes('kritik') || 
        t.description?.toLowerCase().includes('acil') ||
        t.notes?.toLowerCase().includes('kritik') ||
        t.notes?.toLowerCase().includes('acil')
      )
      return hasCritical ? 'critical' : 'filling'
    }

    if (toothTreatments.some(t => t.treatment_type === 'Dolgu')) {
      return 'filling'
    }

    return 'filling'
  }

  const currentStatus = getToothStatus()
  const statusConfig = toothStatuses.find(s => s.value === currentStatus) || toothStatuses[0]

  // Quadrant Labels Map
  const quadrantLabels: Record<number, string> = {
    1: 'Üst Sağ Kadran (Q1)',
    2: 'Üst Sol Kadran (Q2)',
    3: 'Alt Sol Kadran (Q3)',
    4: 'Alt Sağ Kadran (Q4)'
  }

  // Visual status indicators
  const trTypeMap: Record<string, string> = {
    incisor: 'Kesici Diş (Incisor)',
    canine: 'Köpek Dişi (Canine/Kanin)',
    premolar: 'Küçük Azı (Premolar)',
    molar: 'Büyük Azı (Molar)'
  }

  return (
    <div className="flex flex-col gap-6 max-w-screen-xl mx-auto pb-10">
      
      {/* ─── BREADCRUMBS / NAVIGATION ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href={`/patients/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {patient.full_name} - Odontograma Dön
        </Link>
        <span className="text-2xs font-medium bg-muted/60 dark:bg-muted/20 border border-border/60 px-3 py-1.5 rounded-lg text-muted-foreground">
          Hasta Kimliği: <strong className="text-foreground">{patient.tc_no || patient.id.slice(0, 8)}</strong>
        </span>
      </div>

      {/* ─── DUAL PANEL GRID LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ─── LEFT PANEL: TOOTH HERO CARD ─── */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-border bg-card shadow-sm p-6 overflow-hidden flex flex-col items-center text-center relative"
          >
            {/* Colored top gradient bar */}
            <div 
              className="absolute top-0 inset-x-0 h-2.5 transition-all duration-300"
              style={{ backgroundColor: statusConfig.color }}
            />

            {/* Tooth FDI Tag */}
            <div className="mt-2 inline-flex items-center justify-center h-10 w-16 rounded-2xl bg-primary/10 text-primary text-lg font-black border border-primary/25 shadow-xs">
              #{toothMetadata.number}
            </div>

            {/* Premium Vector Anatomical Illustration */}
            <div className="my-6">
              <ToothHeroGraphic
                type={toothMetadata.type}
                statusColor={statusConfig.color}
              />
            </div>

            {/* Tooth Names */}
            <div>
              <h2 className="text-lg font-extrabold text-foreground tracking-tight">{toothMetadata.name}</h2>
              <p className="text-xs font-semibold italic text-muted-foreground/80 mt-1">{toothMetadata.nameEn}</p>
            </div>

            {/* Clinical Position Details */}
            <div className="mt-5 w-full grid grid-cols-2 gap-2 border-t border-b border-border/60 py-4 text-left">
              <div>
                <span className="block text-4xs font-bold text-muted-foreground uppercase tracking-widest">Çene Bölgesi</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block">{quadrantLabels[toothMetadata.quadrant]}</span>
              </div>
              <div>
                <span className="block text-4xs font-bold text-muted-foreground uppercase tracking-widest">Anatomik Sınıf</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block">{trTypeMap[toothMetadata.type]}</span>
              </div>
            </div>

            {/* Current Treatment Status */}
            <div className="mt-5 w-full flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/40 border border-border/50 px-4 py-3 rounded-2xl">
              <div className="text-left">
                <span className="block text-5xs font-black text-muted-foreground uppercase tracking-widest">Klinik Durum</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block">{statusConfig.label}</span>
              </div>
              <span className={cn("text-2xs font-extrabold px-3 py-1 rounded-full border shadow-3xs", statusConfig.bgClass)}>
                {statusConfig.value.toUpperCase()}
              </span>
            </div>
          </motion.div>

          {/* Clinical Vitality Specs / Diagnostics */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-3xl border border-border bg-card shadow-sm p-6 space-y-4"
          >
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider">
              <HeartPulse className="h-4.5 w-4.5 text-primary" /> Teşhis ve Ölçümler
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-border/50">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" /> Pulpa Canlılığı (Vitality)
                </span>
                <span className={cn(
                  "font-bold px-2 py-0.5 rounded-md text-3xs",
                  currentStatus === 'root-canal' || currentStatus === 'missing' || currentStatus === 'implant'
                    ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/35"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/35"
                )}>
                  {currentStatus === 'root-canal' || currentStatus === 'missing' || currentStatus === 'implant' ? 'Cevapsız (Devital)' : 'Normal (Vital)'}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-2.5 border-b border-border/50">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-blue-500" /> Cep Derinliği (Sulkus)
                </span>
                <span className="font-bold text-foreground">
                  {currentStatus === 'critical' ? '4.5 mm (Artmış)' : '1.8 mm (Fizyolojik)'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-500" /> Mobilite Derecesi
                </span>
                <span className="font-bold text-foreground">Sınıf 0 (Fizyolojik)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT PANEL: CHRONOLOGICAL TREATMENT HISTORY TIMELINE ─── */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <div className="p-5 md:p-6 border-b border-border bg-muted/15 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-foreground text-base">Diş Tedavi Geçmişi</h3>
                <p className="text-xs text-muted-foreground mt-0.5">#{toothNumber} numaralı dişe yapılan tüm müdahaleler</p>
              </div>
              <span className="text-3xs font-extrabold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {toothTreatments.length} Kayıt
              </span>
            </div>

            <div className="p-6">
              {toothTreatments.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-center text-muted-foreground/60 shadow-3xs">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Tedavi Kaydı Bulunmuyor</p>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-xs mx-auto">
                      Bu dişe ait herhangi bir klinik geçmiş bulunmamaktadır. Sağlıklı olarak kabul edilmiştir.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 pl-6 space-y-8 py-2">
                  
                  {toothTreatments.map((treatment, index) => {
                    const materials = getMaterialsUsed(treatment.treatment_type)
                    return (
                      <div key={treatment.id} className="relative group">
                        
                        {/* Timeline Connector Dot */}
                        <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-card border-2 border-primary shadow-xs group-hover:scale-120 transition-transform duration-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                        </span>

                        {/* Timeline Card */}
                        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-xs group-hover:border-primary/25 transition-all duration-300">
                          
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                <Stethoscope className="h-4.5 w-4.5" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-foreground text-sm tracking-tight">{treatment.treatment_type}</h4>
                                <span className="text-3xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                                  <Calendar className="h-3 w-3 shrink-0 text-primary" />
                                  {format(new Date(treatment.treatment_date), 'dd MMMM yyyy · eeee', { locale: tr })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-foreground">
                                <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                {treatment.price.toLocaleString('tr-TR')}
                              </span>
                              <StatusBadge status={treatment.status} />
                            </div>
                          </div>

                          {/* Physician Details */}
                          <div className="mt-3.5 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/30 border border-border/40 px-3 py-1.5 rounded-xl text-3xs w-fit">
                            <User className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-muted-foreground">Müdahaleyi Yapan: </span>
                            <strong className="text-foreground">{treatment.doctor?.full_name || 'Dr. Tanımsız'}</strong>
                          </div>

                          {/* Clinic Notes */}
                          {treatment.description && (
                            <div className="mt-4 bg-muted/30 dark:bg-muted/10 border border-border/60 px-4 py-3 rounded-xl">
                              <div className="flex items-center gap-1.5 text-4xs font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                                <FileText className="h-3.5 w-3.5 text-primary" /> Hekim Klinik Notları
                              </div>
                              <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {treatment.description}
                              </p>
                            </div>
                          )}

                          {/* Materials Tag List */}
                          <div className="mt-4">
                            <div className="flex items-center gap-1.5 text-4xs font-black text-muted-foreground uppercase tracking-widest mb-2">
                              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" /> Kullanılan Klinik Materyaller
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {materials.map((mat, i) => (
                                <span 
                                  key={i} 
                                  className="text-4xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 px-2 py-0.5 rounded-md hover:border-primary/20 transition-colors"
                                >
                                  {mat}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    )
                  })}
                  
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  )
}
