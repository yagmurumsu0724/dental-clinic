import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { filesApi } from '@/services/file.service'
import type { FileType } from '@/types'
import { toast } from 'sonner'

export function useFiles(patientId?: string) {
  return useQuery({
    queryKey: queryKeys.files.list(patientId),
    queryFn: () => filesApi.list(patientId),
  })
}

export function useUploadFile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, patientId, category }: { file: File, patientId: string, category: FileType }) => 
      filesApi.upload(file, patientId, category),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all() })
      toast.success('Dosya başarıyla yüklendi.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, fileUrl }: { id: string, fileUrl: string }) => filesApi.delete(id, fileUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all() })
      toast.success('Dosya silindi.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })
}
