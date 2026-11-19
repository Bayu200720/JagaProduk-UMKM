// Export CSV (penjualan, stok, alert)
import type { AppState } from '../config';
import { buildSalesCsv, buildStockCsv, buildAlertsCsv, downloadCsv } from '../lib/csv';

interface Props {
  state: AppState;
}

export function ExportPanel({ state }: Props) {
  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10);
    const salesCsv = buildSalesCsv(state);
    const stockCsv = buildStockCsv(state);
    const alertsCsv = buildAlertsCsv(state);
    downloadCsv(`penjualan-${date}.csv`, salesCsv);
    setTimeout(() => downloadCsv(`stok-${date}.csv`, stockCsv), 100);
    setTimeout(() => downloadCsv(`alert-${date}.csv`, alertsCsv), 200);
  };

  return (
    <section className="p-4 sm:p-6 mb-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-3">Export Data</h2>
      <p className="text-sm text-neutral-600 mb-3">
        Ekspor laporan penjualan, stok, dan alert dalam format CSV (berkas terpisah).
      </p>
      <button
        onClick={handleExport}
        className="w-full sm:w-auto bg-emerald-700 text-white font-medium rounded-xl py-2.5 px-4 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Export CSV
      </button>
    </section>
  );
}