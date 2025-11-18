
export type Salat = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export interface JurnalEntry {
  id: string;
  tanggal: string;
  siswa: string;
  salat: Salat[];
  durasi: number;
  catatan: string;
  created: number;
}

export interface User {
  name: string;
  role: 'siswa' | 'guru';
}

export type Section = 'login' | 'siswa' | 'dashboard' | 'chartSiswa';
