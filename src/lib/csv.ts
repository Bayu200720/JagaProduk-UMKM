// Generator CSV sederhana di client
import { AppState } from '../config';
import { formatDateId } from './format';

function escapeCsv(val: string): string {
  if (/[",\n]/.test(val)) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

export function buildSalesCsv(state: AppState): string {
  const lines: string[] = ['Tanggal,Produk,Qty,Satuan'];
  for (const log of state.salesLogs) {
    const p = state.products.find((pr) => pr.id === log.productId);
    const pname = p ? p.name : log.productId;
    const unit = p ? p.unit : '';
    lines.push([log.date, escapeCsv(pname), String(log.qty), escapeCsv(unit)].join(','));
  }
  return lines.join('\n');
}

export function buildStockCsv(state: AppState): string {
  const lines: string[] = ['Produk,Kategori,Stok,Satuan,StokMinimum,TanggalKadaluarsa'];
  for (const p of state.products) {
    lines.push([
      escapeCsv(p.name),
      p.category,
      String(p.stock),
      escapeCsv(p.unit),
      String(p.minStock),
      p.expiryDate || '',
    ].join(','));
  }
  return lines.join('\n');
}

export function buildAlertsCsv(state: AppState): string {
  const lines: string[] = ['Jenis,Produk,Detail'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const p of state.products) {
    if (p.stock <= p.minStock) {
      lines.push(['StokMinimum', escapeCsv(p.name), `Stok ${p.stock} ${p.unit} (min ${p.minStock})`].join(','));
    }
    if (p.expiryDate) {
      const exp = new Date(p.expiryDate + 'T00:00:00');
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        lines.push(['Kadaluarsa', escapeCsv(p.name), `Sudah lewat ${formatDateId(p.expiryDate)}`].join(','));
      } else if (diffDays <= 3) {
        lines.push(['MendekatiKadaluarsa', escapeCsv(p.name), `${diffDays} hari lagi (${formatDateId(p.expiryDate)})`].join(','));
      }
    }
  }
  return lines.join('\n');
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
