
import type { Salat } from './types';

export const STORAGE_KEY = 'jurnal_entries_v2_react';

export const PRAYER_TIMES: Record<Salat, { start: string; end: string }> = {
  subuh: { start: '04:00', end: '05:30' },
  dzuhur: { start: '12:00', end: '13:30' },
  ashar: { start: '15:00', end: '16:30' },
  maghrib: { start: '18:00', end: '19:00' },
  isya: { start: '19:00', end: '20:30' },
};

export const SALAT_NAMES: Salat[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
