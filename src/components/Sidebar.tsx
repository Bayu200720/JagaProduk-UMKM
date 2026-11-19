import React from 'react';
import { Button } from './ui/Button';

type PageId = 'dashboard' | 'dataPenjualan' | 'logPenjualan' | 'crudData' | 'exportData';

type Props = {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
};

const items: { id: PageId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'dataPenjualan', label: 'Data Penjualan' },
  { id: 'logPenjualan', label: 'Log Penjualan' },
  { id: 'crudData', label: 'CRUD Data' },
  { id: 'exportData', label: 'Export Data' },
];

export function Sidebar({ activePage, onNavigate, onLogout }: Props) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-neutral-200">
      <div className="flex flex-col flex-1 min-h-0 pt-6 pb-4">
        <div className="px-5 mb-6">
          <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">Jaga Produk</h1>
          <p className="text-xs text-neutral-500 mt-0.5">UMKM Kopi & Makanan</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activePage === item.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 pt-4 border-t border-neutral-100 mt-4">
          <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-neutral-600">
            Keluar
          </Button>
        </div>
      </div>
    </aside>
  );
}
