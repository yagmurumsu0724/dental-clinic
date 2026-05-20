'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema, type AppointmentFormValues } from '@/lib/validations'
import { useCreateAppointment } from '@/hooks/use-appointments'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { mockPatients, mockDoctors } from '@/lib/mock-data'
import { AlertTriangle } from 'lucide-react'

interface AppointmentFormProps {
  open: boolean
  onClose: () => void
  defaultPatientId?: string
  defaultDate?: string
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{message}</p>
}

const APPOINTMENT_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

export function AppointmentFormDialog({ open, onClose, defaultPatientId, defaultDate }: AppointmentFormProps) {
  const createMutation = useCreateAppointment()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: {
      patient_id: defaultPatientId ?? '',
      doctor_id: '',
      appointment_date: defaultDate ?? new Date().toISOString().split('T')[0],
      appointment_time: '',
      status: 'Bekliyor',
      notes: '',
    },
  })

  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      await createMutation.mutateAsync(values)
      reset()
      onClose()
    } catch {
      // hata hook içinde gösterilir
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Yeni Randevu Oluştur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Hasta */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Hasta <span className="text-destructive">*</span></Label>
            <Select
              defaultValue={defaultPatientId}
              onValueChange={v => setValue('patient_id', v ?? '')}

            >
              <SelectTrigger className={cn('h-10', errors.patient_id && 'border-destructive')}>
                <SelectValue placeholder="Hasta seçin..." />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.patient_id?.message} />
          </div>

          {/* Doktor */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Doktor <span className="text-destructive">*</span></Label>
            <Select onValueChange={v => setValue('doctor_id', String(v ?? ''))}>
              <SelectTrigger className={cn('h-10', errors.doctor_id && 'border-destructive')}>
                <SelectValue placeholder="Doktor seçin..." />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.doctor_id?.message} />
          </div>

          {/* Tarih + Saat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Tarih <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                {...register('appointment_date')}
                className={cn('h-10', errors.appointment_date && 'border-destructive')}
              />
              <FieldError message={errors.appointment_date?.message} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">Saat <span className="text-destructive">*</span></Label>
              <Select onValueChange={v => setValue('appointment_time', String(v ?? ''))}>

                <SelectTrigger className={cn('h-10', errors.appointment_time && 'border-destructive')}>
                  <SelectValue placeholder="Saat seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TIMES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.appointment_time?.message} />
            </div>
          </div>

          {/* Notlar */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Notlar</Label>
            <Textarea
              {...register('notes')}
              placeholder="Randevu ile ilgili notlar..."
              rows={3}
              className="resize-none"
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={createMutation.isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="shadow-sm shadow-primary/20">
              {createMutation.isPending ? 'Kaydediliyor...' : 'Randevu Oluştur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
