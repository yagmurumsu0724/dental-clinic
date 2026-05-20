export const queryKeys = {
  patients: {
    all: () => ['patients'] as const,

    lists: () => [...queryKeys.patients.all(), 'list'] as const,

    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.patients.lists(), { filters }] as const,

    details: () => [...queryKeys.patients.all(), 'detail'] as const,

    detail: (id: string) =>
      [...queryKeys.patients.details(), id] as const,
  },

  appointments: {
    all: () => ['appointments'] as const,

    lists: () => [...queryKeys.appointments.all(), 'list'] as const,

    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.appointments.lists(), { filters }] as const,

    detail: (id: string) =>
      [...queryKeys.appointments.all(), 'detail', id] as const,
  },

  treatments: {
    all: () => ['treatments'] as const,

    lists: () => [...queryKeys.treatments.all(), 'list'] as const,

    list: (patientId?: string) =>
      [...queryKeys.treatments.lists(), { patientId }] as const,

    detail: (id: string) =>
      [...queryKeys.treatments.all(), 'detail', id] as const,
  },

  payments: {
    all: () => ['payments'] as const,

    lists: () => [...queryKeys.payments.all(), 'list'] as const,

    list: (patientId?: string) =>
      [...queryKeys.payments.lists(), { patientId }] as const,
  },

  users: {
    all: () => ['users'] as const,

    me: () => [...queryKeys.users.all(), 'me'] as const,
  },

  reports: {
    all: () => ['reports'] as const,
    dashboardStats: () => [...queryKeys.reports.all(), 'dashboardStats'] as const,
    revenue: (startDate: string, endDate: string) => [...queryKeys.reports.all(), 'revenue', startDate, endDate] as const,
    appointment: (startDate: string, endDate: string) => [...queryKeys.reports.all(), 'appointment', startDate, endDate] as const,
    treatment: (startDate: string, endDate: string) => [...queryKeys.reports.all(), 'treatment', startDate, endDate] as const,
    patientAnalytics: (startDate: string, endDate: string) => [...queryKeys.reports.all(), 'patientAnalytics', startDate, endDate] as const,
  },
  files: {
    all: () => ['files'] as const,
    list: (patientId?: string) => [...queryKeys.files.all(), 'list', { patientId }] as const,
  },

  notifications: {
    all: () => ['notifications'] as const,
    list: () => [...queryKeys.notifications.all(), 'list'] as const,
    unreadCount: () => [...queryKeys.notifications.all(), 'unreadCount'] as const,
  },

  settings: {
    all: () => ['settings'] as const,
    clinic: () => [...queryKeys.settings.all(), 'clinic'] as const,
    user: () => [...queryKeys.settings.all(), 'user'] as const,
    notification: () => [...queryKeys.settings.all(), 'notification'] as const,
    security: () => [...queryKeys.settings.all(), 'security'] as const,
  },
} as const