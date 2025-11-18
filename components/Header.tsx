
import React from 'react';
import type { User, Section } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onSetSection: (section: Section) => void;
  onLogout: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onSetSection, onLogout, onExportCSV, onExportPDF }) => {
  const NavLink: React.FC<{ section: Section; children: React.ReactNode }> = ({ section, children }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onSetSection(section);
      }}
      className="text-blue-600 hover:text-blue-800 hover:underline"
    >
      {children}
    </a>
  );

  return (
    <header>
      <div className="flex flex-wrap justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          LMS Mini — Jurnal Kegiatan
        </h1>
        {currentUser && (
          <div className="text-sm text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
            Logged in as: <span className="font-semibold">{currentUser.name} ({currentUser.role})</span>
          </div>
        )}
      </div>
      <nav className="mt-4 p-4 bg-white rounded-lg shadow-sm text-sm font-medium flex flex-wrap gap-x-4 gap-y-2 items-center">
        {currentUser ? (
          <>
            {currentUser.role === 'siswa' && <NavLink section="siswa">Jurnal Siswa</NavLink>}
            {currentUser.role === 'guru' && (
              <>
                <NavLink section="dashboard">Dashboard Guru</NavLink>
                <span className="text-slate-300">|</span>
                <NavLink section="chartSiswa">Grafik Siswa</NavLink>
              </>
            )}
            <span className="text-slate-300">|</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onExportCSV(); }} className="text-blue-600 hover:text-blue-800 hover:underline">Export CSV</a>
            <span className="text-slate-300">|</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onExportPDF(); }} className="text-blue-600 hover:text-blue-800 hover:underline">Export PDF</a>
            <span className="text-slate-300">|</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="text-red-600 hover:text-red-800 hover:underline">Logout (Ctrl+L)</a>
          </>
        ) : (
          <span className="text-slate-500">Silakan login untuk memulai.</span>
        )}
      </nav>
    </header>
  );
};

export default Header;
