
import React, { useState, useEffect, useCallback } from 'react';
import type { User, JurnalEntry, Section } from './types';
import { STORAGE_KEY } from './constants';
import Header from './components/Header';
import Login from './components/Login';
import SiswaView from './components/SiswaView';
import GuruDashboard from './components/GuruDashboard';
import ChartSiswa from './components/ChartSiswa';
import { scheduleReminders } from './services/notificationService';
import { exportCSV, exportPDF } from './services/exportService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSection, setCurrentSection] = useState<Section>('login');
  const [entries, setEntries] = useState<JurnalEntry[]>([]);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(STORAGE_KEY);
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      } else {
         // sample data to test with
        const s = (new Date()).toISOString().slice(0,10);
        const sampleData: JurnalEntry[] = [{id: Date.now().toString(36), tanggal:s, siswa:'Ali', salat:['subuh','dzuhur','ashar','maghrib','isya'], durasi:90, catatan:'Contoh data', created:Date.now()}];
        setEntries(sampleData);
      }
    } catch (e) {
      console.error("Failed to read entries from localStorage", e);
      setEntries([]);
    }
    scheduleReminders();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to write entries to localStorage", e);
    }
  }, [entries]);
  
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentSection('login');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLogout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLogout]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentSection(user.role === 'guru' ? 'dashboard' : 'siswa');
  };

  const saveJurnal = (entry: Omit<JurnalEntry, 'id' | 'created'>) => {
    setEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(
        e => e.siswa === entry.siswa && e.tanggal === entry.tanggal
      );
      const newEntry = {
        ...entry,
        id: existingIndex > -1 ? prevEntries[existingIndex].id : Date.now().toString(36) + Math.random().toString(36).substring(2),
        created: Date.now(),
      };
      if (existingIndex > -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingIndex] = newEntry;
        return updatedEntries;
      }
      return [...prevEntries, newEntry];
    });
  };

  const renderSection = () => {
    if (!currentUser) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentSection) {
      case 'siswa':
        return <SiswaView currentUser={currentUser} entries={entries} saveJurnal={saveJurnal} />;
      case 'dashboard':
        return <GuruDashboard entries={entries} />;
      case 'chartSiswa':
        return <ChartSiswa entries={entries} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Header 
        currentUser={currentUser} 
        onSetSection={setCurrentSection}
        onLogout={handleLogout}
        onExportCSV={() => exportCSV(entries)}
        onExportPDF={() => exportPDF(entries)}
      />
      <main className="mt-4">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;
