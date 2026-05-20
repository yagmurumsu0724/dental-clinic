-- DentFlow AI Örnek Veri (Seed Data)
-- UYARI: Bu dosyayı çalıştırmadan önce sistemde (Authentication üzerinden) en az 1 tane Doktor rolünde kullanıcı oluşturduğunuzdan emin olun.
-- Aksi takdirde appointments ve treatments tablolarında "doctor_id" bulunamadığı için hata verecektir.

DO $$
DECLARE
    v_doctor_id UUID;
    v_patient1_id UUID;
    v_patient2_id UUID;
    v_treatment1_id UUID;
    v_treatment2_id UUID;
BEGIN
    -- Sistemdeki ilk doktoru bul (Eğer yoksa admini bul)
    SELECT id INTO v_doctor_id FROM public.users WHERE role = 'Doktor' LIMIT 1;
    IF v_doctor_id IS NULL THEN
        SELECT id INTO v_doctor_id FROM public.users LIMIT 1;
    END IF;

    -- Eğer hala kullanıcı yoksa işlemi iptal et
    IF v_doctor_id IS NULL THEN
        RAISE EXCEPTION 'Sistemde hiç kullanıcı yok. Lütfen önce Authentication kısmından bir kullanıcı ekleyin.';
    END IF;

    -- 1. Hastaları Ekle
    INSERT INTO public.patients (tc_no, full_name, birth_date, gender, phone, email, allergies, notes)
    VALUES 
        ('12345678901', 'Ahmet Yılmaz', '1985-04-23', 'Erkek', '05551234567', 'ahmet.yilmaz@example.com', 'Penisilin', 'Tansiyon hastası, randevularda dikkatli olunmalı.'),
        ('98765432109', 'Ayşe Demir', '1992-11-05', 'Kadın', '05329876543', 'ayse.demir@example.com', NULL, 'İlk muayene.')
    RETURNING id INTO v_patient1_id;

    -- Sadece v_patient1_id'yi RETURNING ile alabildiğim için, 2. hastayı manuel seçiyorum:
    SELECT id INTO v_patient2_id FROM public.patients WHERE tc_no = '98765432109';

    -- 2. Randevuları Ekle
    INSERT INTO public.appointments (patient_id, doctor_id, appointment_date, appointment_time, status, notes)
    VALUES
        (v_patient1_id, v_doctor_id, CURRENT_DATE, '10:00', 'Onaylandı', 'Kanal tedavisi kontrolü'),
        (v_patient2_id, v_doctor_id, CURRENT_DATE + INTERVAL '1 day', '14:30', 'Bekliyor', 'Genel muayene ve diş taşı temizliği');

    -- 3. Tedavileri Ekle
    INSERT INTO public.treatments (patient_id, doctor_id, treatment_type, tooth_number, description, price, treatment_date, status)
    VALUES
        (v_patient1_id, v_doctor_id, 'Kanal Tedavisi', '46', 'Alt sağ 1. büyük azı kanal tedavisi 1. seans', 2500.00, CURRENT_DATE, 'Devam Ediyor')
    RETURNING id INTO v_treatment1_id;

    INSERT INTO public.treatments (patient_id, doctor_id, treatment_type, tooth_number, description, price, treatment_date, status)
    VALUES
        (v_patient2_id, v_doctor_id, 'Diş Temizliği', 'Tüm Ağız', 'Detartraj ve polisaj işlemi', 1000.00, CURRENT_DATE - INTERVAL '5 days', 'Tamamlandı')
    RETURNING id INTO v_treatment2_id;

    -- 4. Ödemeleri Ekle
    INSERT INTO public.payments (patient_id, treatment_id, total_amount, paid_amount, payment_method, payment_status, payment_date)
    VALUES
        (v_patient1_id, v_treatment1_id, 2500.00, 1000.00, 'Kredi Kartı', 'Kısmi Ödendi', CURRENT_DATE),
        (v_patient2_id, v_treatment2_id, 1000.00, 1000.00, 'Nakit', 'Ödendi', CURRENT_DATE - INTERVAL '5 days');

END $$;
