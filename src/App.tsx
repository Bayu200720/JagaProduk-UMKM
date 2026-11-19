import React, { useEffect, useMemo, useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { PageHeader } from './components/ui/PageHeader';
import { Badge } from './components/ui/Badge';
import { authService } from './auth/auth';
import { loadState, saveState } from './lib/storage';
import type { AppState, Product } from './config';

type PageId = 'dashboard' | 'dataPenjualan' | 'logPenjualan' | 'crudData' | 'exportData';

function todayStr() { return new Date().toISOString().slice(0, 10); }
function uid() { return Math.random().toString(36).slice(2, 10); }
function formatDateId(d: string) { if(!d) return '-'; return new Date(d+'T00:00:00').toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }); }
function daysUntil(dateStr: string) { if(!dateStr) return null; const t=new Date(todayStr+'T00:00:00'), n=new Date(dateStr+'T00:00:00'); return Math.ceil((n.getTime()-t.getTime())/(864e5)); }

function calcForecast(s: AppState) {
  const now=new Date(), thirty=new Date(now); thirty.setDate(now.getDate()-30);
  const recent=s.salesLogs.filter(l=>new Date(l.date)>=thirty&&new Date(l.date)<=now);
  const res: Record<string, {avgPerDay: number, daysUsed: number, note: string}> = {};
  for(const p of s.products) {
    const dates=new Set(recent.filter(l=>l.productId===p.id).map(l=>l.date));
    const d=dates.size;
    let note = '';
    let avgPerDay = 0;
    if(d<3) note = 'Data kurang (butuh minimal 3 hari penjualan)';
    else {
      const total=recent.filter(l=>l.productId===p.id).reduce((a,l)=>a+l.qty,0);
      avgPerDay = Math.round(total/d);
    }
    res[p.id] = {avgPerDay, daysUsed: d, note};
  }
  return res;
}

export default function App() {
  const [isLoggedIn,setIsLoggedIn]=useState(authService.isAuthenticated());
  const [page,setPage]=useState<'dashboard'|'dataPenjualan'|'logPenjualan'|'crudData'|'exportData'>('dashboard');
  const [state,setState]=useState<AppState>(()=>loadState());
  useEffect(()=>saveState(state),[state]);
  const forecasts=useMemo(()=>calcForecast(state),[state]);

  if(!isLoggedIn) return <Login onLogin={()=>setIsLoggedIn(true)}/>;

  const lowStock=state.products.filter(p=>p.stock<=p.minStock);
  const near=state.products.filter(p=>{const d=daysUntil(p.expiryDate);return d!==null&&d>=0&&d<=3;});
  const expired=state.products.filter(p=>{const d=daysUntil(p.expiryDate);return d!==null&&d<0;});

  const pageRender=({
    dashboard:()=><DashboardView state={state} forecasts={forecasts} lowStock={lowStock} near={near} expired={expired}/>,
    dataPenjualan:()=>(<SalesDataView state={state} setState={setState}/>),
    logPenjualan:()=>(<SalesLogView state={state} setState={setState}/>),
    crudData:()=>(<CrudView state={state} setState={setState}/>),
    exportData:()=>(<ExportView state={state}/>),
  }[page]);

  return(
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar activePage={page} onNavigate={setPage} onLogout={()=>{authService.logout();setIsLoggedIn(false)}}/>
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {pageRender()}
        </div>
      </main>
    </div>
  );
}

export function DashboardView({state,forecasts,lowStock,near,expired}: {state: AppState, forecasts: Record<string, {avgPerDay: number, daysUsed: number, note: string}>, lowStock: Product[], near: Product[], expired: Product[]}) {
  const lowStockItems = lowStock.map((p) => {
    const text = p.name + ": stok " + p.stock + " <= min " + p.minStock;
    return <li key={p.id}>{text}</li>;
  });

  return (
    <Card title="Dashboard" className="space-y-6">
      <Card title="Stok Minimum" className="space-y-3">
        {lowStock.length === 0 ? (
          <p className="text-neutral-500">Semua produk aman</p>
        ) : (
          <ul>{lowStockItems}</ul>
        )}
      </Card>
      <Card title="Mendekati Kadaluarsa" className="space-y-3">
        {near.length===0?<p className="text-neutral-500">Baik</p>:(<ul>{near.map(p=><li key={p.id}>{p.name} ({formatDateId(p.expiryDate)})</li>)}</ul>)}
      </Card>
      <Card title="Sudah Kadaluarsa" className="space-y-3">
        {expired.length===0?<p className="text-neutral-500">Baik</p>:(<ul>{expired.map(p=><li key={p.id}>{p.name}: sudah kadaluarsa</li>)}</ul>)}
      </Card>
      <Card title="Forecast Permintaan 7 Hari" className="space-y-3">
        {state.products.length===0?<p className="text-neutral-500">Belum ada produk</p>:(<ul>{state.products.map(p=><li key={p.id}><Badge variant="neutral">{p.name}</Badge> {forecasts[p.id].avgPerDay} {p.unit}/hari {forecasts[p.id].note}</li>)}</ul>)}
      </Card>
    </Card>
  );
}

export function SalesDataView({state,setState}: {state: AppState, setState: (s: AppState) => void}) {
  return(<Card title="Data Penjualan" className="p-6"><p className="text-sm text-neutral-500">Tabel data penjualan akan muncul di sini. Total log: {state.salesLogs.length}</p></Card>);
}

export function SalesLogView({state,setState}: {state: AppState, setState: (s: AppState) => void}) {
  return(
    <Card title="Log Penjualan Harian" className="space-y-4">
      <form className="space-y-3">
        <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500" disabled>
          <option>Produk harus login terlebih dahulu</option>
        </select>
        <input type="number" min="1" className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500" disabled/>
        <input type="date" className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500" disabled/>
        <button className="btn-primary" disabled>Simpan</button>
      </form>
    </Card>
  );
}

export function CrudView({state,setState}: {state: AppState, setState: (s: AppState) => void}) {
  return(<Card title="CRUD Data Produk" className="p-6"><p className="text-sm text-neutral-500">CRUD interface akan muncul di sini. Produk: {state.products.length}</p></Card>);
}

export function ExportView({state}: {state: AppState}) {
  return(<Card title="Export Data" className="p-6"><p className="text-sm text-neutral-500">Export CSV akan di-generate di sini. 3 file: penjualan, stok, alert.</p></Card>);
}
