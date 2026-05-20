export interface ToothMetadata {
  number: number
  name: string
  nameEn: string
  quadrant: 1 | 2 | 3 | 4
  x: number // percentage coordinate on elliptical arch
  y: number // percentage coordinate on elliptical arch
  type: 'incisor' | 'canine' | 'premolar' | 'molar'
}

export type ToothStatus = 
  | 'healthy'     // soft white
  | 'filling'     // blue
  | 'implant'     // purple
  | 'missing'     // gray
  | 'root-canal'  // orange
  | 'critical'    // red
  | 'crown'       // gold

export const toothStatuses: { value: ToothStatus; label: string; color: string; bgClass: string; strokeClass: string }[] = [
  { value: 'healthy', label: 'Sağlıklı', color: '#F8FAFC', bgClass: 'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800', strokeClass: 'stroke-slate-300 dark:stroke-slate-700 fill-slate-50 dark:fill-slate-900 hover:fill-slate-100 dark:hover:fill-slate-800' },
  { value: 'filling', label: 'Dolgu', color: '#3B82F6', bgClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40', strokeClass: 'stroke-blue-600 fill-blue-500/20 hover:fill-blue-500/40' },
  { value: 'implant', label: 'İmplant', color: '#8B5CF6', bgClass: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800/40', strokeClass: 'stroke-violet-600 fill-violet-500/20 hover:fill-violet-500/40' },
  { value: 'missing', label: 'Eksik Diş', color: '#64748B', bgClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-slate-300 dark:border-slate-700', strokeClass: 'stroke-slate-400 stroke-dashed fill-transparent opacity-60 hover:opacity-80' },
  { value: 'root-canal', label: 'Kanal Tedavisi', color: '#F97316', bgClass: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/40', strokeClass: 'stroke-orange-600 fill-orange-500/20 hover:fill-orange-500/40' },
  { value: 'critical', label: 'Kritik Durum', color: '#EF4444', bgClass: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/40', strokeClass: 'stroke-red-600 fill-red-500/25 hover:fill-red-500/45' },
  { value: 'crown', label: 'Kaplama / Kuron', color: '#EAB308', bgClass: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40', strokeClass: 'stroke-amber-600 fill-amber-500/25 hover:fill-amber-500/45' }
]

export const fdiTeeth: ToothMetadata[] = [
  // ─── QUADRANT 1: UPPER RIGHT (18 -> 11) ───────────────────────
  { number: 18, name: 'Sağ Üst Üçüncü Büyük Azı (20 Yaş)', nameEn: 'Upper Right Third Molar (Wisdom Tooth)', quadrant: 1, x: 12, y: 41, type: 'molar' },
  { number: 17, name: 'Sağ Üst İkinci Büyük Azı', nameEn: 'Upper Right Second Molar', quadrant: 1, x: 13, y: 32, type: 'molar' },
  { number: 16, name: 'Sağ Üst Birinci Büyük Azı', nameEn: 'Upper Right First Molar', quadrant: 1, x: 16, y: 24, type: 'molar' },
  { number: 15, name: 'Sağ Üst İkinci Küçük Azı', nameEn: 'Upper Right Second Premolar', quadrant: 1, x: 20, y: 18, type: 'premolar' },
  { number: 14, name: 'Sağ Üst Birinci Küçük Azı', nameEn: 'Upper Right First Premolar', quadrant: 1, x: 25, y: 13, type: 'premolar' },
  { number: 13, name: 'Sağ Üst Köpek Dişi (Kanin)', nameEn: 'Upper Right Canine', quadrant: 1, x: 31, y: 9, type: 'canine' },
  { number: 12, name: 'Sağ Üst Yan Kesici', nameEn: 'Upper Right Lateral Incisor', quadrant: 1, x: 37, y: 7, type: 'incisor' },
  { number: 11, name: 'Sağ Üst Orta Kesici (Santral)', nameEn: 'Upper Right Central Incisor', quadrant: 1, x: 44, y: 6, type: 'incisor' },

  // ─── QUADRANT 2: UPPER LEFT (21 -> 28) ────────────────────────
  { number: 21, name: 'Sol Üst Orta Kesici (Santral)', nameEn: 'Upper Left Central Incisor', quadrant: 2, x: 56, y: 6, type: 'incisor' },
  { number: 22, name: 'Sol Üst Yan Kesici', nameEn: 'Upper Left Lateral Incisor', quadrant: 2, x: 63, y: 7, type: 'incisor' },
  { number: 23, name: 'Sol Üst Köpek Dişi (Kanin)', nameEn: 'Upper Left Canine', quadrant: 2, x: 69, y: 9, type: 'canine' },
  { number: 24, name: 'Sol Üst Birinci Küçük Azı', nameEn: 'Upper Left First Premolar', quadrant: 2, x: 75, y: 13, type: 'premolar' },
  { number: 25, name: 'Sol Üst İkinci Küçük Azı', nameEn: 'Upper Left Second Premolar', quadrant: 2, x: 80, y: 18, type: 'premolar' },
  { number: 26, name: 'Sol Üst Birinci Büyük Azı', nameEn: 'Upper Left First Molar', quadrant: 2, x: 84, y: 24, type: 'molar' },
  { number: 27, name: 'Sol Üst İkinci Büyük Azı', nameEn: 'Upper Left Second Molar', quadrant: 2, x: 87, y: 32, type: 'molar' },
  { number: 28, name: 'Sol Üst Üçüncü Büyük Azı (20 Yaş)', nameEn: 'Upper Left Third Molar (Wisdom Tooth)', quadrant: 2, x: 88, y: 41, type: 'molar' },

  // ─── QUADRANT 3: LOWER LEFT (31 -> 38) ────────────────────────
  { number: 31, name: 'Sol Alt Orta Kesici (Santral)', nameEn: 'Lower Left Central Incisor', quadrant: 3, x: 56, y: 94, type: 'incisor' },
  { number: 32, name: 'Sol Alt Yan Kesici', nameEn: 'Lower Left Lateral Incisor', quadrant: 3, x: 63, y: 93, type: 'incisor' },
  { number: 33, name: 'Sol Alt Köpek Dişi (Kanin)', nameEn: 'Lower Left Canine', quadrant: 3, x: 69, y: 91, type: 'canine' },
  { number: 34, name: 'Sol Alt Birinci Küçük Azı', nameEn: 'Lower Left First Premolar', quadrant: 3, x: 75, y: 87, type: 'premolar' },
  { number: 35, name: 'Sol Alt İkinci Küçük Azı', nameEn: 'Lower Left Second Premolar', quadrant: 3, x: 80, y: 82, type: 'premolar' },
  { number: 36, name: 'Sol Alt Birinci Büyük Azı', nameEn: 'Lower Left First Molar', quadrant: 3, x: 84, y: 76, type: 'molar' },
  { number: 37, name: 'Sol Alt İkinci Büyük Azı', nameEn: 'Lower Left Second Molar', quadrant: 3, x: 87, y: 68, type: 'molar' },
  { number: 38, name: 'Sol Alt Üçüncü Büyük Azı (20 Yaş)', nameEn: 'Lower Left Third Molar (Wisdom Tooth)', quadrant: 3, x: 88, y: 59, type: 'molar' },

  // ─── QUADRANT 4: LOWER RIGHT (41 -> 48) ───────────────────────
  { number: 41, name: 'Sağ Alt Orta Kesici (Santral)', nameEn: 'Lower Right Central Incisor', quadrant: 4, x: 44, y: 94, type: 'incisor' },
  { number: 42, name: 'Sağ Alt Yan Kesici', nameEn: 'Lower Right Lateral Incisor', quadrant: 4, x: 37, y: 93, type: 'incisor' },
  { number: 43, name: 'Sağ Alt Köpek Dişi (Kanin)', nameEn: 'Lower Right Canine', quadrant: 4, x: 31, y: 91, type: 'canine' },
  { number: 44, name: 'Sağ Alt Birinci Küçük Azı', nameEn: 'Lower Right First Premolar', quadrant: 4, x: 25, y: 87, type: 'premolar' },
  { number: 45, name: 'Sağ Alt İkinci Küçük Azı', nameEn: 'Lower Right Second Premolar', quadrant: 4, x: 20, y: 82, type: 'premolar' },
  { number: 46, name: 'Sağ Alt Birinci Büyük Azı', nameEn: 'Lower Right First Molar', quadrant: 4, x: 16, y: 76, type: 'molar' },
  { number: 47, name: 'Sağ Alt İkinci Büyük Azı', nameEn: 'Lower Right Second Molar', quadrant: 4, x: 13, y: 68, type: 'molar' },
  { number: 48, name: 'Sağ Alt Üçüncü Büyük Azı (20 Yaş)', nameEn: 'Lower Right Third Molar (Wisdom Tooth)', quadrant: 4, x: 12, y: 59, type: 'molar' }
]

export const getToothName = (num: number): { tr: string; en: string } => {
  const tooth = fdiTeeth.find(t => t.number === num)
  return tooth 
    ? { tr: tooth.name, en: tooth.nameEn }
    : { tr: `Diş ${num}`, en: `Tooth ${num}` }
}
