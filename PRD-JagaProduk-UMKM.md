# PRD — Jaga Produk untuk UMKM Kecil (Kopi/Makanan)

## 1) Ringkasan & tujuan (Clarity)
- Masalah: pemilik warung kopi/UMKM makanan kecil sulit memantau stok, bahan mendekati/kedaluwarsa, dan tidak punya perkiraan permintaan sederhana sehingga berisiko kehabisan bahan atau pemborosan.
- Solusi: aplikasi web satu halaman “Jaga Produk UMKM” untuk mencatat produk, stok, log penjualan harian, menampilkan alert stok minimum dan kedaluwarsa, menampilkan forecast permintaan 7 hari sederhana dari data lokal, serta ekspor CSV. Aplikasi dilengkapi fitur login pengguna dan navigasi sidebar untuk mengorganisir halaman Dashboard, Data Penjualan, Log Penjualan, CRUD Data, dan Export. Semua berjalan di browser (tanpa server/DB/API eksternal saat runtime), data disimpan di `localStorage` (kunci `jagaproduk_state_v1`).

## 2) Persona & masalah (Impact)
- Persona: pemilik/penjaga warung kopi atau UMKM makanan rumahan/toko kecil (mis. penjual kopi sachet/biji, roti, bahan baku gula/susu).
- Masalah nyata:
  - Stok tidak terpantau → kehabisan saat ramai atau overstock bahan mudah rusak.
  - Tanggal kadaluarsa terlewat → kerugian dan risiko kualitas.
  - Tidak ada perkiraan permintaan → beli bahan tidak terarah.
  - Tidak ada akun pengguna terpisah → data campuran antar pengguna (masalah untuk tim banyak).
- Manfaat langsung:
  - Mengurangi pemborosan bahan/kedaluwarsa terlewat lewat alert.
  - Membantu keputusan beli sederhana dari rata-rata penjualan harian (forecast lokal).
  - Setiap pengguna bisa memiliki data pribadi terpisih via login.
- Contoh skenario (hipotetis): warung kopi menjual 20–30 gelas/hari; dengan log 7 hari, aplikasi menampilkan saran beli bahan kira-kira sesuai rata-rata agar stok tidak minus dan tidak berlebih.

## 3) Ruang lingkup MVP
**Dalam ruang lingkup (MVP):**
- Halaman login: form username/password sederhana; kredensial disimpan di localStorage; setelah login terbuka sidebar dan halaman utama.
- Sidebar menu: navigasi tetap muncul di atas atau di sisi kiri dengan link: Dashboard, Data Penjualan, Log Penjualan, CRUD Data, Export Data. Hanya terlihat setelah login.
- Input data produk: nama, kategori (Kopi/Bahan/Makanan), satuan (teks), stok awal (angka), stok minimum (angka), tanggal kadaluarsa (opsional), harga modal (opsional).
- Log penjualan harian: tanggal (YYYY-MM-DD), produk (pilih dari daftar), qty terjual (>=1). Disimpan di localStorage.
- Dashboard alert: stok <= stok minimum (per produk), mendekati kadaluarsa (<=3 hari), sudah kadaluarsa.
- Forecast permintaan 7 hari ke depan per produk: moving average dari log penjualan 7–30 hari terakhir. Jika hari data < 3 → tampilkan “Data kurang (buteh minimal 3 hari penjualan)”.
- CRUD Data Produk: create, read, update, delete daftar produk (hanya client-side, mengubah localStorage).
- Ekspor CSV (client-side): tiga berkas terpisah (penjualan, stok, alert) dengan kolom sesuai data model.

**Di luar ruang lingkup (non-scope MVP):**
- Backend, database, API eksternal.
- Sinkronisasi cloud, notifikasi push/email/WA otomatis.
- Batch kedaluwarsa banyak per produk (MVP: satu tanggal kedaluwarsa per produk).
- Manajemen pengguna tingkat lanjut (role, password reset).

## 4) Fitur detail
### F4.1 Halaman Login
- Field: Username (wajib), Password (wajib).
- Validasi: keduanya harus diisi; kredensial dicek terhadap pair statis yang disimpan di `src/config.ts` (mis. `admin` / `jaga123`). Kesalahan menampilkan pesan di bawah field.
- Setelah berhasil → menyimpan `isLoggedIn: true` di localStorage dan menampilkan sidebar.
- Tombol Logout: menyetel `isLoggedIn: false` dan mengembalikan ke halaman login.

### F4.2 Sidebar Menu
- Komponen yang selalu muncul setelah login (dengan navigasi).
- Item menu:
  1. **Dashboard** → tautan ke halaman dashboard dengan alert stok & forecast.
  2. **Data Penjualan** → halaman ringkasan data penjualan harian (tabel).
  3. **Log Penjualan** → form log penjualan harian (F4.3).
  4. **CRUD Data** → halaman daftar produk dengan tombol Edit/Delete serta form tambah produk.
  5. **Export Data** → tombol unduh CSV (F4.5).
- Jika pengguna belum login, sidebar tersembunyi dan hanya tampil tombol Login.

### F4.3 Log Penjualan Harian (detailed)
- Field: Produk (dropdown dari daftar produk aktif), Qty (>=1), Tanggal (default hari ini, input date).
- Penyimpanan ditambahkan ke array `salesLogs` bersama state aplikasi.

### F4.4 CRUD Data Produk
- **Tampilan Daftar Produk**: tabel menampilkan id, nama, kategori, stok, stok minimum, expiry date. Setiap baris memiliki tombol Edit dan Delete.
- **Tambah Produk**: form sama dengan F4.1 Input produk, namun bisa digunakan juga untuk update (mengisi field dengan data lama).
- **Edit Produk**: mengizinkan mengubah nama, kategori, satuan, stok, stok minimum, expiry date. Validasi sama dengan input produk baru.
- **Hapus Produk**: konfirmasi, menghapus produk dan semua log penjualan yang terkait (atau memberikan peringatan jika ada log terkait).
- Semua operasi menyimpan perubahan ke localStorage kunci `jagaproduk_state_v1`.

### F4.5 Dashboard Alert (detailed)
- Menampilkan tiga blok:
  - **Stok Minimum**: daftar produk di mana `stock <= minStock`.
  - **Mendekati Kadaluarsa**: produk dengan `expiryDate` >= hari ini dan <= hari ini + 3 hari.
  - **Sudah Kadaluarsa**: produk dengan `expiryDate` < hari ini.
- Setiap blok menampilkan jumlah produk dan daftar nama produk dengan link ke detail produk.

### F4.6 Forecast & saran pembelian
- Rumus: `avgPerDay = round(totalQtyOnDaysWithSales / daysUsed)` dengan `daysUsed` = jumlah tanggal unik yang punya penjualan produk tersebut dalam 30 hari terakhir. Jika `daysUsed < 3` → `avgPerDay = 0`, note “Data kurang…”.
- Saran beli besok ditampilkan sebagai nilai sama (`~avgPerDay satuan`).

### F4.7 Ekspor CSV
- `penjualan-YYYY-MM-DD.csv`: kolom `Tanggal,Produk,Qty,Satuan`
- `stok-YYYY-MM-DD.csv`: kolom `Produk,Kategori,Stok,Satuan,StokMinimum,TanggalKadaluarsa`
- `alert-YYYY-MM-DD.csv`: kolom `Jenis,Produk,Detail` (Jenis: StokMinimum / MendekatiKadaluarsa / Kadaluarsa)

## 5) Alur pengguna (singkat)
1. Buka aplikasi → tampil halaman login.
2. Masukkan username dan password yang sesuai → aplikasi menyimpan status login di localStorage dan menampilkan sidebar beserta halaman dashboard.
3. Dari sidebar, pilih menu:
   - **Dashboard** → lihat alert stok minimum, mendekati kadaluarsa, sudah kadaluarsa, serta forecast permintaan 7 hari.
   - **Data Penjualan** → lihat tabel ringkasan data penjualan harian.
   - **Log Penjualan** → isi form log penjualan harian; data otomatis disimpan.
   - **CRUD Data** → tambah, edit, atau hapus produk; perubahan langsung terlihat di seluruh halaman.
   - **Export Data** → unduh tiga berkas CSV.
4. Klik **Logout** dari sidebar → status login direset, kembali ke halaman login; data produk dan log penjualan tetap ada di localStorage (tetapi tidak dapat diakses hingga login kembali jika ingin membatasi).

## 6) Data model (skema objek)
- `UserLogin`: `{ username:string, passwordHash:string }` (hardcoded pair di config, dibandingkan input mentah).
- `Product`: `{ id, name, category: 'kopi'|'bahan'|'makanan', unit, stock:number, minStock:number, expiryDate:string(YYYY-MM-DD|'') , costPrice?:number }`
- `SalesLog`: `{ id, date:string(YYYY-MM-DD), productId:string, qty:number }`
- `AppState`: `{ userLoggedIn: boolean, products: Product[], salesLogs: SalesLog[] }`
- Kunci localStorage: `jagaproduk_state_v1`. Jika data kosong/rusak → fallback ke `DEFAULT_STATE` (lihat `src/config.ts`).

## 7) Aturan validasi/form (ringkas)
- Input pengguna dibersihkan spasi awal/akhir saat submit.
- Username & password wajib diisi login.
- Nama produk wajib.
- Qty penjualan minimal 1.
- Stok/min stok tidak boleh negatif; min stok minimal 1.
- Tanggal memakai input `type="date"` (native). Tampilan tanggal di UI menggunakan format Indonesia (mis. 18 November 2026) via `formatDateId`.
- Error teknis tidak ditampilkan ke pengguna; penyimpanan gagal diabaikan aman (tanpa crash).
- Kesalahan login menampilkan pesan "Username atau password salah" di bawah field.

## 8) Kriteria penerimaan (contoh)
- Sistem menampilkan halaman login di awal; hanya setelah username/password benar yang dapat mengakses sidebar dan halaman utama.
- Sidebar menu terdiri dari: Dashboard, Data Penjualan, Log Penjualan, CRUD Data, Export Data; masing-masing menu menampilkan konten yang sesuai.
- Menambah produk baru muncul di daftar/terpakai di form penjualan dan di perhitungan; perubahan hanya terlihat setelah login berikutnya atau jika session masih valid.
- Menambah log penjualan mengubah forecast setelah ada >=3 hari data berbeda (atau menampilkan “Data kurang” jika < 3).
- Produk dengan stok <= minStock muncul di alert stok minimum.
- Produk dengan expiryDate lewat hari ini muncul di “Sudah kadaluarsa”; <=3 hari muncul di “Mendekati kadaluarsa”.
- Export CSV menghasilkan tiga file dan dapat dibuka di spreadsheet (kolom sesuai).
- Fungsi CRUD: create, read, update, delete produk sukses di lokal; data persisten di localStorage.
- Refresh halaman: data tetap ada (localStorage). Menghapus key manual → aplikasi kembali ke state login + data default contoh tanpa error layar putih.
- Tombol Logout benar-benar mengembalikan aplikasi ke halaman login dan menyembunyikan sidebar.

## 9) Non-fungsional & batasan (sesuai instruksi workshop)
- Web statis React + Vite + TypeScript + Tailwind, tanpa server/DB/API eksternal saat runtime, tanpa API key.
- Tidak ada CDN/importmap/Google Fonts via tag; font dipasang via npm (`@fontsource/plus-jakarta-sans`).
- Struktur: komponen per file, rumus di `src/lib/*`, data bisnis default di `src/config.ts`.
- Siap deploy Netlify: `package.json` script `build` → `dist`, `index.html` di root, `netlify.toml` ada.
- Format default (jika tidak diatur lain): Rupiah `Rp` + titik ribuan tanpa desimal (mis. `Rp50.000`), desimal pakai koma bila ada, tanggal tampil Indonesia.
- Fitur login hanya menggunakan kredensial statis di klien; tidak ada komunikasi dengan server otentikasi luar.

## 10) Metrik keberhasilan (untuk presentasi)
- Contoh dampak: mengurangi kejadian bahan kedaluwarsa terlewat (alert muncul sebelum H-0) dan membantu perencanaan beli harian berbasis rata-rata 7–30 hari data lokal.
- Setiap pengguna memiliki akun terpisah → data tidak saling mencampur.
- Demo menunjukkan alur lengkap dari login → navigasi sidebar → tambah produk → catat penjualan → lihat alert & forecast → export CSV dalam < 3 menit.