'use client'

import { useState, useEffect } from 'react'
import { Save, User, Globe, Palette, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserSettings, useUpdateUserSettings } from '@/hooks/use-settings'
import type { UserSettings } from '@/types/settings'
import { toast } from 'sonner'

export function UserSettingsTab() {
  const { data: settings, isLoading } = useUserSettings()
  const updateMutation = useUpdateUserSettings()
  const [formData, setFormData] = useState<Partial<UserSettings>>({})

  useEffect(() => {
    if (settings) setFormData(settings)
  }, [settings])

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  const handleChange = (key: keyof UserSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kişisel Ayarlar</h2>
          <p className="text-sm text-muted-foreground mt-1">Arayüz tercihleri ve kişisel bilgileriniz.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2 shadow-sm shadow-primary/20">
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Kaydet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Arayüz Tercihleri</h3>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Tema</label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleChange('theme_preference', theme)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    formData.theme_preference === theme 
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30' 
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {theme === 'light' ? 'Açık' : theme === 'dark' ? 'Koyu' : 'Sistem'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dil Seçenekleri</label>
            <Select value={formData.language || 'tr-TR'} onValueChange={v => handleChange('language', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tr-TR">Türkçe</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="de-DE">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-6 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Profil Özelleştirme</h3>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted border-2 border-border border-dashed flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Profil Fotoğrafı</p>
              <p className="text-xs text-muted-foreground mt-1 mb-2">JPG, GIF veya PNG. Max 2MB.</p>
              <Button size="sm" variant="outline" onClick={() => toast.info('Fotoğraf yükleme yakında eklenecek.')}>Dosya Seç</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
