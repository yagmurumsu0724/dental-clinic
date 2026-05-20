import { createClient } from '@/lib/supabase/client'
import type { UploadedFile, FileType } from '@/types'

export const filesApi = {
  async list(patientId?: string): Promise<UploadedFile[]> {
    const supabase = createClient()
    let query = supabase.from('uploaded_files').select('*, patient:patients(id, full_name)')

    if (patientId) {
      query = query.eq('patient_id', patientId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw new Error(`Dosyalar getirilemedi: ${error.message}`)
    return data as UploadedFile[]
  },

  async upload(file: File, patientId: string, category: FileType): Promise<UploadedFile> {
    const supabase = createClient()
    
    // Yükleme sırasında dosya adını unique yapalım
    const ext = file.name.split('.').pop()
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const path = `patients/${patientId}/${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('clinic_files')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      throw new Error(`Dosya depolama alanına yüklenemedi: ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('clinic_files')
      .getPublicUrl(path)

    const { data: dbFile, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        patient_id: patientId,
        file_name: file.name,
        file_url: publicUrlData.publicUrl,
        file_type: category,
      })
      .select('*, patient:patients(id, full_name)')
      .single()

    if (dbError) {
      // Rollback file upload if DB insert fails
      await supabase.storage.from('clinic_files').remove([path])
      throw new Error(`Dosya kaydı veritabanına eklenemedi: ${dbError.message}`)
    }

    return dbFile as UploadedFile
  },

  async delete(id: string, fileUrl: string): Promise<void> {
    const supabase = createClient()
    
    // URL'den dosya yolunu çıkar: .../storage/v1/object/public/clinic_files/patients/...
    const pathParts = fileUrl.split('/clinic_files/')
    if (pathParts.length === 2) {
      const storagePath = pathParts[1]
      await supabase.storage.from('clinic_files').remove([storagePath])
    }

    const { error } = await supabase.from('uploaded_files').delete().eq('id', id)
    if (error) throw new Error(`Dosya silinemedi: ${error.message}`)
  }
}
