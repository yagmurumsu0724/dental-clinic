'use client'

import { useState, useEffect } from 'react'
import { Database, Server, Clock, HardDrive, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SystemSettingsTab() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate system health check
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Sistem Durumu</h2>
          <p className="text-sm text-muted-foreground mt-1">Altyapı sağlığı ve veritabanı istatistikleri.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Veritabanı', value: 'Çevrimiçi', icon: Database, status: 'good' },
          { label: 'Sunucu', value: 'Bağlı', icon: Server, status: 'good' },
          { label: 'Depolama', value: '%12 Dolu', icon: HardDrive, status: 'warn' },
          { label: 'Gecikme (Ping)', value: '24ms', icon: Clock, status: 'good' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${s.status === 'good' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {s.status === 'good' ? <CheckCircle2 className="h-4 w-4 text-emerald-600 ml-auto" /> : <AlertTriangle className="h-4 w-4 text-amber-600 ml-auto" />}
              </div>
              <p className="text-2xl font-bold text-foreground">{loading ? '...' : s.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mt-2">
        <h3 className="font-semibold text-foreground mb-4">Sistem Sürüm Bilgileri</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">DentFlow AI Version</span>
            <span className="text-sm font-medium">v1.2.4-prod</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Ortam (Environment)</span>
            <span className="text-sm font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-md">Production</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Supabase Bağlantısı</span>
            <span className="text-sm font-medium flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500"/> Bağlantı Kuruldu</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-muted-foreground">Son Veritabanı Yedeği</span>
            <span className="text-sm font-medium">Bugün, 04:00 (Otomatik)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
