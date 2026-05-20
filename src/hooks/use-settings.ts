import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { toast } from 'sonner'
import {
  getClinicSettings, updateClinicSettings,
  getUserSettings, updateUserSettings,
  getNotificationSettings, updateNotificationSettings,
  getSecuritySettings, updateSecuritySettings,
  updatePassword
} from '@/services/settings'
import type { ClinicSettings, UserSettings, NotificationSettings, SecuritySettings } from '@/types/settings'

export function useClinicSettings() {
  return useQuery({
    queryKey: queryKeys.settings.clinic(),
    queryFn: () => getClinicSettings(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateClinicSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ClinicSettings>) => updateClinicSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.clinic() })
      toast.success('Klinik ayarları güncellendi.')
    },
    onError: (err: Error) => toast.error(err.message)
  })
}

export function useUserSettings() {
  return useQuery({
    queryKey: queryKeys.settings.user(),
    queryFn: () => getUserSettings(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<UserSettings>) => updateUserSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.user() })
      toast.success('Kullanıcı ayarları güncellendi.')
    },
    onError: (err: Error) => toast.error(err.message)
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: queryKeys.settings.notification(),
    queryFn: () => getNotificationSettings(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.notification() })
      toast.success('Bildirim tercihleri güncellendi.')
    },
    onError: (err: Error) => toast.error(err.message)
  })
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: queryKeys.settings.security(),
    queryFn: () => getSecuritySettings(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SecuritySettings>) => updateSecuritySettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.security() })
      toast.success('Güvenlik ayarları güncellendi.')
    },
    onError: (err: Error) => toast.error(err.message)
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: string) => updatePassword(password),
    onSuccess: () => toast.success('Şifreniz başarıyla değiştirildi.'),
    onError: (err: Error) => toast.error(err.message)
  })
}
