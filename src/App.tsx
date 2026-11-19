import React, { useEffect, useMemo, useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { PageHeader } from './components/ui/PageHeader';
import { Badge } from './components/ui/Badge';
import { authService } from './auth/auth';
import { loadState, saveState } from './lib/storage';
import type { AppState, Product, ProductCategory } from './config';

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
  const nearItems = near.map((p) => <li key={p.id}>{p.name} ({formatDateId(p.expiryDate)})</li>);
  const expiredItems = expired.map((p) => <li key={p.id}>{p.name}: sudah kadaluarsa</li>);

  // Compute summary stats
  const totalProducts = state.products.length;
  const totalSalesToday = state.salesLogs.filter(l=>l.date===todayStr()).reduce((s,l)=>s+l.qty,0);
  const totalSalesThisWeek = state.salesLogs.filter(l=>new Date(l.date)>=new Date(new Date().setDate(new Date().getDate()-7))&&new Date(l.date)<=new Date()).reduce((s,l)=>s+l.qty,0);

  return (
    <Card title="Dashboard" className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Total Produk</p>
          <p className="text-3xl font-bold text-neutral-900">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Penjualan Hari Ini</p>
          <p className="text-3xl font-bold text-neutral-900">{totalSalesToday} {state.products[0]?.unit || 'pcs'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Penjualan Minggu Ini</p>
          <p className="text-3xl font-bold text-neutral-900">{totalSalesThisWeek}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Status Stok</p>
          <p className={`text-3xl font-bold ${lowStock.length>0?'text-red-600':'text-green-600'}`}>${lowStock.length} butuh perhatian</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card title="Stok Minimum" className="space-y-4">
          {lowStock.length === 0 ? (
            <p className="text-neutral-500">Semua produk aman</p>
          ) : (
            <ul className="space-y-2">{lowStockItems}</ul>
          )}
        </Card>

        <Card title="Mendekati Kadaluarsa" className="space-y-4">
          {near.length===0?<p className="text-neutral-500">Baik</p>:(
            <ul className="space-y-2">{nearItems}</ul>
          )}
        </Card>

        <Card title="Sudah Kadaluarsa" className="space-y-4">
          {expired.length===0?<p className="text-neutral-500">Baik</p>:(
            <ul className="space-y-2">{expiredItems}</ul>
          )}
        </Card>

        <Card title="Forecast Permintaan 7 Hari" className="space-y-4">
          {state.products.length===0?<p className="text-neutral-500">Belum ada produk</p>:(
            <ul className="space-y-3">{state.products.map(p=><li key={p.id} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Badge variant="neutral">{p.name}</Badge>
              </span>
              <div className="text-right">
                <span className="text-sm text-neutral-500">{forecasts[p.id].avgPerDay}</span>
                <span className="text-xs font-medium text-neutral-400">{p.unit}/hari</span>
                {forecasts[p.id].note && <span className="text-xs text-red-500 ml-2">{forecasts[p.id].note}</span>}
              </div>
            </li>)}</ul>
          )}
        </Card>

      </div>
    </Card>
  );
}

export function SalesDataView({state,setState}: {state: AppState, setState: (s: AppState) => void}) {
  const logsToday = state.salesLogs.filter(l=>l.date===todayStr());
  const logsThisWeek = state.salesLogs.filter(l=>new Date(l.date)>=new Date(new Date().setDate(new Date().getDate()-7))&&new Date(l.date)<=new Date());
  const productsMap = state.products.reduce((acc,p)=>({...acc,[p.id]:p.name}),{} as Record<string,string>);

  return (
    <Card title="Data Penjualan" className="p-6">
      <div className="mb-4">
        <p className="text-sm text-neutral-500 mb-2">Total Log: {state.salesLogs.length}</p>
        <p className="text-sm text-neutral-500 mb-3">Hari ini: {logsToday.length} log, {logsToday.reduce((s,l)=>s+l.qty,0)} qty</p>
        <p className="text-sm text-neutral-500">Minggu ini: {logsThisWeek.length} log, {logsThisWeek.reduce((s,l)=>s+l.qty,0)} qty</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full rounded-lg border border-neutral-200">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left text-sm font-medium text-neutral-600 p-3">Tanggal</th>
              <th className="text-left text-sm font-medium text-neutral-600 p-3">Produk</th>
              <th className="text-left text-sm font-medium text-neutral-600 p-3">Qty</th>
              <th className="text-left text-sm font-medium text-neutral-600 p-3">Kategori</th>
            </tr>
          </thead>
          <tbody>
            {state.salesLogs.map((log)=>(
              <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="p-3 align-middle">{log.date}</td>
                <td className="p-3 align-middle">{productsMap[log.productId] || log.productId}</td>
                <td className="p-3 align-middle">{log.qty}</td>
                <td className="p-3 align-middle">{state.products.find(p=>p.id===log.productId)?.category || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function SalesLogView({state,setState}: {state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>}) {
  const [form, setForm] = useState<{productId:string, qty:number, date:string}>({productId:'', qty:1, date:todayStr()});
  const productOptions = state.products.map(p=>({value:p.id, label:p.name}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId) return;
    const newLog = {
      id: 's' + Date.now(),
      date: form.date,
      productId: form.productId,
      qty: Math.max(1, form.qty),
    };
    setState(prev => ({
      ...prev,
      salesLogs: [...prev.salesLogs, newLog],
    }));
    setForm({productId:'', qty:1, date:todayStr()});
  };

  return (
    <Card title="Log Penjualan Harian" className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={form.productId}
          onChange={(e)=>setForm(prev=>({...prev, productId:e.target.value}))}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
        >
          <option value="">-- Pilih produk --</option>
          {productOptions.map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="flex items-center justify-between">
          <input
            type="number"
            min="1"
            value={form.qty}
            onChange={(e)=>setForm(prev=>({...prev, qty:Number(e.target.value)||1}))}
            className="w-full md:w-32 rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e)=>setForm(prev=>({...prev, date:e.target.value}))}
            className="w-full md:w-64 rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1"
          disabled={!form.productId}
        >
          Simpan Log
        </button>
      </form>
      <div className="mt-4 text-xs text-neutral-500">
        <p>Total log hari ini: {state.salesLogs.filter(l=>l.date===todayStr()).length}</p>
        <p>Total penjualan hari ini: {state.salesLogs.filter(l=>l.date===todayStr()).reduce((s,l)=>s+l.qty,0)}</p>
      </div>
    </Card>
  );
}

export function CrudView({state,setState}: {state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>}) {
  const [mode, setMode] = useState<'add'|'edit'>('add');
  const [form, setForm] = useState<{id?: string; name:string; category:ProductCategory; unit:string; stock:number; minStock:number; expiryDate:string; costPrice?: number}>({
    name:'', category:'kopi', unit:'pcs', stock:0, minStock:0, expiryDate:'', costPrice:undefined
  });
  const categories: ProductCategory[] = ['kopi','bahan','makanan','minuman'];

  const saveProduct = () => {
    if (form.name.trim() === '') return;
    const id = mode === 'edit' && form.id ? form.id : 'p' + Date.now();
    const newProduct: Product = {
      id,
      name: form.name.trim(),
      category: form.category,
      unit: form.unit,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
      expiryDate: form.expiryDate,
      costPrice: form.costPrice,
    };
    setState(prev => {
      if (mode === 'edit' && form.id) {
        return { ...prev, products: prev.products.map(p => p.id === form.id ? newProduct : p) };
      }
      return { ...prev, products: [...prev.products, newProduct] };
    });
    setForm({name:'', category:'kopi', unit:'pcs', stock:0, minStock:0, expiryDate:'', costPrice:undefined});
    setMode('add');
  };

  const deleteProduct = (id: string) => {
    setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    if (mode === 'edit' && form.id === id) {
      setForm({name:'', category:'kopi', unit:'pcs', stock:0, minStock:0, expiryDate:'', costPrice:undefined});
      setMode('add');
    }
  };

  const startEdit = (p: Product) => {
    setForm({ id: p.id, name: p.name, category: p.category, unit: p.unit, stock: p.stock, minStock: p.minStock, expiryDate: p.expiryDate || '', costPrice: p.costPrice });
    setMode('edit');
  };

  return (
    <Card title="CRUD Data Produk" className="p-6">
      <div className="mb-4">
        <button
          onClick={() => setMode('add')}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 mb-3"
        >
          Tambah Produk Baru
        </button>
        {mode === 'edit' && (
          <button
            onClick={() => setMode('add')}
            className="w-full rounded-lg bg-neutral-200 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 mb-3"
          >
            Batalkan edit
          </button>
        )}
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Nama Produk</label>
          <input
            value={form.name}
            onChange={(e)=>setForm(prev=>({...prev, name:e.target.value.trim()}))}
            type="text"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            placeholder="Nama produk"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Kategori</label>
            <select
              value={form.category}
              onChange={(e)=>setForm(prev=>({...prev, category:e.target.value as ProductCategory}))}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            >
              {categories.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Unit</label>
            <input
              value={form.unit}
              onChange={(e)=>setForm(prev=>({...prev, unit:e.target.value}))}
              type="text"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
              placeholder="pcs/kg/kg..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Stok</label>
            <input
              value={form.stock}
              onChange={(e)=>setForm(prev=>({...prev, stock:Number(e.target.value)||0}))}
              type="number"
              min="0"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">Min Stock</label>
            <input
              value={form.minStock}
              onChange={(e)=>setForm(prev=>({...prev, minStock:Number(e.target.value)||0}))}
              type="number"
              min="0"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Tanggal Kadaluarsa</label>
          <input
            value={form.expiryDate}
            onChange={(e)=>setForm(prev=>({...prev, expiryDate:e.target.value}))}
            type="date"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
          />
          {form.costPrice !== undefined && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-neutral-600 mb-2">Harga Pokok (Rp)</label>
              <input
                value={form.costPrice}
                onChange={(e)=>setForm(prev=>({...prev, costPrice:Number(e.target.value)||undefined}))}
                type="number"
                min="0"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="Harga satuan"
              />
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className={`w-full rounded-lg ${mode=== 'add'?'bg-primary':'bg-red-600'} px-4 py-2.5 text-sm font-medium text-white hover:${mode=== 'add'?'bg-primary-dark':'bg-red-500'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1`}
            disabled={form.name.trim() === ''}
          >
            {mode === 'add' ? 'Simpan Produk' : 'Update Produk'}
          </button>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={() => deleteProduct(form.id!)}
              className="w-full rounded-lg bg-red-100 px-4 py-2.5 text-sm text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 mt-2"
            >
              Hapus Produk
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}

export function ExportView({state}: {state: AppState}) {
  const today = todayStr();

  const exportProductsCSV = (): string => {
    const header = 'ID,Nama,Kategori,Unit,Stok,Min Stock,Expiry Date,Cost Price\n';
    const rows = state.products.map(p=>
      `${p.id},"${p.name}",${p.category},${p.unit},${p.stock},${p.minStock},${p.expiryDate || ''},${p.costPrice || ''}`
    ).join('\n');
    return header + rows;
  };

  const exportSalesCSV = (): string => {
    const productsMap = state.products.reduce((acc,p)=>({...acc,[p.id]:p.name}),{} as Record<string,string>);
    const header = 'ID,Tanggal,Product ID,Product Name,Qty\n';
    const rows = state.salesLogs.map(l=>
      `${l.id},${l.date},${l.productId},"${productsMap[l.productId] || l.productId}",${l.qty}`
    ).join('\n');
    return header + rows;
  };

  const exportAlertsCSV = (): string => {
    const lowStock = state.products.filter(p=>p.stock<=p.minStock);
    const near = state.products.filter(p=>{const d=daysUntil(p.expiryDate);return d!==null&&d>=0&&d<=3;});
    const expired = state.products.filter(p=>{const d=daysUntil(p.expiryDate);return d!==null&&d<0;});
    const lines: string[] = [];
    lowStock.forEach(p=>lines.push(`ALERT,STOK_MIN,${p.id},${p.name},stok ${p.stock} <= min ${p.minStock}`));
    near.forEach(p=>lines.push(`ALERT,EXPIRY_NEAR,${p.id},${p.name},${formatDateId(p.expiryDate)} dalam ${daysUntil(p.expiryDate)} hari`));
    expired.forEach(p=>lines.push(`ALERT,EXPIRED,${p.id},${p.name},sudah kadaluarsa`));
    return lines.join('\n');
  };

  const handleDownload = (name: string, content: string) => {
    const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card title="Export Data" className="p-6">
      <div className="space-y-4">
        <button
          onClick={() => handleDownload(`produk-${today}.csv`, exportProductsCSV())}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          Download Produk CSV
        </button>
        <button
          onClick={() => handleDownload(`penjualan-${today}.csv`, exportSalesCSV())}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 mt-3"
        >
          Download Penjualan CSV
        </button>
        <button
          onClick={() => handleDownload(`alert-${today}.csv`, exportAlertsCSV())}
          className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 mt-3"
        >
          Download Alert CSV
        </button>
        <p className="text-xs text-neutral-500">
          File CSV akan di-download dengan nama yang berisi tanggal hari ini.
        </p>
      </div>
    </Card>
  );
}
