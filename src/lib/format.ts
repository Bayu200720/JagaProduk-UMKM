// Fungsi format angka/tanggal sesuai aturan (default Bagian 6)
export function formatRupiah(value: number): string {
  const n = Number.isFinite(value) ? Math.round(value) : 0;
  return 'Rp' + n.toLocaleString('id-ID');
}

export function formatNumberId(value: number): string {
  if (!Number.isFinite(value)) return '0';
  // tampilkan tanpa desimal berlebih; gunakan koma untuk desimal jika ada
  const s = value.toString().replace('.', ',');
  return s;
}

export function formatDateId(isoDate: string): string {
  if (!isoDate) return '-';
  const d = new Date(isoDate + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
