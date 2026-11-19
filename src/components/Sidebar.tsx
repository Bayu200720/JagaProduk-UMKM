import React from 'react';

export type PageKey = 'dashboard' | 'dataPenjualan' | 'logPenjualan' | 'crudData' | 'exportData';

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  onLogout: () => void;
}

const menuItems: { key: PageKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'dataPenjualan', label: 'Data Penjualan' },
  { key: 'logPenjualan', label: 'Log Penjualan' },
  { key: 'crudData', label: 'CRUD Data' },
  { key: 'exportData', label: 'Export Data' },
];

export function Sidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 bg-neutral-900 text-white rounded-2xl p-4 lg:min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button
          onClick={onLogout}
          className="text-xs sm:text-sm text-neutral-300 hover:text-white underline underline-offset-2"
        >
          Logout
        </button>
      </div>
      <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm text-left transition-colors ${
              activePage === item.key
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-800/60 text-neutral-200 hover:bg-neutral-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
