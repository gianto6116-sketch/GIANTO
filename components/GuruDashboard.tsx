
import React, { useState, useMemo } from 'react';
import type { JurnalEntry } from '../types';

interface GuruDashboardProps {
  entries: JurnalEntry[];
}

const GuruDashboard: React.FC<GuruDashboardProps> = ({ entries }) => {
  const [filter, setFilter] = useState('');

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.created - a.created);
    if (!filter.trim()) {
      return sorted;
    }
    return sorted.filter(e => e.siswa.toLowerCase().includes(filter.toLowerCase()));
  }, [entries, filter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Dashboard Guru</h3>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="filterSiswa" className="text-sm font-medium">Filter siswa:</label>
        <input
          id="filterSiswa"
          placeholder="Nama siswa"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Siswa</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Salat</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Durasi (mnt)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Catatan</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200 text-sm">
            {filteredEntries.map(entry => (
              <tr key={entry.id}>
                <td className="px-4 py-3 whitespace-nowrap">{entry.tanggal}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{entry.siswa}</td>
                <td className="px-4 py-3 capitalize">{entry.salat.join(', ') || '-'}</td>
                <td className="px-4 py-3 text-right">{entry.durasi}</td>
                <td className="px-4 py-3 max-w-xs truncate">{entry.catatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEntries.length === 0 && (
          <p className="text-center text-slate-500 mt-4">Tidak ada data untuk ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default GuruDashboard;
