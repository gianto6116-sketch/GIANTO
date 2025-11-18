
import React, { useState, useMemo } from 'react';
import type { JurnalEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartSiswaProps {
  entries: JurnalEntry[];
}

const ChartSiswa: React.FC<ChartSiswaProps> = ({ entries }) => {
  const [siswaName, setSiswaName] = useState('');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeStudent, setActiveStudent] = useState('');

  const studentNames = useMemo(() => {
    return [...new Set(entries.map(e => e.siswa))].sort();
  }, [entries]);

  const handleShowChart = () => {
    if (!siswaName) {
      alert('Pilih nama siswa untuk menampilkan grafik.');
      return;
    }
    const studentEntries = entries
      .filter(e => e.siswa.toLowerCase() === siswaName.toLowerCase())
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    if (studentEntries.length === 0) {
      alert('Tidak ada data untuk siswa ini.');
      setChartData([]);
      setActiveStudent('');
      return;
    }
    
    const data = studentEntries.map(e => ({
      tanggal: e.tanggal.slice(5), // M-DD
      'Jumlah Salat': e.salat.length,
      'Durasi Belajar': e.durasi,
    }));

    setChartData(data);
    setActiveStudent(siswaName);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-300 rounded-lg shadow-sm">
          <p className="font-bold text-slate-800">{`Tanggal: ${label}`}</p>
          <p className="text-blue-600">{`Jumlah Salat: ${payload[0].value}`}</p>
          <p className="text-green-600">{`Durasi Belajar: ${payload[1].value} menit`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Grafik Per Siswa</h3>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <select
            value={siswaName}
            onChange={e => setSiswaName(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
            <option value="">-- Pilih Siswa --</option>
            {studentNames.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <select
          value={chartType}
          onChange={e => setChartType(e.target.value as 'line' | 'bar')}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
        <button
          onClick={handleShowChart}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Tampilkan Grafik
        </button>
      </div>

      {chartData.length > 0 ? (
        <>
        <h4 className="text-lg font-semibold mb-4 text-center">Progres {activeStudent}</h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tanggal" />
                <YAxis yAxisId="left" stroke="#1d4ed8" />
                <YAxis yAxisId="right" orientation="right" stroke="#15803d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Jumlah Salat" stroke="#1d4ed8" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="Durasi Belajar" stroke="#15803d" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tanggal" />
                <YAxis yAxisId="left" stroke="#1d4ed8" />
                <YAxis yAxisId="right" orientation="right" stroke="#15803d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="Jumlah Salat" fill="#3b82f6" />
                <Bar yAxisId="right" dataKey="Durasi Belajar" fill="#22c55e" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        </>
      ) : (
        <div className="text-center text-slate-500 py-10">
            <p>Pilih siswa dan klik "Tampilkan Grafik" untuk melihat data.</p>
        </div>
      )}
    </div>
  );
};

export default ChartSiswa;
