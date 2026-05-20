import { createClient } from '@/lib/supabase/client';
import type { Patient } from '@/types/patient';

/**
 * Fetches all patients from the database, sorted by created_at descending.
 * @returns A list of patient records.
 */
export async function getPatients(): Promise<Patient[]> {
  try {
    const supabase = createClient();
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Hastalar getirilirken bir hata oluştu: ' + error.message);
    }

    return (patients || []) as Patient[];
  } catch (error: any) {
    throw new Error(error.message || 'Hastalar listelenirken bir hata oluştu.');
  }
}
