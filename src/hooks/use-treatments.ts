// ─── Custom Hooks: Treatments ─────────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { treatmentsApi } from '@/services/treatment.service'
import { queryKeys } from '@/lib/query-keys'
import { toast } from 'sonner'
import type { Treatment } from '@/types'
import type { TreatmentFormValues } from '@/lib/validations'

export function useTreatments(patientId?: string) {
  return useQuery({
    queryKey: queryKeys.treatments.list(patientId),
    queryFn: () => treatmentsApi.list(patientId),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateTreatment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TreatmentFormValues) =>
      treatmentsApi.create(data),
    onSuccess: (t) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.treatments.lists() })
      toast.success('Tedavi kaydedildi', { description: `${t.treatment_type} · ₺${t.price.toLocaleString('tr-TR')}` })
    },
    onError: (error: Error) => {
      toast.error('Tedavi kaydedilemedi', { description: error.message })
    },
  })
}
