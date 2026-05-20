import { createClient } from '@/lib/supabase/client';

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalTreatments: number;
  monthlyRevenue: number;
  pendingPayments: number;
  dailyAppointments: number;
  completedTreatments: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  // Parallel fetches for speed
  const [
    { count: patientsCount, error: err1 },
    { count: appointmentsCount, error: err2 },
    { count: treatmentsCount, error: err3 },
    { count: dailyApptCount, error: err4 },
    { count: completedTreatments, error: err5 },
    { data: monthlyPayments, error: err6 },
    { data: pendingPaymentsData, error: err7 }
  ] = await Promise.all([
    supabase.from('patients').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('treatments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today),
    supabase.from('treatments').select('*', { count: 'exact', head: true }).eq('status', 'Tamamlandı'),
    supabase.from('payments').select('paid_amount').gte('payment_date', startOfMonth),
    supabase.from('payments').select('remaining_amount').gt('remaining_amount', 0),
  ]);

  if (err1 || err2 || err3 || err4 || err5 || err6 || err7) {
    console.error("Dashboard Stats Fetch Error", { err1, err2, err3, err4, err5, err6, err7 });
    throw new Error("Dashboard istatistikleri alınırken bir hata oluştu.");
  }

  const monthlyRevenue = (monthlyPayments || []).reduce((acc, curr) => acc + (curr.paid_amount || 0), 0);
  const pendingPayments = (pendingPaymentsData || []).reduce((acc, curr) => acc + (curr.remaining_amount || 0), 0);

  return {
    totalPatients: patientsCount || 0,
    totalAppointments: appointmentsCount || 0,
    totalTreatments: treatmentsCount || 0,
    monthlyRevenue,
    pendingPayments,
    dailyAppointments: dailyApptCount || 0,
    completedTreatments: completedTreatments || 0,
  };
}
