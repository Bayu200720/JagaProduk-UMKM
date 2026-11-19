import React, { useState } from 'react';
import type { UserLogin } from '../config';
import { STATIC_CREDENTIAL } from '../config';

interface LoginProps {
  onLoginSuccess: (credentials: UserLogin) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Username dan password wajib diisi.');
      return;
    }

    if (trimmedUser === STATIC_CREDENTIAL.username && trimmedPass === STATIC_CREDENTIAL.password) {
      setError('');
      onLoginSuccess({ username: trimmedUser, password: trimmedPass });
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Jaga Produk UMKM</h1>
          <p className="text-neutral-600 mt-2 text-sm">Masuk untuk mengelola stok dan penjualan Anda</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Masuk
          </button>
        </form>
        <p className="text-xs text-neutral-500 mt-4 text-center">
          Demo: username <span className="font-mono">admin</span>, password <span className="font-mono">jaga123</span>
        </p>
      </div>
    </div>
  );
}
