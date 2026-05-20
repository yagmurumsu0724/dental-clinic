import { createClient } from '@/lib/supabase/client';

export interface TreatmentReportData {
  distribution: { type: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  totalTreatments: number;
}

export async function getTreatmentReport(startDate: string, endDate: string): Promise<TreatmentReportData> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .gte('treatment_date', startDate)
    .lte('treatment_date', endDate);
    
  if (error) throw new Error(`Tedavi raporu alınamadı: ${error.message}`);
  
  const treatments = data || [];
  
  const typeMap = new Map<string, number>();
  const statusMap = new Map<string, number>();
  
  treatments.forEach(t => {
    typeMap.set(t.treatment_type, (typeMap.get(t.treatment_type) || 0) + 1);
    statusMap.set(t.status, (statusMap.get(t.status) || 0) + 1);
  });
  
  return {
    distribution: Array.from(typeMap.entries()).map(([type, count]) => ({ type, count })),
    statusDistribution: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
    totalTreatments: treatments.length
  };
}
