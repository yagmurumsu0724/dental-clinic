'use client'

import { useState, useEffect } from 'react'
import { Save, Building2, Phone, MapPin, Globe, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClinicSettings, useUpdateClinicSettings } from '@/hooks/use-settings'
import type { ClinicSettings } from '@/types/settings'

export function ClinicSettingsTab() {
  const { data: settings, isLoading } = useClinicSettings()
  const updateMutation = useUpdateClinicSettings()
  const [formData, setFormData] = useState<Partial<ClinicSettings>>({})

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  const handleChange = (key: keyof ClinicSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Klinik Profili</h2>
          <p className="text-sm text-muted-foreground mt-1">Hastalarınızın göreceği temel klinik bilgileri.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2 shadow-sm shadow-primary/20">
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Kaydet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Temel Bilgiler</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Klinik Adı</label>
            <Input value={formData.clinic_name || ''} onChange={e => handleChange('clinic_name', e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefon</label>
            <Input value={formData.clinic_phone || ''} onChange={e => handleChange('clinic_phone', e.target.value)} placeholder="+90 555 555 5555" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">E-posta</label>
            <Input value={formData.clinic_email || ''} onChange={e => handleChange('clinic_email', e.target.value)} type="email" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Adres</label>
            <Input value={formData.clinic_address || ''} onChange={e => handleChange('clinic_address', e.target.value)} />
          </div>
        </div>

        {/* Operational Settings */}
        <div className="space-y-4 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Operasyonel</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mesai Başlangıç</label>
              <Input type="time" value={formData.working_hours_start || ''} onChange={e => handleChange('working_hours_start', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mesai Bitiş</label>
              <Input type="time" value={formData.working_hours_end || ''} onChange={e => handleChange('working_hours_end', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Randevu Süresi (dk)</label>
            <Select value={String(formData.appointment_duration || 30)} onValueChange={v => v && handleChange('appointment_duration', parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 Dakika</SelectItem>
                <SelectItem value="30">30 Dakika</SelectItem>
                <SelectItem value="45">45 Dakika</SelectItem>
                <SelectItem value="60">60 Dakika</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Para Birimi</label>
              <Select value={formData.currency || 'TRY'} onValueChange={v => v && handleChange('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                  <SelectItem value="USD">Dolar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Saat Dilimi</label>
              <Input value={formData.timezone || ''} disabled className="bg-muted/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
