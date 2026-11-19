// Komponen utama aplikasi Jaga Produk UMKM
import React from 'react';
import type { AppState, Product, SalesLog } from './config';
import { loadState, saveState } from './lib/storage';
import { ProductForm } from './components/ProductForm';
import { SalesLogForm } from './components/SalesLogForm';
import { DashboardAlerts } from './components/DashboardAlerts';
import { ForecastPanel } from './components/ForecastPanel';
import { ExportPanel } from './components/ExportPanel';

export default function App() {
  const [state, setState] = React.useState<AppState>(() => loadState());

  React.useEffect(() => {
    saveState(state);
  }, [state]);

  const handleAddProduct = (product: Product) => {
    setState((prev) => ({ ...prev, products: [...prev.products, product] }));
  };

  const handleAddSalesLog = (log: SalesLog) => {
    setState((prev) => ({ ...prev, salesLogs: [...prev.salesLogs, log] }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-neutral-900">Jaga Produk UMKM</h1>
        <p className="text-neutral-600 mt-1 text-sm sm:text-base">
          Pantau stok, peringatan kedaluwarsa, dan prediksi permintaan sederhana untuk warung kopi/kue Anda.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ProductForm onAdd={handleAddProduct} />
            <SalesLogForm products={state.products} onAdd={handleAddSalesLog} />
          </div>
          <div>
            <DashboardAlerts products={state.products} />
          </div>
        </div>
        <ForecastPanel state={state} />
        <ExportPanel state={state} />
      </main>
    </div>
  );
}
