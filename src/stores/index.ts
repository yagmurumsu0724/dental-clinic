import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { UserRole } from '@/types'

// ─── Auth Store ───────────────────────────────────────────────────────────────
type AuthUser = {
  id: string
  full_name: string
  email: string
  role: UserRole
  phone?: string | null
}

type AuthState = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  hasPermission: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }, false, 'setUser'),

      setLoading: (isLoading) =>
        set({ isLoading }, false, 'setLoading'),

      logout: () =>
        set({ user: null, isAuthenticated: false }, false, 'logout'),

      hasPermission: (roles) => {
        const { user } = get()
        if (!user) return false
        return roles.includes(user.role)
      },
    }),
    { name: 'AuthStore' }
  )
)

// ─── UI Store ─────────────────────────────────────────────────────────────────
type UIState = {
  sidebarCollapsed: boolean
  activeModal: string | null
  commandPaletteOpen: boolean
  toggleSidebar: () => void
  openModal: (id: string) => void
  closeModal: () => void
  toggleCommandPalette: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarCollapsed: false,
      activeModal: null,
      commandPaletteOpen: false,

      toggleSidebar: () =>
        set(s => ({ sidebarCollapsed: !s.sidebarCollapsed }), false, 'toggleSidebar'),

      openModal: (id) =>
        set({ activeModal: id }, false, 'openModal'),

      closeModal: () =>
        set({ activeModal: null }, false, 'closeModal'),

      toggleCommandPalette: () =>
        set(s => ({ commandPaletteOpen: !s.commandPaletteOpen }), false, 'toggleCommandPalette'),
    }),
    { name: 'UIStore' }
  )
)

// ─── Patient Selection Store (cross-module) ───────────────────────────────────
type PatientSelectionState = {
  selectedPatientId: string | null
  setSelectedPatient: (id: string | null) => void
}

export const usePatientSelectionStore = create<PatientSelectionState>()(
  devtools(
    (set) => ({
      selectedPatientId: null,
      setSelectedPatient: (id) =>
        set({ selectedPatientId: id }, false, 'setSelectedPatient'),
    }),
    { name: 'PatientSelectionStore' }
  )
)
