// ─── Custom Hooks: Appointments ───────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '@/services/appointment.service'
import { queryKeys } from '@/lib/query-keys'
import { toast } from 'sonner'
import type { Appointment } from '@/types'
import type { AppointmentFormValues } from '@/lib/validations'

export function useAppointments(filters?: { doctorId?: string; date?: string; patientId?: string }) {
  return useQuery({
    queryKey: queryKeys.appointments.list(filters),
    queryFn: () => appointmentsApi.list(filters),
    staleTime: 1000 * 30, // 30 saniye (randevular sık değişir)
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AppointmentFormValues) =>
      appointmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Randevu oluşturuldu')
    },
    onError: (error: Error) => {
      toast.error('Randevu oluşturulamadı', { description: error.message })
    },
  })
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment['status'] }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Randevu durumu güncellendi')
    },
    onError: (error: Error) => {
      toast.error('Güncelleme başarısız', { description: error.message })
    },
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Randevu iptal edildi')
    },
    onError: (error: Error) => {
      toast.error('İşlem başarısız', { description: error.message })
    },
  })
}
