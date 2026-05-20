import { createClient } from '@/lib/supabase/client';
import type { Patient, CreatePatientInput } from '@/types/patient';

/**
 * Creates a new patient in the database.
 * @param data - The patient data to insert.
 * @returns The created patient record.
 */
export async function createPatient(data: CreatePatientInput): Promise<Patient> {
  try {
    // Validate required fields
    if (!data.full_name) {
      throw new Error('Ad Soyad alanı zorunludur.');
    }

    const supabase = createClient();
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([
        {
          full_name: data.full_name,
          tc_no: data.tc_no,
          phone: data.phone,
          email: data.email,
          birth_date: data.birth_date,
          gender: data.gender,
          address: data.address,
          allergies: data.allergies,
          notes: data.notes,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        throw new Error('Bu TC Kimlik numarasıyla kayıtlı bir hasta zaten var.');
      }
      throw new Error('Hasta oluşturulurken bir hata oluştu: ' + error.message);
    }

    if (!patient) {
      throw new Error('Hasta oluşturuldu ancak veri alınamadı.');
    }

    return patient as Patient;
  } catch (error: any) {
    throw new Error(error.message || 'Bilinmeyen bir hata oluştu.');
  }
}
