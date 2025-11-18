
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { User, JurnalEntry, Salat } from '../types';
import { PRAYER_TIMES, SALAT_NAMES } from '../constants';

interface SiswaViewProps {
  currentUser: User;
  entries: JurnalEntry[];
  saveJurnal: (entry: Omit<JurnalEntry, 'id' | 'created'>) => void;
}

const SiswaView: React.FC<SiswaViewProps> = ({ currentUser, entries, saveJurnal }) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [salat, setSalat] = useState<Record<Salat, boolean>>({ subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false });
  const [durasiBelajar, setDurasiBelajar] = useState('');
  const [catatan, setCatatan] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const prayerWindows = useMemo(() => {
    const now = currentTime;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const windows: Record<Salat, boolean> = {} as Record<Salat, boolean>;
    for (const key of SALAT_NAMES) {
        const pTime = PRAYER_TIMES[key];
        windows[key] = (time >= pTime.start && time <= pTime.end);
    }
    return windows;
  }, [currentTime]);

  const loadEntryForDate = useCallback((date: string) => {
    const entry = entries.find(e => e.siswa === currentUser.name && e.tanggal === date);
    if (entry) {
      const newSalatState = { ...salat };
      SALAT_NAMES.forEach(s => newSalatState[s] = entry.salat.includes(s));
      setSalat(newSalatState);
      setDurasiBelajar(String(entry.durasi));
      setCatatan(entry.catatan);
    } else {
      clearForm();
    }
  }, [entries, currentUser.name]);

  useEffect(() => {
    loadEntryForDate(tanggal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tanggal, entries, currentUser.name]);

  const clearForm = () => {
    setSalat({ subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false });
    setDurasiBelajar('');
    setCatatan('');
  };

  const handleSubmit = () => {
    const selectedSalat = Object.entries(salat)
      .filter(([_, isChecked]) => isChecked)
      .map(([salahName]) => salahName as Salat);

    saveJurnal({
      tanggal,
      siswa: currentUser.name,
      salat: selectedSalat,
      durasi: parseInt(durasiBelajar, 10) || 0,
      catatan,
    });
    alert('Jurnal tersimpan!');
  };
  
  const recentEntries = useMemo(() => entries
    .filter(e => e.siswa === currentUser.name)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 5), [entries, currentUser.name]);

  const todaySummary = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return entries.find(e => e.siswa === currentUser.name && e.tanggal === today);
  }, [entries, currentUser.name]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-2">Form Jurnal Harian</h3>
          <p className="text-sm text-red-600 mb-4">
            Waktu sekarang: {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}. Checklist salat hanya aktif pada waktunya.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="tgl" className="block text-sm font-medium text-slate-700">Tanggal</label>
              <input id="tgl" type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="mt-1 block w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Checklist Salat 5 Waktu</p>
              <div className="mt-2 flex flex-wrap gap-4">
                {SALAT_NAMES.map(s => (
                  <label key={s} className={`flex items-center gap-2 capitalize ${prayerWindows[s] ? 'cursor-pointer' : 'cursor-not-allowed text-slate-400'}`}>
                    <input 
                      type="checkbox" 
                      checked={salat[s]}
                      disabled={!prayerWindows[s]}
                      onChange={() => setSalat(prev => ({ ...prev, [s]: !prev[s] }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:bg-slate-200"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="durasiBelajar" className="block text-sm font-medium text-slate-700">Durasi Belajar Malam (menit)</label>
              <input id="durasiBelajar" type="number" value={durasiBelajar} onChange={e => setDurasiBelajar(e.target.value)} className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-slate-700">Catatan</label>
              <textarea id="catatan" rows={3} value={catatan} onChange={e => setCatatan(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition">Simpan Jurnal</button>
              <button onClick={clearForm} className="bg-slate-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-600 transition">Reset Form</button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          <div>
            <h4 className="font-bold text-lg border-b pb-2 mb-2">Riwayat Terakhir</h4>
            <div className="space-y-2 text-sm">
              {recentEntries.length > 0 ? recentEntries.map(e => (
                <div key={e.id} className="p-2 bg-slate-50 rounded-md">
                  <span className="font-semibold">{e.tanggal}</span> — Salat: {e.salat.length}/5, Belajar: {e.durasi} mnt
                </div>
              )) : <p className="text-slate-500">Belum ada jurnal.</p>}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg border-b pb-2 mb-2">Ringkasan Hari Ini</h4>
            {todaySummary ? (
              <div className="text-sm space-y-1">
                <p><span className="font-semibold">Salat dilakukan:</span> {todaySummary.salat.length}/5 ({todaySummary.salat.join(', ') || '-'})</p>
                <p><span className="font-semibold">Durasi belajar:</span> {todaySummary.durasi} menit</p>
                <p><span className="font-semibold">Catatan:</span> {todaySummary.catatan || '-'}</p>
              </div>
            ) : <p className="text-slate-500 text-sm">Belum mengisi jurnal hari ini.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiswaView;
