'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  User, 
  Calendar, 
  Activity, 
  UserPlus, 
  Settings, 
  Bell, 
  CreditCard, 
  CornerDownLeft,
  X,
  Command
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockPatients } from '@/lib/mock-data'
import { usePatients } from '@/hooks/use-patients'
import { useAppointments } from '@/hooks/use-appointments'
import { useTreatments } from '@/hooks/use-treatments'
import { useQuickActionStore } from '@/stores/quick-action-store'

interface SearchCommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SearchResultItem = 
  | { type: 'patient'; id: string; title: string; subtitle: string; route: string }
  | { type: 'appointment'; id: string; title: string; subtitle: string; route: string }
  | { type: 'treatment'; id: string; title: string; subtitle: string; route: string }
  | { type: 'action'; id: string; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; handler: () => void }

export function SearchCommandPalette({ open, onOpenChange }: SearchCommandPaletteProps) {
  const router = useRouter()
  const { openPatientForm, openAppointmentForm } = useQuickActionStore()
  
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch real registered records dynamically
  const { data: dbPatients = [] } = usePatients()
  const { data: dbAppointments = [] } = useAppointments()
  const { data: dbTreatments = [] } = useTreatments()

  // Helper to filter out anonymous/test/invalid records
  const isAnonymousOrTest = (name: string) => {
    const normalized = name.toLowerCase()
    return (
      normalized.includes('anonim') || 
      normalized.includes('isimsiz') || 
      normalized.includes('bilinmeyen') ||
      normalized.includes('test') ||
      normalized === 'hasta' ||
      normalized === 'adsız'
    )
  }

  // Filtered lists excluding anonymous records
  const activePatients = useMemo(() => {
    return dbPatients.filter(p => p.full_name && !isAnonymousOrTest(p.full_name))
  }, [dbPatients])

  const activeAppointments = useMemo(() => {
    return dbAppointments.filter(a => {
      const patientName = a.patient?.full_name || ''
      return patientName && !isAnonymousOrTest(patientName)
    })
  }, [dbAppointments])

  const activeTreatments = useMemo(() => {
    return dbTreatments.filter(t => {
      const patientName = t.patient?.full_name || ''
      return patientName && !isAnonymousOrTest(patientName)
    })
  }, [dbTreatments])

  // Listen for Cmd+K / Ctrl+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  // Reset state when opening/closing
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [open])

  // Define static quick actions
  const quickActions = useMemo(() => [
    {
      id: 'act-new-patient',
      title: 'Yeni Hasta Ekle',
      subtitle: 'Sisteme yeni bir hasta kaydı oluştur',
      icon: UserPlus,
      handler: () => {
        openPatientForm()
        onOpenChange(false)
      }
    },
    {
      id: 'act-new-app',
      title: 'Yeni Randevu Oluştur',
      subtitle: 'Seçili bir hekime veya hastaya randevu ekle',
      icon: Calendar,
      handler: () => {
        openAppointmentForm()
        onOpenChange(false)
      }
    },
    {
      id: 'act-settings',
      title: 'Ayarlar Paneli',
      subtitle: 'Klinik ayarları ve bildirim tercihlerini düzenle',
      icon: Settings,
      handler: () => {
        router.push('/settings')
        onOpenChange(false)
      }
    },
    {
      id: 'act-notifications',
      title: 'Bildirimler',
      subtitle: 'Klinikteki son aktiviteleri ve uyarıları incele',
      icon: Bell,
      handler: () => {
        router.push('/notifications')
        onOpenChange(false)
      }
    },
    {
      id: 'act-finance',
      title: 'Finansal Raporlar',
      subtitle: 'Gelir, gider ve ödeme durumlarını gör',
      icon: CreditCard,
      handler: () => {
        router.push('/finance')
        onOpenChange(false)
      }
    }
  ], [openPatientForm, openAppointmentForm, router, onOpenChange])

  // Perform dynamic search across database + suggestions
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    
    // 1. Suggestions mode (when search query is empty)
    if (!trimmed) {
      const list: SearchResultItem[] = []

      // Suggest first 3 active registered patients
      const patientSuggestions = activePatients.slice(0, 3)
      patientSuggestions.forEach(p => {
        list.push({
          type: 'patient' as const,
          id: `suggestion-patient-${p.id}`,
          title: p.full_name,
          subtitle: `Kayıtlı Hasta • Tel: ${p.phone || 'Girilmemiş'} • T.C.: ${p.tc_no || 'Girilmemiş'}`,
          route: `/patients/${p.id}`
        })
      })

      // Fallback to non-anonymous mock patients if DB is completely empty
      if (patientSuggestions.length === 0) {
        const fallbackPatients = mockPatients
          .filter(p => p.full_name && !isAnonymousOrTest(p.full_name))
          .slice(0, 3)
        fallbackPatients.forEach(p => {
          list.push({
            type: 'patient' as const,
            id: `suggestion-patient-mock-${p.id}`,
            title: p.full_name,
            subtitle: `Kayıtlı Hasta (Örnek) • Tel: ${p.phone || 'Girilmemiş'} • T.C.: ${p.tc_no || 'Girilmemiş'}`,
            route: `/patients/${p.id}`
          })
        })
      }

      // Add quick actions as secondary suggestions
      quickActions.forEach(action => {
        list.push({
          type: 'action' as const,
          id: action.id,
          title: action.title,
          subtitle: action.subtitle,
          icon: action.icon,
          handler: action.handler
        })
      })

      return list
    }

    const results: SearchResultItem[] = []

    // 2. Search mode
    // A. Active patients search
    const matchedPatients = activePatients.filter(
      p => 
        p.full_name.toLowerCase().includes(trimmed) ||
        (p.phone && p.phone.replace(/\s+/g, '').includes(trimmed)) ||
        (p.tc_no && p.tc_no.includes(trimmed))
    )
    matchedPatients.slice(0, 4).forEach(p => {
      results.push({
        type: 'patient',
        id: `patient-${p.id}`,
        title: p.full_name,
        subtitle: `Kayıtlı Hasta • Tel: ${p.phone || 'Girilmemiş'} • T.C.: ${p.tc_no || 'Girilmemiş'}`,
        route: `/patients/${p.id}`
      })
    })

    // Fallback: If query yields no active patient from DB, search non-anonymous mockPatients
    if (matchedPatients.length === 0) {
      const fallbackMatched = mockPatients.filter(
        p =>
          p.full_name &&
          !isAnonymousOrTest(p.full_name) &&
          (p.full_name.toLowerCase().includes(trimmed) ||
            (p.phone && p.phone.replace(/\s+/g, '').includes(trimmed)) ||
            (p.tc_no && p.tc_no.includes(trimmed)))
      )
      fallbackMatched.slice(0, 3).forEach(p => {
        results.push({
          type: 'patient',
          id: `patient-mock-${p.id}`,
          title: p.full_name,
          subtitle: `Kayıtlı Hasta (Örnek) • Tel: ${p.phone || 'Girilmemiş'} • T.C.: ${p.tc_no || 'Girilmemiş'}`,
          route: `/patients/${p.id}`
        })
      })
    }

    // B. Appointments search
    const matchedAppointments = activeAppointments.filter(
      a => 
        (a.patient?.full_name && a.patient.full_name.toLowerCase().includes(trimmed)) ||
        (a.doctor?.full_name && a.doctor.full_name.toLowerCase().includes(trimmed)) ||
        (a.notes && a.notes.toLowerCase().includes(trimmed))
    )
    matchedAppointments.slice(0, 3).forEach(a => {
      const patientName = a.patient?.full_name || 'Bilinmeyen Hasta'
      const doctorName = a.doctor?.full_name || 'Bilinmeyen Hekim'
      results.push({
        type: 'appointment',
        id: `appointment-${a.id}`,
        title: `${patientName} - Randevu`,
        subtitle: `Randevu • ${a.appointment_date} @ ${a.appointment_time} • ${doctorName} • ${a.status}`,
        route: '/appointments'
      })
    })

    // C. Treatments search
    const matchedTreatments = activeTreatments.filter(
      t =>
        (t.patient?.full_name && t.patient.full_name.toLowerCase().includes(trimmed)) ||
        t.treatment_type.toLowerCase().includes(trimmed) ||
        (t.description && t.description.toLowerCase().includes(trimmed))
    )
    matchedTreatments.slice(0, 3).forEach(t => {
      const patientName = t.patient?.full_name || 'Bilinmeyen Hasta'
      results.push({
        type: 'treatment',
        id: `treatment-${t.id}`,
        title: `${patientName} - ${t.treatment_type}`,
        subtitle: `Tedavi • Diş No: ${t.tooth_number || 'Tümü'} • ${t.description || ''} • ${t.price.toLocaleString('tr-TR')} TL`,
        route: '/treatments'
      })
    })

    // D. Quick actions search
    const matchedActions = quickActions.filter(
      act => 
        act.title.toLowerCase().includes(trimmed) || 
        act.subtitle.toLowerCase().includes(trimmed)
    )
    matchedActions.forEach(action => {
      results.push({
        type: 'action',
        id: action.id,
        title: action.title,
        subtitle: action.subtitle,
        icon: action.icon,
        handler: action.handler
      })
    })

    return results
  }, [query, activePatients, activeAppointments, activeTreatments, quickActions])

  // Keep index in range
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchResults])

  // Key handlers for list navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % searchResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const activeItem = searchResults[selectedIndex]
      if (activeItem) {
        handleItemClick(activeItem)
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleItemClick = (item: SearchResultItem) => {
    if (item.type === 'action') {
      item.handler()
    } else {
      router.push(item.route)
      onOpenChange(false)
    }
  }

  // Helper icons for categories
  const getIcon = (item: SearchResultItem) => {
    switch (item.type) {
      case 'patient':
        return <User className="h-4.5 w-4.5 text-primary" />
      case 'appointment':
        return <Calendar className="h-4.5 w-4.5 text-amber-500" />
      case 'treatment':
        return <Activity className="h-4.5 w-4.5 text-emerald-500" />
      case 'action':
        const IconComponent = item.icon
        return <IconComponent className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Sleek overlay */}
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-all duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        />
        
        {/* Custom wider search popup */}
        <DialogPrimitive.Popup
          className={cn(
            "fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl rounded-2xl border border-border/80 bg-popover shadow-2xl outline-hidden overflow-hidden transition-all duration-200 focus:outline-hidden",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          )}
        >
          {/* Header Input Area */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-muted/20">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hasta adı, T.C., telefon, tedavi veya işlem ara... (Ctrl + K)"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-hidden border-none text-base w-full focus:ring-0 focus:outline-hidden focus:border-none"
            />
            {query && (
              <button 
                onClick={() => setQuery('')} 
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground select-none">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div 
            ref={listRef}
            className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground">Arama sonucu bulunamadı</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                  "{query}" ile eşleşen kayıtlı bir hasta, randevu, tedavi ya da işlem bulunamadı.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {query && (
                  <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
                    Arama Sonuçları ({searchResults.length})
                  </div>
                )}
                
                {!query && (
                  <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
                    Önerilen Hastalar ve Kısayollar
                  </div>
                )}

                {searchResults.map((item, index) => {
                  const isActive = index === selectedIndex
                  return (
                    <button
                      key={item.id}
                      data-active={isActive}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition-all duration-150 group cursor-pointer",
                        isActive 
                          ? "bg-primary/10 border border-primary/20 text-primary shadow-xs" 
                          : "hover:bg-muted border border-transparent text-foreground"
                      )}
                    >
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                        isActive ? "bg-primary/20" : "bg-muted group-hover:bg-background"
                      )}>
                        {getIcon(item)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate leading-none mb-1",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {item.title}
                        </p>
                        <p className={cn(
                          "text-xs truncate leading-none",
                          isActive ? "text-primary/70" : "text-muted-foreground"
                        )}>
                          {item.subtitle}
                        </p>
                      </div>

                      {isActive && (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-primary shrink-0 animate-in fade-in-0 slide-in-from-right-1 duration-150">
                          <span>Git</span>
                          <CornerDownLeft className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer Shortcuts Info */}
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3 text-[11px] text-muted-foreground shrink-0 select-none">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border bg-background px-1 py-0.5 font-sans font-medium text-[9px] shadow-2xs">↑↓</kbd>
                Seç
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-border bg-background px-1 py-0.5 font-sans font-medium text-[9px] shadow-2xs">Enter</kbd>
                Git
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span>DentFlow AI Akıllı Arama</span>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
