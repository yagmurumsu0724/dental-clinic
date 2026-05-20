'use client'

import { useState } from 'react'
import { Bell, Search, Plus, Command, UserPlus, Calendar, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu'
import { useQuickActionStore } from '@/stores/quick-action-store'
import { useUnreadNotificationCount } from '@/hooks/use-notifications'
import { SearchCommandPalette } from './search-command-palette'
import Link from 'next/link'

export function Header() {
  const { openPatientForm, openAppointmentForm } = useQuickActionStore()
  const { data: unreadCount = 0 } = useUnreadNotificationCount()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 gap-4">
      {/* Search bar */}
      <div className="flex flex-1 items-center gap-2 max-w-md">
        <button 
          onClick={() => setSearchOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:border-border/80 transition-all group cursor-pointer focus:outline-hidden"
        >
          <Search className="h-4 w-4 shrink-0 group-hover:text-foreground transition-colors" />
          <span className="flex-1 text-left">Hasta, randevu, tedavi ara...</span>
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 shadow-sm shadow-primary/20 hidden sm:flex cursor-pointer">
              <Plus className="h-3.5 w-3.5" />
              Hızlı Ekle
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={openPatientForm} className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Yeni Hasta</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openAppointmentForm} className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Yeni Randevu</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted" asChild>
          <Link href="/notifications">
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        </Button>

        {/* User avatar with interactive dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl pl-1 pr-3 py-1 hover:bg-muted transition-colors cursor-pointer focus:outline-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                AY
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground leading-tight">Dr. Ahmet Yılmaz</span>
                <span className="text-[11px] text-muted-foreground">Admin</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1 p-1">
            <div className="px-2.5 py-2 text-xs font-normal text-muted-foreground">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">Dr. Ahmet Yılmaz</p>
                <p className="text-xs leading-none text-muted-foreground mt-0.5">ahmet.yilmaz@dentflow.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/settings" />} className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Profil Bilgileri</span>
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Klinik Ayarları</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Global Search command palette */}
      <SearchCommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}

