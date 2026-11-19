// Form log penjualan harian
import React from 'react';
import type { Product, SalesLog } from '../config';
import { todayIso } from '../lib/format';

interface Props {
  products: Product[];
  onAdd: (log: SalesLog) => void;
}

export function SalesLogForm({ products, onAdd }: Props) {
  const [form, setForm] = React.useState({
    productId: products[0]?.id ?? '',
    qty: 1,
    date: todayIso(),
  });

  React.useEffect(() => {
    if (!form.productId && products.length > 0) {
      setForm((f) => ({ ...f, productId: products[0].id }));
    }
  }, [products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId) return;
    const newLog: SalesLog = {
      id: `s${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
      date: form.date || todayIso(),
      productId: form.productId,
      qty: Math.max(1, Number(form.qty) || 1),
    };
    onAdd(newLog);
    setForm((f) => ({ ...f, qty: 1, date: todayIso() }));
  };

  return (
    <section className="p-4 sm:p-6 mb-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-3">Log Penjualan Harian</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">Produk</label>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">-- Pilih produk --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Qty Terjual</label>
            <input
              type="number"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
              min={1}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Tanggal</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-emerald-700 text-white font-medium rounded-xl py-2.5 px-4 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Catat Penjualan
        </button>
      </form>
    </section>
  );
}
