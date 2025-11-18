import React, { useState } from 'react';
import type { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'siswa' | 'guru'>('siswa');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!name.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }
    if (role === 'guru' && (name.toLowerCase() !== 'guru' || password !== '1234')) {
      setError('Credential guru salah.');
      return;
    }
    setError('');
    onLogin({ name: name.trim(), role });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Masuk</h3>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {role === 'guru' && (
        <p className="text-sm text-slate-500 mb-4">
          Untuk Guru: username <code>guru</code>, password <code>1234</code>.
        </p>
      )}
      <div className="space-y-4">
        <input
          id="username"
          placeholder="Nama siswa/guru"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {role === 'guru' && (
          <input
            id="password"
            type="password"
            placeholder="Password (khusus guru)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <select
          id="roleSel"
          value={role}
          onChange={(e) => setRole(e.target.value as 'siswa' | 'guru')}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="siswa">Siswa</option>
          <option value="guru">Guru</option>
        </select>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Masuk
        </button>
      </div>
    </div>
  );
};

export default Login;