import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { paymentsApi } from '@/services/payment.service'
import type { PaymentFormValues } from '@/lib/validations'
import { toast } from 'sonner'

export function usePayments(patientId?: string) {
  return useQuery({
    queryKey: queryKeys.payments.list(patientId),
    queryFn: () => paymentsApi.list(patientId),
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: PaymentFormValues) => paymentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() })
      toast.success('Ödeme başarıyla eklendi.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentFormValues> }) => 
      paymentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() })
      toast.success('Ödeme başarıyla güncellendi.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => paymentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() })
      toast.success('Ödeme kaydı silindi.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}
