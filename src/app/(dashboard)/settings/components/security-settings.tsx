'use client'

import { useState } from 'react'
import { Save, ShieldAlert, KeyRound, Smartphone, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useSecuritySettings, useUpdateSecuritySettings, useUpdatePassword } from '@/hooks/use-settings'
import { toast } from 'sonner'
import type { SecuritySettings } from '@/types/settings'

export function SecuritySettingsTab() {
  const { data: settings, isLoading } = useSecuritySettings()
  const updateMutation = useUpdateSecuritySettings()
  const passwordMutation = useUpdatePassword()
  
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)

  // Use local state immediately synced with settings initially to avoid jumpiness on toggle.
  const handleToggle2FA = (checked: boolean) => {
    setTwoFactor(checked)
    updateMutation.mutate({ two_factor_enabled: checked })
  }

  const handlePasswordSubmit = () => {
    if (password !== passwordConfirm) {
      toast.error('Şifreler eşleşmiyor.')
      return
    }
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır.')
      return
    }
    passwordMutation.mutate(password, {
      onSuccess: () => {
        setPassword('')
        setPasswordConfirm('')
      }
    })
  }

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Güvenlik ve Erişim</h2>
          <p className="text-sm text-muted-foreground mt-1">Hesap koruması ve oturum yönetimi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Password Change */}
        <div className="space-y-6 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2"><KeyRound className="h-4 w-4 text-primary" /> Şifre Değiştir</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Yeni Şifre</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Yeni Şifre (Tekrar)</label>
              <Input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
            </div>
            <Button onClick={handlePasswordSubmit} disabled={passwordMutation.isPending || !password} className="w-full">
              {passwordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Şifreyi Güncelle
            </Button>
          </div>
        </div>

        {/* 2FA and Sessions */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><ShieldAlert className="h-4 w-4 text-primary" /> İki Faktörlü Doğrulama (2FA)</h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">2FA Koruması</p>
                <p className="text-xs text-muted-foreground mt-0.5">Giriş yaparken telefonunuza kod gönderilir.</p>
              </div>
              <Switch checked={settings?.two_factor_enabled || twoFactor} onCheckedChange={handleToggle2FA} />
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Smartphone className="h-4 w-4 text-primary" /> Aktif Oturumlar</h3>
            <p className="text-sm text-muted-foreground mb-4">Şu anda 1 cihazda oturumunuz açık görünüyor.</p>
            <Button variant="destructive" className="w-full gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 shadow-none">
              <LogOut className="h-4 w-4" />
              Diğer Tüm Cihazlardan Çıkış Yap
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
