import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Login } from '../components/Login';
import { authService } from '../auth/auth';
import { loadState, saveState } from '../lib/storage';
import type { AppState } from '../config';

type PageId = 'dashboard' | 'dataPenjualan' | 'logPenjualan' | 'crudData' | 'exportData';

export function AppShell() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(authService.isAuthenticated())} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={() => {
          authService.logout();
          setIsLoggedIn(false);
        }}
      />
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activePage === 'dashboard' && <DashboardView state={state} />}
          {activePage === 'dataPenjualan' && <SalesDataView state={state} />}
          {activePage === 'logPenjualan' && <SalesLogView state={state} setState={setState} />}
          {activePage === 'crudData' && <CrudView state={state} setState={setState} />}
          {activePage === 'exportData' && <ExportView state={state} />}
        </div>
      </main>
    </div>
  );
}
