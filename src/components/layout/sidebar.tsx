'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  CreditCard,
  Settings,
  LogOut,
  Activity as LogoIcon,
  ChevronRight,
  Bell,
  FileText,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/(auth)/actions'

const navigation = [
  {
    group: 'Klinik & Operasyon',
    items: [
      { name: 'Genel Bakış', href: '/', icon: LayoutDashboard },
      { name: 'Hastalar', href: '/patients', icon: Users },
      { name: 'Randevular', href: '/appointments', icon: Calendar },
      { name: 'Tedaviler', href: '/treatments', icon: Activity },
      { name: 'Dosyalar', href: '/files', icon: FileText },
      { name: 'Bildirimler', href: '/notifications', icon: Bell },
    ],
  },
  {
    group: 'Yönetim & Analiz',
    items: [
      { name: 'Finans', href: '/finance', icon: CreditCard },
      { name: 'Raporlar', href: '/reports', icon: BarChart3 },
      { name: 'Ayarlar', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30">
          <LogoIcon className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-sidebar-foreground leading-tight">DentFlow AI</span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Klinik Sistemi</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-hide px-3 py-4">
        {navigation.map((section) => (
          <div key={section.group} className="mb-4">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/60" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 mb-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
            AY
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">Dr. Ahmet Yılmaz</span>
            <span className="text-xs text-muted-foreground">Admin · Başhekim</span>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors">
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  )
}
