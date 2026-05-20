import { createClient } from '@/lib/supabase/client';

export interface RevenueReportData {
  monthlyTrend: { date: string; revenue: number }[];
  methodDistribution: { method: string; amount: number }[];
  totalRevenue: number;
  paidRevenue: number;
  unpaidRevenue: number;
}

export async function getRevenueReport(startDate: string, endDate: string): Promise<RevenueReportData> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .gte('payment_date', startDate)
    .lte('payment_date', endDate);
    
  if (error) throw new Error(`Gelir raporu alınamadı: ${error.message}`);
  
  const payments = data || [];
  
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.total_amount, 0);
  const paidRevenue = payments.reduce((acc, curr) => acc + curr.paid_amount, 0);
  const unpaidRevenue = payments.reduce((acc, curr) => acc + curr.remaining_amount, 0);
  
  // Aggregate by date (assuming simple day aggregation for trend)
  const trendMap = new Map<string, number>();
  const methodMap = new Map<string, number>();
  
  payments.forEach(p => {
    // Trend
    const date = p.payment_date;
    trendMap.set(date, (trendMap.get(date) || 0) + p.paid_amount);
    
    // Method
    const method = p.payment_method;
    methodMap.set(method, (methodMap.get(method) || 0) + p.paid_amount);
  });
  
  const monthlyTrend = Array.from(trendMap.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
    
  const methodDistribution = Array.from(methodMap.entries())
    .map(([method, amount]) => ({ method, amount }));

  return {
    monthlyTrend,
    methodDistribution,
    totalRevenue,
    paidRevenue,
    unpaidRevenue
  };
}
