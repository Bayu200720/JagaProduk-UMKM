// Form input produk sederhana
import React from 'react';
import type { Product, ProductCategory } from '../config';

interface Props {
  onAdd: (product: Product) => void;
}

export function ProductForm({ onAdd }: Props) {
  const [form, setForm] = React.useState({
    name: '',
    category: 'kopi' as ProductCategory,
    unit: 'pcs',
    stock: 0,
    minStock: 1,
    expiryDate: '',
    costPrice: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const newProd: Product = {
      id: `p${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
      name,
      category: form.category,
      unit: form.unit.trim() || 'pcs',
      stock: Math.max(0, Number(form.stock) || 0),
      minStock: Math.max(1, Number(form.minStock) || 1),
      expiryDate: form.expiryDate.trim() || '',
      costPrice: Number(form.costPrice) || 0,
    };
    onAdd(newProd);
    setForm({
      name: '',
      category: 'kopi',
      unit: 'pcs',
      stock: 0,
      minStock: 1,
      expiryDate: '',
      costPrice: 0,
    });
  };

  return (
    <section className="p-4 sm:p-6 mb-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-3">Tambah Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">Nama Produk</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="mis. Biji Kopi Arabika"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="kopi">Kopi</option>
              <option value="bahan">Bahan</option>
              <option value="makanan">Makanan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Satuan</label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              required
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="pcs/kg/gram"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Stok Awal</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              min={0}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">Stok Minimum</label>
            <input
              type="number"
              value={form.minStock}
              onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
              min={1}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">Tanggal Kadaluarsa (opsional)</label>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1">Harga Modal (opsional, Rp)</label>
          <input
            type="number"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
            min={0}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-emerald-700 text-white font-medium rounded-xl py-2.5 px-4 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Simpan Produk
        </button>
      </form>
    </section>
  );
}
