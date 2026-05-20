'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Plus } from 'lucide-react'
import type { Treatment } from '@/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28]
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41]
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38]

interface OdontogramProps {
  treatments: Treatment[]
  onNewTreatment?: (toothNumber: number) => void
}

export function Odontogram({ treatments, onNewTreatment }: OdontogramProps) {
  const getToothStatus = (toothNumber: number) => {
    const toothTreatments = treatments.filter(t => t.tooth_number === toothNumber.toString())
    if (toothTreatments.length === 0) return 'healthy'

    const active = toothTreatments.find(t => t.status === 'Devam Ediyor' || t.status === 'Planlandı')
    if (active) return 'active'

    // Simple priority based styling
    if (toothTreatments.some(t => t.treatment_type === 'Diş Çekimi')) return 'missing'
    if (toothTreatments.some(t => t.treatment_type === 'İmplant')) return 'implant'
    return 'treated'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'fill-amber-400 stroke-amber-600'
      case 'treated': return 'fill-blue-400 stroke-blue-600'
      case 'missing': return 'fill-transparent stroke-slate-300 stroke-dashed'
      case 'implant': return 'fill-emerald-400 stroke-emerald-600'
      default: return 'fill-slate-100 stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600'
    }
  }

  const Tooth = ({ number }: { number: number }) => {
    const status = getToothStatus(number)
    const colorClass = getStatusColor(status)
    const toothTreatments = treatments.filter(t => t.tooth_number === number.toString())

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              {number}
            </span>
            <svg viewBox="0 0 40 60" className={`w-6 h-10 transition-colors ${colorClass} hover:brightness-90`}>
              {/* Simplified tooth geometry */}
              <path d="M 5,20 C 5,5 15,0 20,0 C 25,0 35,5 35,20 C 35,35 30,45 25,60 C 22,60 18,60 15,60 C 10,45 5,35 5,20 Z" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg">Diş {number}</h4>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              status === 'healthy' ? 'bg-slate-100 text-slate-600' :
              status === 'active' ? 'bg-amber-100 text-amber-700' :
              status === 'missing' ? 'bg-slate-100 text-slate-500' :
              status === 'implant' ? 'bg-emerald-100 text-emerald-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {status === 'healthy' ? 'Sağlıklı' : 
               status === 'active' ? 'Tedavi Sürecinde' : 
               status === 'missing' ? 'Çekilmiş' : 
               status === 'implant' ? 'İmplant' : 'Tedavili'}
            </span>
          </div>

          <div className="space-y-3">
            {toothTreatments.length > 0 ? (
              <div className="space-y-2">
                {toothTreatments.map(t => (
                  <div key={t.id} className="text-sm border-l-2 border-primary/30 pl-2 py-1">
                    <p className="font-medium text-foreground">{t.treatment_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.treatment_date).toLocaleDateString('tr-TR')} · {t.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Bu dişe ait tedavi kaydı bulunmuyor.</p>
            )}

            <Button 
              size="sm" 
              className="w-full mt-2 gap-1.5"
              onClick={() => onNewTreatment?.(number)}
            >
              <Plus className="h-3.5 w-3.5" />
              Yeni Tedavi Ekle
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const Arch = ({ title, left, right }: { title: string, left: number[], right: number[] }) => (
    <div className="flex flex-col items-center p-6 bg-card rounded-3xl border border-border/50 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest">{title}</h3>
      <div className="flex gap-4">
        {/* Right side (patient's right, screen left) */}
        <div className="flex gap-1 sm:gap-2">
          {right.map(num => <Tooth key={num} number={num} />)}
        </div>
        
        {/* Center line */}
        <div className="w-px bg-border mx-2 sm:mx-4" />
        
        {/* Left side (patient's left, screen right) */}
        <div className="flex gap-1 sm:gap-2">
          {left.map(num => <Tooth key={num} number={num} />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6 flex-wrap px-4 py-3 bg-muted/30 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
          Sağlıklı
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600" />
          Devam Ediyor
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-blue-400 border border-blue-600" />
          Tedavi Görmüş
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-600" />
          İmplant
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-transparent border border-dashed border-slate-400" />
          Çekilmiş
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto overflow-x-auto pb-4">
        <Arch title="Üst Çene (Maksilla)" right={UPPER_RIGHT} left={UPPER_LEFT} />
        <Arch title="Alt Çene (Mandibula)" right={LOWER_RIGHT} left={LOWER_LEFT} />
      </div>
    </div>
  )
}
