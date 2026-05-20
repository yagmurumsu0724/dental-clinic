import { createClient } from '@/lib/supabase/client';

export interface PatientAnalyticsData {
  growthTrend: { date: string; count: number }[];
  genderDistribution: { gender: string; count: number }[];
  totalPatientsAdded: number;
}

export async function getPatientAnalytics(startDate: string, endDate: string): Promise<PatientAnalyticsData> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('patients')
    .select('created_at, gender')
    .gte('created_at', `${startDate}T00:00:00.000Z`)
    .lte('created_at', `${endDate}T23:59:59.999Z`);
    
  if (error) throw new Error(`Hasta analitiği alınamadı: ${error.message}`);
  
  const patients = data || [];
  const trendMap = new Map<string, number>();
  const genderMap = new Map<string, number>();
  
  patients.forEach(p => {
    const date = p.created_at.split('T')[0];
    trendMap.set(date, (trendMap.get(date) || 0) + 1);
    
    const gender = p.gender || 'Belirtilmedi';
    genderMap.set(gender, (genderMap.get(gender) || 0) + 1);
  });
  
  return {
    growthTrend: Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })).sort((a,b)=>a.date.localeCompare(b.date)),
    genderDistribution: Array.from(genderMap.entries()).map(([gender, count]) => ({ gender, count })),
    totalPatientsAdded: patients.length
  };
}
