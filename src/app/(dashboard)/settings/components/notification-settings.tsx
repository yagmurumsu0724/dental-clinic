'use client'

import { useState, useEffect } from 'react'
import { Save, BellRing, Smartphone, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useNotificationSettings, useUpdateNotificationSettings } from '@/hooks/use-settings'
import type { NotificationSettings } from '@/types/settings'

export function NotificationSettingsTab() {
  const { data: settings, isLoading } = useNotificationSettings()
  const updateMutation = useUpdateNotificationSettings()
  const [formData, setFormData] = useState<Partial<NotificationSettings>>({})

  useEffect(() => {
    if (settings) setFormData(settings)
  }, [settings])

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  const handleToggle = (key: keyof NotificationSettings, checked: boolean) => {
    setFormData(prev => ({ ...prev, [key]: checked }))
  }

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Bildirim Tercihleri</h2>
          <p className="text-sm text-muted-foreground mt-1">Hangi durumlarda haber verileceğini seçin.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2 shadow-sm shadow-primary/20">
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Kaydet
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm max-w-3xl">
        {/* Email & Browser global toggles */}
        <div className="p-6 border-b border-border bg-muted/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">E-posta Bildirimleri</p>
                <p className="text-xs text-muted-foreground">Günlük özetler ve önemli uyarılar</p>
              </div>
            </div>
            <Switch checked={formData.email_notifications} onCheckedChange={(c) => handleToggle('email_notifications', c)} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Tarayıcı Bildirimleri</p>
                <p className="text-xs text-muted-foreground">Anlık aksiyonlar ve hatırlatmalar</p>
              </div>
            </div>
            <Switch checked={formData.browser_notifications} onCheckedChange={(c) => handleToggle('browser_notifications', c)} />
          </div>
        </div>

        {/* Specific Event Toggles */}
        <div className="p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2 mb-2"><BellRing className="h-4 w-4 text-primary" /> Olay Bildirimleri</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Randevu Hatırlatmaları</p>
              <p className="text-xs text-muted-foreground">Randevulara 1 saat kala sistem uyarısı</p>
            </div>
            <Switch checked={formData.appointment_reminders} onCheckedChange={(c) => handleToggle('appointment_reminders', c)} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Ödeme Hatırlatmaları</p>
              <p className="text-xs text-muted-foreground">Gecikmiş ödemeler ve yeni tahsilatlar</p>
            </div>
            <Switch checked={formData.payment_reminders} onCheckedChange={(c) => handleToggle('payment_reminders', c)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Tedavi Süreç Uyarıları</p>
              <p className="text-xs text-muted-foreground">Devam eden uzun süreli tedavilerde uyar</p>
            </div>
            <Switch checked={formData.treatment_alerts} onCheckedChange={(c) => handleToggle('treatment_alerts', c)} />
          </div>
        </div>
      </div>
    </div>
  )
}
