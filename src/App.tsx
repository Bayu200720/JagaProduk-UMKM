import React, { useEffect, useState } from 'react';
import type { AppState, Product, SalesLog, UserLogin } from './config';
import { loadState, saveState } from './lib/storage';
import { Login } from './components/Login';
import { Sidebar, type PageKey } from './components/Sidebar';
import { ProductForm } from './components/ProductForm';
import { SalesLogForm } from './components/SalesLogForm';
import { DashboardAlerts } from './components/DashboardAlerts';
import { ForecastPanel } from './components/ForecastPanel';
import { ExportPanel } from './components/ExportPanel';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<PageKey>('dashboard');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleLogin = (credentials: UserLogin) => {
    const correctUser = credentials.username === 'admin' && credentials.password === 'jaga123';
    if (correctUser) {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setActivePage('dashboard');
    setState(loadState());
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  const handleAddProduct = (product: Product) => {
    setState((prev) => ({ ...prev, products: [...prev.products, product] }));
  };

  const handleDeleteProduct = (id: string) => {
    setState((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  };

  const handleAddSalesLog = (log: SalesLog) => {
    setState((prev) => ({ ...prev, salesLogs: [...prev.salesLogs, log] }));
  };

  const handleDeleteSalesLog = (id: string) => {
    setState((prev) => ({ ...prev, salesLogs: prev.salesLogs.filter((l) => l.id !== id) }));
  };

  const productList = state.products;
  const salesLogList = state.salesLogs;

  return (
    <div className='min-h-screen bg-neutral-50'>
      <header className='max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-3 border-b border-neutral-200'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-neutral-900'>Jaga Produk UMKM</h1>
          <p className='text-neutral-600 text-sm sm:text-base'>
            Pantau stok, peringatan kelaluwarnya, dan prediksi permintaan sederhana untuk warung kopi/kue Anda.
          </p>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 pb-10'>
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={handleLogout}
        />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
          <div>
            {activePage === 'dashboard' && <DashboardAlerts products={state.products} />}
            {activePage === 'logPenjualan' && (
              <div className='space-y-4'>
                <SalesLogForm products={state.products} onAdd={handleAddSalesLog} />
                <h2 className="text-lg font-semibold text-neutral-900">Riwayat Penjualan</h2>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm text-neutral-600'>
                    <thead className='border-b border-neutral-200'>
                      <tr>
                        <th className='p-2 text-left'>Tanggal</th>
                        <th className='p-2 text-left'>Produk</th>
                        <th className='p-2 text-left'>Qty</th>
                        <th className='p-2 text-left'>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesLogList.map((log) => {
                        const p = state.products.find((pr) => pr.id === log.productId);
                        return (
                          <tr key={log.id}>
                            <td className='p-2'>{log.date}</td>
                            <td className='p-2'>{p ? p.name : log.productId}</td>
                            <td className='p-2'>{log.qty}</td>
                            <td className='p-2'>
                              <button
                                className='text-red-600 hover:underline'
                                onClick={() => handleDeleteSalesLog(log.id)}
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activePage === 'crudData' && (
              <div className='space-y-4'>
                <ProductForm onAdd={handleAddProduct} />
                <h2 className="text-lg font-semibold text-neutral-900">Daftar Produk</h2>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm text-neutral-600'>
                    <thead className='border-b border-neutral-200'>
                      <tr>
                        <th className='p-2 text-left'>Nama</th>
                        <th className='p-2 text-left'>Kategori</th>
                        <th className='p-2 text-left'>Stok</th>
                        <th className='p-2 text-left'>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((p) => (
                        <tr key={p.id}>
                          <td className='p-2'>{p.name}</td>
                          <td className='p-2'>{p.category}</td>
                          <td className='p-2'>{p.stock}</td>
                          <td className='p-2'>
                            <button
                              className='text-blue-600 hover:underline'
                              onClick={() => {}}
                            >
                              Edit
                            </button>
                            <button
                              className='text-red-600 hover:underline ml-2'
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activePage === 'exportData' && <ExportPanel state={state} />}
          </div>

          <div>
            {activePage === 'dashboard' && (
              <div className='space-y-4'>
                <DashboardAlerts products={state.products} />
                <ForecastPanel state={state} />
              </div>
            )}
            {activePage === 'dashboard' && <ForecastPanel state={state} />}
          </div>
        </div>

        <footer className='mt-8 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-600'>
          <p>
            Halaman:
            <span className='font-medium' onClick={() => setActivePage('dashboard')}> Dashboard</span>{' '}
            <span className='ml-2' onClick={() => setActivePage('dataPenjualan')}> Data Penjualan</span>{' '}
            <span className='ml-2' onClick={() => setActivePage('logPenjualan')}> Log Penjualan</span>{' '}
            <span className='ml-2' onClick={() => setActivePage('crudData')}> CRUD Data</span>{' '}
            <span className='ml-2' onClick={() => setActivePage('exportData')}> Export Data</span>{' '}
          </p>
        </footer>
      </main>
    </div>
  );
}
