'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fdiTeeth, ToothStatus, toothStatuses, getToothName } from '@/lib/tooth-data'
import type { Treatment } from '@/types'
import { cn } from '@/lib/utils'

// Beautiful, custom SVG path representations of tooth types
function ToothIcon({ type, statusColor, className }: { type: 'incisor' | 'canine' | 'premolar' | 'molar'; statusColor: string; className?: string }) {
  // Common styling classes for premium rendering
  const baseSvgClasses = "w-full h-full drop-shadow-2xs transition-all duration-300 group-hover:drop-shadow-xs"

  if (type === 'molar') {
    return (
      <svg viewBox="0 0 100 100" className={cn(baseSvgClasses, className)}>
        {/* Crown with multiple cusps & multiple roots */}
        <path
          d="M 22 45 C 22 25, 30 20, 50 20 C 70 20, 78 25, 78 45 C 78 58, 72 65, 68 70 C 62 82, 58 92, 58 92 C 58 92, 54 84, 50 82 C 46 84, 42 92, 42 92 C 42 92, 38 82, 32 70 C 28 65, 22 58, 22 45 Z"
          className="transition-colors duration-300"
          fill={statusColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Anatomical occlusal surface fissure patterns */}
        <path
          d="M 32 35 C 42 42, 58 42, 68 35 M 50 21 V 42 M 38 41 L 62 41"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-slate-400/50 dark:stroke-slate-500/50 fill-none"
        />
      </svg>
    )
  }

  if (type === 'premolar') {
    return (
      <svg viewBox="0 0 100 100" className={cn(baseSvgClasses, className)}>
        {/* Bicuspid crown & single/double root representation */}
        <path
          d="M 26 44 C 26 28, 35 22, 50 22 C 65 22, 74 28, 74 44 C 74 56, 68 64, 63 70 C 58 82, 50 92, 50 92 C 50 92, 42 82, 37 70 C 32 64, 26 56, 26 44 Z"
          className="transition-colors duration-300"
          fill={statusColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Occlusal fissure */}
        <path
          d="M 36 36 C 44 40, 56 40, 64 36 M 50 23 V 38"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-slate-400/50 dark:stroke-slate-500/50 fill-none"
        />
      </svg>
    )
  }

  if (type === 'canine') {
    return (
      <svg viewBox="0 0 100 100" className={cn(baseSvgClasses, className)}>
        {/* Pointed cusp crown & single long sturdy root */}
        <path
          d="M 30 45 C 30 32, 44 20, 50 18 C 56 20, 70 32, 70 45 C 70 57, 64 66, 59 72 C 54 84, 50 94, 50 94 C 50 94, 46 84, 41 72 C 36 66, 30 57, 30 45 Z"
          className="transition-colors duration-300"
          fill={statusColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Anatomical ridge detail */}
        <path
          d="M 50 19 V 50"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-slate-400/40 dark:stroke-slate-500/40 fill-none"
        />
      </svg>
    )
  }

  // Incisor
  return (
    <svg viewBox="0 0 100 100" className={cn(baseSvgClasses, className)}>
      {/* Flat chisel-like incisal edge & single straight root */}
      <path
        d="M 32 45 C 32 34, 35 24, 50 24 C 65 24, 68 34, 68 45 C 68 57, 63 66, 58 72 C 53 84, 50 94, 50 94 C 50 94, 47 84, 42 72 C 37 66, 32 57, 32 45 Z"
        className="transition-colors duration-300"
        fill={statusColor}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Incisal edge ridge */}
      <path
        d="M 38 30 H 62"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-slate-400/40 dark:stroke-slate-500/40 fill-none"
      />
    </svg>
  )
}

interface OdontogramArchProps {
  patientId: string
  treatments: Treatment[]
}

export function OdontogramArch({ patientId, treatments }: OdontogramArchProps) {
  const router = useRouter()
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null)

  const getToothStatus = (number: number): ToothStatus => {
    const toothTreatments = treatments.filter(t => t.tooth_number === number.toString())
    if (toothTreatments.length === 0) return 'healthy'

    // Priority-based mapping
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
    
    // Check if there are active / planned treatments that might be critical
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

    return 'filling' // fallback for other treatments
  }

  const handleToothClick = (number: number) => {
    router.push(`/patients/${patientId}/tooth/${number}`)
  }

  return (
    <div className="relative w-full aspect-[4/3] min-h-[380px] md:min-h-[500px] rounded-3xl border border-border bg-slate-50/30 dark:bg-slate-900/10 p-6 md:p-10 select-none overflow-hidden">
      
      {/* ─── QUADRANT AXIS COORDINATES ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Horizontal Line */}
        <div className="w-full h-px border-t border-dashed border-slate-200 dark:border-slate-800" />
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 w-px border-l border-dashed border-slate-200 dark:border-slate-800" />
      </div>

      {/* ─── QUADRANT INFO LABELS ─── */}
      <div className="absolute top-4 left-6 text-2xs md:text-xs font-semibold text-muted-foreground uppercase tracking-widest pointer-events-none">
        Üst Sağ (Q1)
      </div>
      <div className="absolute top-4 right-6 text-2xs md:text-xs font-semibold text-muted-foreground uppercase tracking-widest pointer-events-none text-right">
        Üst Sol (Q2)
      </div>
      <div className="absolute bottom-4 right-6 text-2xs md:text-xs font-semibold text-muted-foreground uppercase tracking-widest pointer-events-none text-right">
        Alt Sol (Q3)
      </div>
      <div className="absolute bottom-4 left-6 text-2xs md:text-xs font-semibold text-muted-foreground uppercase tracking-widest pointer-events-none">
        Alt Sağ (Q4)
      </div>

      {/* ─── TEETH GRID CANVAS ─── */}
      <div className="relative w-full h-full">
        {fdiTeeth.map((tooth) => {
          const status = getToothStatus(tooth.number)
          const statusConfig = toothStatuses.find(s => s.value === status) || toothStatuses[0]
          const isHovered = hoveredTooth === tooth.number
          const toothTreatmentsCount = treatments.filter(t => t.tooth_number === tooth.number.toString()).length

          return (
            <div
              key={tooth.number}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
              style={{
                left: `${tooth.x}%`,
                top: `${tooth.y}%`,
                width: '7%',
                height: '11%',
                zIndex: isHovered ? 40 : 10
              }}
            >
              {/* Interactive Tooth Shell */}
              <button
                onClick={() => handleToothClick(tooth.number)}
                onMouseEnter={() => setHoveredTooth(tooth.number)}
                onMouseLeave={() => setHoveredTooth(null)}
                aria-label={`Diş ${tooth.number} - ${tooth.name}`}
                className={cn(
                  "relative w-full h-full group focus:outline-none flex flex-col items-center justify-center rounded-xl",
                  status === 'missing' && "opacity-50 hover:opacity-85"
                )}
              >
                {/* Anatomical Tooth SVG */}
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 ease-out group-hover:scale-118",
                  isHovered && "scale-118"
                )}>
                  <ToothIcon
                    type={tooth.type}
                    statusColor={status === 'healthy' ? (statusConfig.color) : statusConfig.color}
                    className={statusConfig.strokeClass}
                  />
                </div>

                {/* FDI Number Badge underneath */}
                <span className={cn(
                  "absolute mt-1 text-3xs md:text-2xs font-extrabold tracking-tight transition-colors duration-200 select-none px-1 py-0.5 rounded-md",
                  isHovered 
                    ? "bg-primary text-white scale-110 shadow-xs" 
                    : "text-muted-foreground/80 dark:text-muted-foreground/60"
                )}
                style={{
                  // Position FDI labels dynamically so they do not overlap
                  transform: tooth.quadrant <= 2 ? 'translateY(24px)' : 'translateY(-24px)'
                }}>
                  {tooth.number}
                </span>

                {/* Custom Interactive Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: tooth.quadrant <= 2 ? 10 : -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: tooth.quadrant <= 2 ? 10 : -10 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "absolute z-50 w-56 p-3 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg flex flex-col gap-1.5 pointer-events-none text-left",
                        tooth.quadrant <= 2 ? "top-full mt-7" : "bottom-full mb-7",
                        tooth.x > 50 ? "-right-2 md:right-auto md:left-1/2 md:-translate-x-1/2" : "-left-2 md:left-1/2 md:-translate-x-1/2"
                      )}
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                        <span className="text-sm font-bold text-foreground">Diş #{tooth.number}</span>
                        <span className={cn(
                          "text-3xs font-semibold px-2 py-0.5 rounded-full border shadow-3xs",
                          statusConfig.bgClass
                        )}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="text-3xs leading-relaxed text-muted-foreground">
                        <p className="font-medium text-foreground/90">{tooth.name}</p>
                        <p className="italic text-muted-foreground/75 mt-0.5">{tooth.nameEn}</p>
                      </div>
                      {toothTreatmentsCount > 0 ? (
                        <div className="mt-1.5 pt-1.5 border-t border-border/40 text-4xs font-medium text-primary flex items-center justify-between">
                          <span>{toothTreatmentsCount} Geçmiş Tedavi</span>
                          <span>Detay için tıklayın →</span>
                        </div>
                      ) : (
                        <div className="mt-1.5 pt-1.5 border-t border-border/40 text-4xs text-muted-foreground flex justify-between">
                          <span>Geçmiş kayıt yok</span>
                          <span>Detay için tıklayın →</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
