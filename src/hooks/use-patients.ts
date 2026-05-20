// ─── Custom Hooks: Patients ───────────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as patientService from '@/services/patients'
import { queryKeys } from '@/lib/query-keys'
import { toast } from 'sonner'
import type { Patient, CreatePatientInput, UpdatePatientInput } from '@/types/patient'

export function usePatients() {
  return useQuery({
    queryKey: queryKeys.patients.all(),
    queryFn: patientService.getPatients,
  })
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id),
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id,
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreatePatientInput) => patientService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all() })
      toast.success('Hasta başarıyla kaydedildi')
    },
    onError: (error: Error) => {
      toast.error('Hasta kaydedilemedi', { description: error.message })
    }
  })
}

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdatePatientInput) => patientService.updatePatient(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.detail(data.id) })
      toast.success('Hasta bilgileri güncellendi')
    },
    onError: (error: Error) => {
      toast.error('Hasta güncellenemedi', { description: error.message })
    }
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all() })
      toast.success('Hasta kaydı silindi')
    },
    onError: (error: Error) => {
      toast.error('Silme işlemi başarısız', { description: error.message })
    },
  })
}
