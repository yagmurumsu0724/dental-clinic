'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, Check, Trash2, CheckCircle2, UserPlus, Calendar, CreditCard, 
  AlertTriangle, FileText, Stethoscope, Mail, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead, 
  useDeleteNotification 
} from '@/hooks/use-notifications'
import type { NotificationType, Notification } from '@/types'
import Link from 'next/link'

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'Yeni Hasta': return <UserPlus className="h-5 w-5 text-blue-500" />
    case 'Yeni Randevu': 
    case 'Yaklaşan Randevu': 
    case 'İptal Edilen Randevu': return <Calendar className="h-5 w-5 text-indigo-500" />
    case 'Yeni Tedavi': return <Stethoscope className="h-5 w-5 text-emerald-500" />
    case 'Yeni Ödeme': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    case 'Eksik Ödeme': return <CreditCard className="h-5 w-5 text-amber-500" />
    case 'Dosya Yüklendi': return <FileText className="h-5 w-5 text-blue-500" />
    case 'Sistem Uyarısı': return <AlertTriangle className="h-5 w-5 text-red-500" />
    case 'Doktor Bildirimi': return <Mail className="h-5 w-5 text-purple-500" />
    default: return <Info className="h-5 w-5 text-slate-500" />
  }
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const { data: notifications = [], isLoading } = useNotifications()
  const markAsRead = useMarkNotificationAsRead()
  const markAllAsRead = useMarkAllNotificationsAsRead()
  const deleteNotif = useDeleteNotification()

  const displayedNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.is_read)

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Bildirimler
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Klinik süreçleri ve sistem uyarıları</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.is_read) && (
            <Button variant="outline" size="sm" onClick={() => markAllAsRead.mutate()} disabled={markAllAsRead.isPending}>
              <Check className="h-4 w-4 mr-1.5" />
              Tümünü Okundu İşaretle
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Tümü
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${filter === 'unread' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Okunmamış
          {notifications.filter(n => !n.is_read).length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
              {notifications.filter(n => !n.is_read).length}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl border border-border bg-card animate-pulse">
              <div className="h-10 w-10 bg-muted rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))
        ) : displayedNotifications.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
            <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">Bildirim Yok</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === 'unread' ? 'Okunmamış bildiriminiz bulunmuyor.' : 'Henüz herhangi bir bildirim almadınız.'}
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`group relative flex gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                notif.is_read 
                  ? 'border-border bg-card' 
                  : 'border-primary/20 bg-primary/5 shadow-sm'
              }`}
            >
              {!notif.is_read && (
                <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-primary" />
              )}
              
              <div className="shrink-0 mt-1">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  notif.is_read ? 'bg-muted' : 'bg-background shadow-sm border border-border/50'
                }`}>
                  {getNotificationIcon(notif.notification_type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                  <h3 className={`text-sm font-semibold truncate ${notif.is_read ? 'text-foreground/80' : 'text-foreground'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: tr })}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${notif.is_read ? 'text-muted-foreground' : 'text-foreground/90'}`}>
                  {notif.message}
                </p>
                {notif.link && (
                  <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-primary" asChild>
                    <Link href={notif.link}>Detayları Gör →</Link>
                  </Button>
                )}
              </div>

              {/* Actions Overlay */}
              <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-lg p-1 border border-border/50 shadow-sm">
                {!notif.is_read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" 
                    onClick={() => markAsRead.mutate(notif.id)}
                    title="Okundu İşaretle"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteNotif.mutate(notif.id)}
                  title="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
