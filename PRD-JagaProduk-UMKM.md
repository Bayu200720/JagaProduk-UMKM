# PRD — Jaga Produk untuk UMKM Kecil (Kopi/Makanan)

## 1) Ringkasan & tujuan (Clarity)
- Masalah: pemilik warung kopi/UMKM makanan kecil sulit memantau stok, bahan mendekati/kedaluwarsa, dan tidak punya perkiraan permintaan sederhana sehingga berisiko kehabisan bahan atau pemborosan.
- Solusi: aplikasi web satu halaman “Jaga Produk UMKM” untuk mencatat produk, stok, log penjualan harian, menampilkan alert stok minimum dan kedaluwarsa, menampilkan forecast permintaan 7 hari sederhana dari data lokal, serta ekspor CSV. Semua berjalan di browser (tanpa server/DB/API eksternal saat runtime), data disimpan di `localStorage` (kunci `jagaproduk_state_v1`).

## 2) Persona & masalah (Impact)
- Persona: pemilik/penjaga warung kopi atau UMKM makanan rumahan/toko kecil (mis. penjual kopi sachet/biji, roti, bahan baku gula/susu).
- Masalah nyata:
  - Stok tidak terpantau → kehabisan saat ramai atau overstock bahan mudah rusak.
  - Tanggal kadaluarsa terlewat → kerugian dan risiko kualitas.
  - Tidak ada perkiraan permintaan → beli bahan tidak terarah.
- Manfaat langsung:
  - Mengurangi pemborosan bahan/kedaluwarsa terlewat lewat alert.
  - Membantu keputusan beli sederhana dari rata-rata penjualan harian (forecast lokal).
- Contoh skenario (hipotetis): warung kopi menjual 20–30 gelas/hari; dengan log 7 hari, aplikasi menampilkan saran beli bahan kira-kira sesuai rata-rata agar stok tidak minus dan tidak berlebih.

## 3) Ruang lingkup MVP
**Dalam ruang lingkup (MVP):**
- Input data produk: nama, kategori (Kopi/Bahan/Makanan), stok awal (angka), satuan (teks), harga modal (opsional), tanggal kadaluarsa (opsional, satu tanggal per produk).
- Log penjualan harian: tanggal (YYYY-MM-DD), produk, qty terjual (>=1). Disimpan di `localStorage`.
- Dashboard alert:
  - Stok <= stok minimum (per produk).
  - Mendekati kadaluarsa: selisih hari <= 3 hari (termasuk hari ini) dan belum lewat.
  - Sudah kadaluarsa: tanggal kadaluarsa < hari ini.
- Forecast permintaan 7 hari ke depan per produk:
  - Menggunakan moving average dari log penjualan pada rentang maksimal 30 hari terakhir (hari dengan data tercatat dihitung).
  - Jika jumlah hari data < 3 → tampilkan “Data kurang (butuh minimal 3 hari penjualan).”
  - Hasil: rata-rata per hari (dibulatkan ke bilangan terdekat). Ditampilkan sebagai `~X <satuan>/hari` dan saran “Saran beli besok: ~X <satuan>”.
- Ekspor CSV (client-side): tiga berkas terpisah (penjualan, stok, alert) dengan kolom sesuai bagian Data model/output.

**Di luar ruang lingkup (non-scope MVP):**
- Backend, database, API eksternal, login/multi-user.
- Sinkronisasi cloud, notifikasi push/email/WA otomatis (boleh rencana lanjut, tidak dibangun).
- Batch kedaluwarsa banyak per produk (MVP: satu tanggal kedaluwarsa per produk).
- Manajemen pengguna/role.

## 4) Fitur detail
### F4.1 Input produk
- Field: Nama (wajib), Kategori (Kopi/Bahan/Makanan), Satuan (wajib, teks bebas, contoh pcs/kg/gram), Stok Awal (angka >= 0), Stok Minimum (angka >= 1), Tanggal Kadaluarsa (opsional), Harga Modal (opsional, Rp bulat).
- Validasi: nama wajib diisi; stok/min stok dibulatkan secara input ke angka valid (minimal sesuai aturan); satuan default `pcs` jika dikosongkan saat submit (implementasi) tetapi field disarankan diisi.

### F4.2 Log penjualan harian
- Field: Produk (wajib, dari daftar), Qty (>=1), Tanggal (default hari ini, format input date).
- Penyimpanan ditambahkan ke array `salesLogs`.

### F4.3 Dashboard alert
- Menampilkan jumlah produk dan tiga blok: stok minimum, mendekati kadaluarsa (<=3 hari), sudah kadaluarsa.

### F4.4 Forecast & saran pembelian
- Rumus: `avgPerDay = round(totalQtyOnDaysWithSales / daysUsed)` dengan `daysUsed` = jumlah tanggal unik yang punya penjualan produk tersebut dalam 30 hari terakhir dan `d >= start && d <= today`. Jika `daysUsed < 3` → `avgPerDay = 0`, note “Data kurang…”.
- Saran beli besok ditampilkan sebagai nilai sama (`~avgPerDay satuan`).

### F4.5 Ekspor CSV
- `penjualan-YYYY-MM-DD.csv`: kolom `Tanggal,Produk,Qty,Satuan`
- `stok-YYYY-MM-DD.csv`: kolom `Produk,Kategori,Stok,Satuan,StokMinimum,TanggalKadaluarsa`
- `alert-YYYY-MM-DD.csv`: kolom `Jenis,Produk,Detail` (Jenis: StokMinimum / MendekatiKadaluarsa / Kadaluarsa)

## 5) Alur pengguna (singkat)
1. Buka aplikasi → melihat daftar contoh produk (dari `src/config.ts`) jika belum ada data tersimpan.
2. Tambah produk baru (opsional) via form “Tambah Produk”.
3. Catat penjualan harian via “Log Penjualan Harian”.
4. Lihat “Dashboard Alert” untuk stok minimum dan kadaluarsa.
5. Lihat “Forecast Permintaan 7 Hari” dan saran beli.
6. Klik “Export CSV” untuk mengunduh tiga berkas laporan.

## 6) Data model (skema objek)
- `Product`: `{ id, name, category: 'kopi'|'bahan'|'makanan', unit, stock:number, minStock:number, expiryDate:string(YYYY-MM-DD|'') , costPrice?:number }`
- `SalesLog`: `{ id, date:string(YYYY-MM-DD), productId:string, qty:number }`
- `AppState`: `{ products: Product[], salesLogs: SalesLog[] }`
- Kunci localStorage: `jagaproduk_state_v1`. Jika data kosong/rusak → fallback ke `DEFAULT_STATE` (lihat `src/config.ts`).

## 7) Aturan validasi/form (ringkas)
- Input pengguna dibersihkan spasi awal/akhir saat submit.
- Nama produk wajib.
- Qty penjualan minimal 1.
- Stok/min stok tidak boleh negatif; min stok minimal 1.
- Tanggal memakai input `type="date"` (native). Tampilan tanggal di UI menggunakan format Indonesia (mis. 18 November 2026) via `formatDateId`.
- Error teknis tidak ditampilkan ke pengguna; penyimpanan gagal diabaikan aman (tanpa crash).

## 8) Kriteria penerimaan (contoh)
- Menambah produk baru muncul di daftar/terpakai di form penjualan dan di perhitungan.
- Menambah log penjualan mengubah forecast setelah ada >=3 hari data berbeda (atau menampilkan “Data kurang” jika < 3).
- Produk dengan stok <= minStock muncul di alert stok minimum.
- Produk dengan expiryDate lewat hari ini muncul di “Sudah kadaluarsa”; <=3 hari muncul di “Mendekati kadaluarsa”.
- Export CSV menghasilkan tiga file dan dapat dibuka di spreadsheet (kolom sesuai).
- Refresh halaman: data tetap ada (localStorage). Menghapus key manual → aplikasi kembali ke data default contoh tanpa error layar putih.

## 9) Non-fungsional & batasan (sesuai instruksi workshop)
- Web statis React + Vite + TypeScript + Tailwind, tanpa server/DB/API eksternal saat runtime, tanpa API key.
- Tidak ada CDN/importmap/Google Fonts via tag; font dipasang via npm (`@fontsource/plus-jakarta-sans`).
- Struktur: komponen per file, rumus di `src/lib/*`, data bisnis default di `src/config.ts`.
- Siap deploy Netlify: `package.json` script `build` → `dist`, `index.html` di root, `netlify.toml` ada.
- Format default (jika tidak diatur lain): Rupiah `Rp` + titik ribuan tanpa desimal (mis. `Rp50.000`), desimal pakai koma bila ada, tanggal tampil Indonesia.

## 10) Metrik keberhasilan (untuk presentasi)
- Contoh dampak: mengurangi kejadian bahan kedaluwarsa terlewat (alert muncul sebelum H-0) dan membantu perencanaan beli harian berbasis rata-rata 7–30 hari data lokal.
- Demo menunjukkan alur end-to-end dalam < 2 menit: tambah produk → catat penjualan → lihat alert & forecast → export CSV.
