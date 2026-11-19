// Dashboard alert stok minimum dan kadaluarsa
import type { Product } from '../config';
import { EXPIRY_NEAR_DAYS } from '../config';
import { formatDateId } from '../lib/format';

interface Props {
  products: Product[];
}

export function DashboardAlerts({ products }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lowStock: Product[] = [];
  const nearExpiry: { product: Product; daysLeft: number }[] = [];
  const expired: { product: Product; daysOver: number }[] = [];

  for (const p of products) {
    if (p.stock <= p.minStock) {
      lowStock.push(p);
    }
    if (p.expiryDate) {
      const exp = new Date(p.expiryDate + 'T00:00:00');
      if (Number.isNaN(exp.getTime())) continue;
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        expired.push({ product: p, daysOver: Math.abs(diffDays) });
      } else if (diffDays <= EXPIRY_NEAR_DAYS) {
        nearExpiry.push({ product: p, daysLeft: diffDays });
      }
    }
  }

  return (
    <section className="p-4 sm:p-6 mb-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Dashboard Alert ({products.length} produk)</h2>

      {lowStock.length > 0 ? (
        <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
          <p className="text-red-800 font-medium mb-2">Stok minimum terpenuhi</p>
          <ul className="list-disc list-inside text-neutral-700 space-y-1 text-sm">
            {lowStock.map((p) => (
              <li key={p.id}>
                {p.name}: stok {p.stock} {p.unit} (minimum {p.minStock})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-neutral-600 mb-3">Stok semua produk di atas minimum.</p>
      )}

      {nearExpiry.length > 0 ? (
        <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-amber-800 font-medium mb-2">Mendekati kadaluarsa (≤ {EXPIRY_NEAR_DAYS} hari)</p>
          <ul className="list-disc list-inside text-neutral-700 space-y-1 text-sm">
            {nearExpiry.map((item) => (
              <li key={item.product.id}>
                {item.product.name}: {item.daysLeft} hari lagi ({formatDateId(item.product.expiryDate)})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-neutral-600 mb-3">Tidak ada produk mendekati kadaluarsa.</p>
      )}

      {expired.length > 0 ? (
        <div className="p-3 bg-red-50 rounded-xl border border-red-200">
          <p className="text-red-800 font-medium mb-2">Sudah kadaluarsa</p>
          <ul className="list-disc list-inside text-neutral-700 space-y-1 text-sm">
            {expired.map((item) => (
              <li key={item.product.id}>
                {item.product.name}: lewat {item.daysOver} hari ({formatDateId(item.product.expiryDate)})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-neutral-600">Tidak ada produk yang sudah kadaluarsa.</p>
      )}
    </section>
  );
}