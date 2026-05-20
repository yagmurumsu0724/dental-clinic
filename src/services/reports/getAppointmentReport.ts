import { createClient } from '@/lib/supabase/client';

export interface AppointmentReportData {
  completed: number;
  cancelled: number;
  waiting: number;
  doctorWorkload: { doctorName: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
  completionRate: number;
}

export async function getAppointmentReport(startDate: string, endDate: string): Promise<AppointmentReportData> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*, doctor:users!doctor_id(id, full_name)')
    .gte('appointment_date', startDate)
    .lte('appointment_date', endDate);
    
  if (error) throw new Error(`Randevu raporu alınamadı: ${error.message}`);
  
  const appts = data || [];
  
  let completed = 0, cancelled = 0, waiting = 0;
  const workloadMap = new Map<string, number>();
  const trendMap = new Map<string, number>();
  
  appts.forEach(a => {
    if (a.status === 'Tamamlandı') completed++;
    else if (a.status === 'İptal Edildi') cancelled++;
    else waiting++;
    
    // Workload
    // Note: Assuming the joined doctor is returned as an array or object. Let's handle both.
    const docObj = Array.isArray(a.doctor) ? a.doctor[0] : a.doctor;
    const docName = docObj?.full_name || 'Bilinmiyor';
    workloadMap.set(docName, (workloadMap.get(docName) || 0) + 1);
    
    // Trend
    const date = a.appointment_date;
    trendMap.set(date, (trendMap.get(date) || 0) + 1);
  });
  
  const doctorWorkload = Array.from(workloadMap.entries()).map(([doctorName, count]) => ({ doctorName, count }));
  const dailyTrend = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })).sort((a,b)=>a.date.localeCompare(b.date));
  const completionRate = appts.length > 0 ? (completed / appts.length) * 100 : 0;
  
  return { completed, cancelled, waiting, doctorWorkload, dailyTrend, completionRate };
}
