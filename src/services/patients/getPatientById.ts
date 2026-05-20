import { createClient } from '@/lib/supabase/client';
import type { Patient } from '@/types/patient';

/**
 * Fetches a single patient by ID.
 * @param id - The UUID of the patient.
 * @returns The patient record or throws an error if not found.
 */
export async function getPatientById(id: string): Promise<Patient> {
  try {
    const supabase = createClient();
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        throw new Error('Hasta bulunamadı.');
      }
      throw new Error('Hasta detayı getirilirken bir hata oluştu: ' + error.message);
    }

    if (!patient) {
      throw new Error('Hasta bulunamadı.');
    }

    return patient as Patient;
  } catch (error: any) {
    throw new Error(error.message || 'Hasta bilgisi alınırken bir hata oluştu.');
  }
}
