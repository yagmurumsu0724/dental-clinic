-- DentFlow AI Supabase Schema - Tam Kapsamlı (Backend Focus)

-- 1. Eklentiler ve Genel Ayarlar
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ortak Fonksiyonlar (Triggers)
-- updated_at alanını otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Audit Log fonksiyonu
CREATE OR REPLACE FUNCTION log_audit_action()
RETURNS TRIGGER AS $$
DECLARE
    action_name TEXT;
    record_id UUID;
    changes_json JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        action_name := 'CREATE';
        record_id := NEW.id;
        changes_json := row_to_json(NEW)::JSONB;
    ELSIF TG_OP = 'UPDATE' THEN
        action_name := 'UPDATE';
        record_id := NEW.id;
        -- Sadece değişen kolonları kaydetmek için (basitleştirilmiş)
        changes_json := jsonb_build_object('old', row_to_json(OLD)::JSONB, 'new', row_to_json(NEW)::JSONB);
    ELSIF TG_OP = 'DELETE' THEN
        action_name := 'DELETE';
        record_id := OLD.id;
        changes_json := row_to_json(OLD)::JSONB;
    END IF;

    -- auth.uid() kullanarak işlemi yapanı bul
    -- Eger auth context'i yoksa (örn: superadmin işlemi), NULL kalır
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, changes)
    VALUES (auth.uid(), action_name, TG_TABLE_NAME, record_id, changes_json);

    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;


-- 3. Tablo Oluşturma

-- Users (Kullanıcılar / Personel)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'Sekreter' CHECK (role IN ('Admin', 'Doktor', 'Sekreter', 'Asistan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Patients (Hastalar)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tc_no TEXT UNIQUE,
  full_name TEXT NOT NULL,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('Erkek', 'Kadın', 'Diğer')),
  phone TEXT,
  email TEXT,
  address TEXT,
  allergies TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Appointments (Randevular)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.users(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'Bekliyor' CHECK (status IN ('Bekliyor', 'Onaylandı', 'Tamamlandı', 'İptal Edildi')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Treatments (Tedaviler)
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.users(id),
  treatment_type TEXT NOT NULL CHECK (treatment_type IN ('Dolgu', 'Kanal Tedavisi', 'İmplant', 'Diş Çekimi', 'Diş Temizliği', 'Kaplama', 'Ortodonti', 'Diğer')),
  tooth_number TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  treatment_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planlandı' CHECK (status IN ('Planlandı', 'Devam Ediyor', 'Tamamlandı', 'İptal')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments (Ödemeler)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES public.treatments(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  remaining_amount DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Nakit', 'Kredi Kartı', 'Banka Havalesi', 'Taksit')),
  payment_status TEXT NOT NULL DEFAULT 'Bekliyor' CHECK (payment_status IN ('Ödendi', 'Bekliyor', 'Kısmi Ödendi')),
  payment_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Uploaded Files (Dosyalar / Röntgen vs.)
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('Röntgen', 'Fotoğraf', 'PDF', 'Diğer')),
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications (Bildirimler)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('Yeni Randevu', 'Yaklaşan Randevu', 'Yeni Tedavi', 'Yeni Ödeme', 'Sistem Uyarısı')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audit Logs (İşlem Geçmişi)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Indeksler (Performans İçin)
CREATE INDEX IF NOT EXISTS idx_patients_tc_no ON public.patients(tc_no);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_treatments_patient ON public.treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON public.payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);


-- 5. Trigger'ların Bağlanması

-- Updated At Triggers
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_treatments_updated_at BEFORE UPDATE ON public.treatments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Audit Log Triggers
CREATE TRIGGER audit_patients AFTER INSERT OR UPDATE OR DELETE ON public.patients FOR EACH ROW EXECUTE PROCEDURE log_audit_action();
CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON public.appointments FOR EACH ROW EXECUTE PROCEDURE log_audit_action();
CREATE TRIGGER audit_treatments AFTER INSERT OR UPDATE OR DELETE ON public.treatments FOR EACH ROW EXECUTE PROCEDURE log_audit_action();
CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON public.payments FOR EACH ROW EXECUTE PROCEDURE log_audit_action();
CREATE TRIGGER audit_files AFTER INSERT OR DELETE ON public.uploaded_files FOR EACH ROW EXECUTE PROCEDURE log_audit_action();

-- Sync Auth Users Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Klinik Kullanıcısı'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'Sekreter')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 6. ROW LEVEL SECURITY (RLS) POLİTİKALARI

-- Aktifleştir
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Rol Kontrol Fonksiyonu (Policy'lerde hızlı kullanım için)
CREATE OR REPLACE FUNCTION auth.get_user_role() RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Users (Herkes kendini görür, Admin herkesi görür/yönetir)
CREATE POLICY "Kullanıcılar kendilerini görebilir" ON public.users FOR SELECT USING (auth.uid() = id OR auth.get_user_role() = 'Admin');
CREATE POLICY "Sadece Adminler kullanıcı ekleyebilir" ON public.users FOR INSERT WITH CHECK (auth.get_user_role() = 'Admin');
CREATE POLICY "Sadece Adminler kullanıcı güncelleyebilir" ON public.users FOR UPDATE USING (auth.get_user_role() = 'Admin');
CREATE POLICY "Sadece Adminler kullanıcı silebilir" ON public.users FOR DELETE USING (auth.get_user_role() = 'Admin');

-- Patients (Tüm personel okuyabilir. Sekreter, Asistan, Admin, Doktor yazabilir. Sadece Admin silebilir)
CREATE POLICY "Personel hastaları görebilir" ON public.patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Personel hasta ekleyebilir" ON public.patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Personel hasta güncelleyebilir" ON public.patients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Sadece Adminler hasta silebilir" ON public.patients FOR DELETE USING (auth.get_user_role() = 'Admin');

-- Appointments (Tüm personel okuyabilir. Sekreter, Asistan, Admin, Doktor oluşturabilir/güncelleyebilir)
CREATE POLICY "Personel randevuları görebilir" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Personel randevu ekleyebilir" ON public.appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Personel randevu güncelleyebilir" ON public.appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Personel randevu silebilir" ON public.appointments FOR DELETE TO authenticated USING (true);

-- Treatments (Tüm personel görebilir. Sadece Doktor ve Admin ekleyebilir/silebilir)
CREATE POLICY "Personel tedavileri görebilir" ON public.treatments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Doktor ve Admin tedavi ekleyebilir" ON public.treatments FOR INSERT WITH CHECK (auth.get_user_role() IN ('Admin', 'Doktor'));
CREATE POLICY "Doktor ve Admin tedavi güncelleyebilir" ON public.treatments FOR UPDATE USING (auth.get_user_role() IN ('Admin', 'Doktor'));
CREATE POLICY "Doktor ve Admin tedavi silebilir" ON public.treatments FOR DELETE USING (auth.get_user_role() IN ('Admin', 'Doktor'));

-- Payments (Tüm personel görebilir. Sekreter, Asistan ve Admin finansal işlem yapabilir)
CREATE POLICY "Personel ödemeleri görebilir" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Sekreter, Asistan, Admin ödeme ekleyebilir" ON public.payments FOR INSERT WITH CHECK (auth.get_user_role() IN ('Admin', 'Sekreter', 'Asistan'));
CREATE POLICY "Sekreter, Asistan, Admin ödeme güncelleyebilir" ON public.payments FOR UPDATE USING (auth.get_user_role() IN ('Admin', 'Sekreter', 'Asistan'));
CREATE POLICY "Sadece Adminler ödeme silebilir" ON public.payments FOR DELETE USING (auth.get_user_role() = 'Admin');

-- Uploaded Files (Herkes görebilir ve yükleyebilir, yükleyen ve admin silebilir)
CREATE POLICY "Personel dosyaları görebilir" ON public.uploaded_files FOR SELECT TO authenticated USING (true);
CREATE POLICY "Personel dosya yükleyebilir" ON public.uploaded_files FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Yükleyen veya Admin silebilir" ON public.uploaded_files FOR DELETE USING (auth.uid() = uploaded_by OR auth.get_user_role() = 'Admin');

-- Notifications (Sadece kendine ait olanları görebilir/güncelleyebilir/silebilir)
CREATE POLICY "Sadece kendi bildirimlerini görebilir" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Kendi bildirimini güncelleyebilir" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Kendi bildirimini silebilir" ON public.notifications FOR DELETE USING (user_id = auth.uid());
-- Sistem/Servisler bildirim ekleyeceği için INSERT serbest bırakıldı, ancak user_id doğrulaması backend'de yapılacak.
CREATE POLICY "Bildirim eklenebilir" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Audit Logs (Sadece Admin görebilir, kimse insert/update/delete yapamaz - trigger hariç)
CREATE POLICY "Sadece Adminler logları görebilir" ON public.audit_logs FOR SELECT USING (auth.get_user_role() = 'Admin');
-- Audit loglarına kimse müdahale edemez.
