import React, { useState } from 'react';
import { authService } from '../auth/auth';
import { Button } from './ui/Button';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authService.login({ username, password })) {
      onLogin();
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900">Jaga Produk UMKM</h1>
            <p className="mt-2 text-sm text-neutral-500">Masuk untuk mengelola stok, penjualan, dan perkiraan kebutuhan.</p>
          </div>
          {error && (
            <div className="bg-red-100 text-red-800 rounded border border-red-300 px-3 py-2 text-sm mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                type="text"
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="jaga123"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1"
            >
              Masuk
            </button>
          </form>
          <p className="mt-6 text-xs text-neutral-500">
            Kredensial statis: admin / jaga123
          </p>
        </div>
      </div>
    </div>
  );
}
