import { create } from 'zustand'

type QuickActionState = {
  patientFormOpen: boolean
  appointmentFormOpen: boolean
  treatmentFormOpen: boolean
  paymentFormOpen: boolean
  openPatientForm: () => void
  closePatientForm: () => void
  openAppointmentForm: () => void
  closeAppointmentForm: () => void
  openTreatmentForm: () => void
  closeTreatmentForm: () => void
  openPaymentForm: () => void
  closePaymentForm: () => void
}

export const useQuickActionStore = create<QuickActionState>((set) => ({
  patientFormOpen: false,
  appointmentFormOpen: false,
  treatmentFormOpen: false,
  paymentFormOpen: false,
  openPatientForm: () => set({ patientFormOpen: true }),
  closePatientForm: () => set({ patientFormOpen: false }),
  openAppointmentForm: () => set({ appointmentFormOpen: true }),
  closeAppointmentForm: () => set({ appointmentFormOpen: false }),
  openTreatmentForm: () => set({ treatmentFormOpen: true }),
  closeTreatmentForm: () => set({ treatmentFormOpen: false }),
  openPaymentForm: () => set({ paymentFormOpen: true }),
  closePaymentForm: () => set({ paymentFormOpen: false }),
}))
