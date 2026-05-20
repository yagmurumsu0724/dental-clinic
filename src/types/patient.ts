export type Gender = 'Erkek' | 'Kadın' | 'Diğer';

export interface Patient {
  id: string;
  full_name: string;
  tc_no: string | null;
  phone: string | null;
  email: string | null;
  birth_date: string | null;
  gender: Gender | null;
  address: string | null;
  allergies: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientInput {
  full_name: string;
  tc_no?: string | null;
  phone?: string | null;
  email?: string | null;
  birth_date?: string | null;
  gender?: Gender | null;
  address?: string | null;
  allergies?: string | null;
  notes?: string | null;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {}
