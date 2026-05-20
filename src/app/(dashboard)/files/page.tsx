'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Upload, Search, Filter, Trash2, Download, Eye, 
  Image as ImageIcon, File, FileType2, AlertCircle, X, ChevronDown, CheckCircle2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFiles, useUploadFile, useDeleteFile } from '@/hooks/use-files'
import { usePatients } from '@/hooks/use-patients'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'
import type { FileType, UploadedFile } from '@/types'

const CATEGORIES: FileType[] = ['Röntgen', 'Klinik Fotoğrafı', 'PDF', 'Tedavi Belgesi', 'Reçete', 'Diğer']

function getFileIcon(type: string, category: string) {
  if (category === 'Röntgen' || category === 'Klinik Fotoğrafı') return <ImageIcon className="h-4 w-4 text-blue-500" />
  if (category === 'PDF') return <FileType2 className="h-4 w-4 text-red-500" />
  return <File className="h-4 w-4 text-slate-500" />
}

export default function FilesPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  
  // Upload State
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<FileType>('Diğer')
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: files = [], isLoading } = useFiles()
  const { data: patients = [] } = usePatients()
  const uploadMutation = useUploadFile()
  const deleteMutation = useDeleteFile()

  const filteredFiles = files.filter(f => {
    const matchSearch = f.file_name.toLowerCase().includes(search.toLowerCase()) || 
                        f.patient?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || f.file_type === categoryFilter
    return matchSearch && matchCategory
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileToUpload(e.dataTransfer.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedPatient) return toast.error('Lütfen bir hasta seçin.')
    if (!fileToUpload) return toast.error('Lütfen bir dosya seçin.')

    uploadMutation.mutate({ file: fileToUpload, patientId: selectedPatient, category: selectedCategory }, {
      onSuccess: () => {
        setUploadModalOpen(false)
        setFileToUpload(null)
        setSelectedPatient('')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Klinik Arşivi
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Röntgenler, test sonuçları ve tedavi belgeleri</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={(val) => val && setCategoryFilter(val)}>
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setUploadModalOpen(true)} className="gap-1.5 shadow-sm shadow-primary/20">
            <Upload className="h-4 w-4" />
            Dosya Yükle
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Dosya adı veya hasta adı ile ara..."
          className="pl-11 h-11 rounded-xl bg-background border-border"
        />
      </div>

      {/* Files List */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
              <TableHead className="py-3 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dosya</TableHead>
              <TableHead className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hasta</TableHead>
              <TableHead className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kategori</TableHead>
              <TableHead className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tarih</TableHead>
              <TableHead className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                 <TableRow key={i}>
                   <TableCell className="px-5"><Skeleton className="h-5 w-40" /></TableCell>
                   <TableCell className="px-4"><Skeleton className="h-5 w-32" /></TableCell>
                   <TableCell className="px-4"><Skeleton className="h-5 w-24" /></TableCell>
                   <TableCell className="px-4"><Skeleton className="h-5 w-24" /></TableCell>
                   <TableCell className="px-5"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                 </TableRow>
               ))
            ) : filteredFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Aradığınız kriterlerde dosya bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              filteredFiles.map((file, idx) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="group hover:bg-muted/40 transition-colors border-b border-border last:border-0"
                >
                  <TableCell className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted border border-border">
                        {getFileIcon(file.file_name, file.file_type)}
                      </div>
                      <span className="font-medium text-sm text-foreground truncate max-w-[200px]">{file.file_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-sm text-muted-foreground font-medium">
                    {file.patient?.full_name || 'Bilinmiyor'}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 text-xs font-medium">
                      {file.file_type}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-sm text-muted-foreground">
                    {format(new Date(file.created_at), 'dd MMM yyyy', { locale: tr })}
                  </TableCell>
                  <TableCell className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPreviewFile(file)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer" download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" size="sm" 
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
                            deleteMutation.mutate({ id: file.id, fileUrl: file.file_url })
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Dosya Yükle</DialogTitle>
            <DialogDescription>Hasta dosyasına yeni bir röntgen, belge veya fotoğraf ekleyin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hasta Seçimi</label>
              <Select value={selectedPatient} onValueChange={(val) => val && setSelectedPatient(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Hasta arayın veya seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name} ({p.tc_no || 'TC Yok'})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Dosya Kategorisi</label>
              <Select value={selectedCategory} onValueChange={(v) => v && setSelectedCategory(v as FileType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div 
              className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${fileToUpload ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && setFileToUpload(e.target.files[0])}
              />
              {fileToUpload ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-sm font-medium text-emerald-600">{fileToUpload.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(fileToUpload.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Dosyayı buraya sürükleyin</p>
                  <p className="text-xs text-muted-foreground mt-1">veya seçmek için tıklayın (Max 50MB)</p>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>İptal</Button>
            <Button onClick={handleUpload} disabled={uploadMutation.isPending || !fileToUpload || !selectedPatient}>
              {uploadMutation.isPending ? 'Yükleniyor...' : 'Yükle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="sm:max-w-[800px] bg-black/95 border-border/10 p-0 overflow-hidden rounded-xl">
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button variant="secondary" size="sm" asChild>
              <a href={previewFile?.file_url} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4 mr-2" />
                İndir
              </a>
            </Button>
            <Button variant="secondary" size="icon" onClick={() => setPreviewFile(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full h-[600px] flex items-center justify-center">
            {previewFile?.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img src={previewFile.file_url} alt={previewFile.file_name} className="max-w-full max-h-full object-contain" />
            ) : previewFile?.file_name.match(/\.(pdf)$/i) ? (
              <iframe src={previewFile.file_url} className="w-full h-full border-0 bg-white" />
            ) : (
              <div className="text-center text-white/70">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Önizleme desteklenmiyor. Dosyayı indirerek görüntüleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
