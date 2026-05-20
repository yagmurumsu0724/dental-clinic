'use client'

import { PatientFormDialog } from '@/components/patients/patient-form-dialog'
import { AppointmentFormDialog } from '@/components/appointments/appointment-form-dialog'
import { useQuickActionStore } from '@/stores/quick-action-store'
// Assuming these exist, if not we will only include what exists for now.
// We will check their existence next.

export function GlobalDialogs() {
  const { 
    patientFormOpen, closePatientForm,
    appointmentFormOpen, closeAppointmentForm
  } = useQuickActionStore()

  return (
    <>
      <PatientFormDialog open={patientFormOpen} onClose={closePatientForm} />
      <AppointmentFormDialog open={appointmentFormOpen} onClose={closeAppointmentForm} />
    </>
  )
}
