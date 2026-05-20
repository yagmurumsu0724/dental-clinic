'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, Building, User, Bell, ShieldCheck, Monitor, Database } from 'lucide-react'
import { ClinicSettingsTab } from './components/clinic-settings'
import { UserSettingsTab } from './components/user-settings'
import { NotificationSettingsTab } from './components/notification-settings'
import { SecuritySettingsTab } from './components/security-settings'
import { SystemSettingsTab } from './components/system-settings'

const SETTINGS_TABS = [
  { id: 'clinic', label: 'Klinik Ayarları', icon: Building },
  { id: 'user', label: 'Kullanıcı Ayarları', icon: User },
  { id: 'notifications', label: 'Bildirimler', icon: Bell },
  { id: 'security', label: 'Güvenlik', icon: ShieldCheck },
  { id: 'system', label: 'Sistem', icon: Database },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('clinic')

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-screen-2xl mx-auto pb-10">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Ayarlar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sistem ve klinik konfigürasyonları</p>
        </div>

        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-left ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : ''}`} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {activeTab === 'clinic' && <ClinicSettingsTab />}
            {activeTab === 'user' && <UserSettingsTab />}
            {activeTab === 'notifications' && <NotificationSettingsTab />}
            {activeTab === 'security' && <SecuritySettingsTab />}
            {activeTab === 'system' && <SystemSettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}
