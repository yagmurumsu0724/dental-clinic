import { createClient } from '@/lib/supabase/client';
import type { Patient, UpdatePatientInput } from '@/types/patient';

/**
 * Updates an existing patient record.
 * @param id - The UUID of the patient to update.
 * @param data - The data to update.
 * @returns The updated patient record.
 */
export async function updatePatient(id: string, data: UpdatePatientInput): Promise<Patient> {
  try {
    const supabase = createClient();
    const { data: patient, error } = await supabase
      .from('patients')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Hasta güncellenirken bir hata oluştu: ' + error.message);
    }

    if (!patient) {
      throw new Error('Hasta bulunamadı veya güncellenemedi.');
    }

    return patient as Patient;
  } catch (error: any) {
    throw new Error(error.message || 'Hasta güncellenirken bir hata oluştu.');
  }
}
