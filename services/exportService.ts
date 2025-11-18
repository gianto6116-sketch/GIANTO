
import type { JurnalEntry } from '../types';

export const exportCSV = (entries: JurnalEntry[]) => {
  if (entries.length === 0) {
    alert('Belum ada data untuk di-export.');
    return;
  }

  const headers = ['id', 'tanggal', 'siswa', 'salat_list', 'salat_count', 'durasi', 'catatan', 'created'];
  const rows = entries.map(r => [
    r.id,
    r.tanggal,
    r.siswa,
    `"${r.salat ? r.salat.join('|') : ''}"`,
    r.salat ? r.salat.length : 0,
    r.durasi || 0,
    `"${r.catatan.replace(/"/g, '""') || ''}"`,
    r.created || '',
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'jurnal_kegiatan.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportPDF = (entries: JurnalEntry[]) => {
  if (entries.length === 0) {
    alert('Belum ada data untuk di-export.');
    return;
  }
  
  const sortedEntries = [...entries].sort((a,b) => b.tanggal.localeCompare(a.tanggal));

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Export Jurnal Kegiatan</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h2 { text-align: center; color: #111; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h2>Rekap Jurnal Kegiatan</h2>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Siswa</th>
              <th>Salat</th>
              <th>Durasi (mnt)</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${sortedEntries.map(r => `
              <tr>
                <td>${r.tanggal}</td>
                <td>${r.siswa}</td>
                <td style="text-transform: capitalize;">${(r.salat || []).join(', ')}</td>
                <td>${r.durasi || 0}</td>
                <td>${(r.catatan || '')}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>`;

  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(html);
    newWindow.document.close();
  } else {
    alert('Gagal membuka jendela baru. Mohon izinkan pop-up untuk situs ini.');
  }
};
