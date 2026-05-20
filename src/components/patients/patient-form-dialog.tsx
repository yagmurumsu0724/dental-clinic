'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientSchema, type PatientFormValues } from '@/lib/validations'
import { useCreatePatient, useUpdatePatient } from '@/hooks/use-patients'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Patient } from '@/types'
import { AlertTriangle } from 'lucide-react'

interface PatientFormProps {
  open: boolean
  onClose: () => void
  patient?: Patient // dolu ise düzenleme modu
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{message}</p>
}

function FormField({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

export function PatientFormDialog({ open, onClose, patient }: PatientFormProps) {
  const isEdit = !!patient
  const createMutation = useCreatePatient()
  const updateMutation = useUpdatePatient(patient?.id ?? '')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          tc_no: patient.tc_no ?? '',
          full_name: patient.full_name,
          birth_date: patient.birth_date ?? '',
          gender: patient.gender ?? undefined,
          phone: patient.phone ?? '',
          email: patient.email ?? '',
          address: patient.address ?? '',
          allergies: patient.allergies ?? '',
          notes: patient.notes ?? '',
        }
      : {
          tc_no: '',
          full_name: '',
          birth_date: '',
          phone: '',
          email: '',
          address: '',
          allergies: '',
          notes: '',
        },
  })

  const onSubmit = async (values: PatientFormValues) => {
    try {
      const formattedValues = {
        ...values,
        gender: values.gender === '' ? null : values.gender,
      }
      if (isEdit) {
        await updateMutation.mutateAsync(formattedValues)
      } else {
        await createMutation.mutateAsync(formattedValues)
      }
      reset()
      onClose()
    } catch {
      // Hata hook'lar içinde toast ile gösterilir
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? 'Hasta Bilgilerini Düzenle' : 'Yeni Hasta Ekle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Kişisel Bilgiler */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Kişisel Bilgiler
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Ad Soyad" error={errors.full_name?.message} required className="col-span-2 sm:col-span-1">
                <Input
                  {...register('full_name')}
                  placeholder="Ayşe Yılmaz"
                  className={cn('h-10', errors.full_name && 'border-destructive focus-visible:ring-destructive/30')}
                />
              </FormField>
              <FormField label="TC Kimlik No" error={errors.tc_no?.message}>
                <Input
                  {...register('tc_no')}
                  placeholder="12345678901"
                  maxLength={11}
                  className={cn('h-10', errors.tc_no && 'border-destructive')}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Doğum Tarihi" error={errors.birth_date?.message}>
                <Input
                  type="date"
                  {...register('birth_date')}
                  className={cn('h-10', errors.birth_date && 'border-destructive')}
                />
              </FormField>
              <FormField label="Cinsiyet" error={errors.gender?.message}>
                <Select
                  defaultValue={patient?.gender ?? undefined}
                  onValueChange={v => setValue('gender', v as 'Erkek' | 'Kadın' | 'Diğer')}
                >
                  <SelectTrigger className={cn('h-10', errors.gender && 'border-destructive')}>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Erkek">Erkek</SelectItem>
                    <SelectItem value="Kadın">Kadın</SelectItem>
                    <SelectItem value="Diğer">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* İletişim */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              İletişim Bilgileri
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Telefon" error={errors.phone?.message} required>
                <Input
                  {...register('phone')}
                  placeholder="0532 111 22 33"
                  className={cn('h-10', errors.phone && 'border-destructive')}
                />
              </FormField>
              <FormField label="E-posta" error={errors.email?.message}>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="hasta@example.com"
                  className={cn('h-10', errors.email && 'border-destructive')}
                />
              </FormField>
            </div>
            <FormField label="Adres" error={errors.address?.message}>
              <Input
                {...register('address')}
                placeholder="Kadıköy, İstanbul"
                className={cn('h-10', errors.address && 'border-destructive')}
              />
            </FormField>
          </div>

          <div className="h-px bg-border" />

          {/* Tıbbi Bilgiler */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Tıbbi Bilgiler
            </h3>
            <FormField label="Alerjiler" error={errors.allergies?.message}>
              <Input
                {...register('allergies')}
                placeholder="Penisilin, Lateks..."
                className={cn('h-10', errors.allergies && 'border-destructive')}
              />
            </FormField>
            <FormField label="Notlar" error={errors.notes?.message}>
              <Textarea
                {...register('notes')}
                placeholder="Hasta hakkında önemli notlar..."
                rows={3}
                className={cn('resize-none', errors.notes && 'border-destructive')}
              />
            </FormField>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              İptal
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[120px] shadow-sm shadow-primary/20">
              {isPending
                ? 'Kaydediliyor...'
                : isEdit
                ? 'Değişiklikleri Kaydet'
                : 'Hasta Ekle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
