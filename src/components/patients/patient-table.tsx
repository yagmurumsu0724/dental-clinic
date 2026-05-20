import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, FileText, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mockPatients = [
  {
    id: '1',
    tc_no: '12345678901',
    full_name: 'Ahmet Yılmaz',
    phone: '0532 123 45 67',
    last_visit: '2026-05-10',
    next_appointment: '2026-05-20 14:30',
  },
  {
    id: '2',
    tc_no: '98765432109',
    full_name: 'Ayşe Demir',
    phone: '0555 987 65 43',
    last_visit: '2026-04-15',
    next_appointment: '-',
  },
  {
    id: '3',
    tc_no: '45612378901',
    full_name: 'Mehmet Çelik',
    phone: '0544 456 12 37',
    last_visit: '2026-05-18',
    next_appointment: '2026-05-25 10:00',
  },
]

export function PatientTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
          <TableHead className="w-[100px]">TC No</TableHead>
          <TableHead>Ad Soyad</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Son Ziyaret</TableHead>
          <TableHead>Sonraki Randevu</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockPatients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium text-slate-600">{patient.tc_no}</TableCell>
            <TableCell className="font-medium text-slate-900">{patient.full_name}</TableCell>
            <TableCell>{patient.phone}</TableCell>
            <TableCell>{patient.last_visit}</TableCell>
            <TableCell>
              {patient.next_appointment !== '-' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  <Calendar className="h-3 w-3" />
                  {patient.next_appointment}
                </span>
              ) : (
                <span className="text-slate-400">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-slate-100 h-8 w-8 p-0">
                  <span className="sr-only">Menüyü aç</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Profili Görüntüle</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Randevu Oluştur</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
