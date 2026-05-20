import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  getDashboardStats,
  getRevenueReport,
  getAppointmentReport,
  getTreatmentReport,
  getPatientAnalytics
} from '@/services/reports';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.reports.dashboardStats(),
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRevenueReport(startDate: string, endDate: string) {
  return useQuery({
    queryKey: queryKeys.reports.revenue(startDate, endDate),
    queryFn: () => getRevenueReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAppointmentReport(startDate: string, endDate: string) {
  return useQuery({
    queryKey: queryKeys.reports.appointment(startDate, endDate),
    queryFn: () => getAppointmentReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTreatmentReport(startDate: string, endDate: string) {
  return useQuery({
    queryKey: queryKeys.reports.treatment(startDate, endDate),
    queryFn: () => getTreatmentReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePatientAnalytics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: queryKeys.reports.patientAnalytics(startDate, endDate),
    queryFn: () => getPatientAnalytics(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  });
}
