import { createClient } from '@/lib/supabase/client';

/**
 * Deletes a patient record from the database.
 * @param id - The UUID of the patient to delete.
 */
export async function deletePatient(id: string): Promise<void> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      // Check for relational errors (e.g. patient has appointments)
      if (error.code === '23503') {
        throw new Error('Bu hastaya ait randevu veya tedavi kayıtları bulunduğu için silinemez.');
      }
      throw new Error('Hasta silinirken bir hata oluştu: ' + error.message);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Hasta silinirken bir hata oluştu.');
  }
}
