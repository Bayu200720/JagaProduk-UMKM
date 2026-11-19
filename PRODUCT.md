# PRODUCT.md — Jaga Produk untuk UMKM Kecil (Kopi/Makanan)

## Ringkasan (dari rencana)
- Tujuan: membantu UMKM kecil (warung kopi/kue rumahan) memantau stok, peringatan stok minimum dan kedaluwarsa, serta prediksi permintaan 7 hari sederhana berbasis data historis lokal (tanpa internet/API saat runtime).
- Ruang lingkup MVP: input produk, log penjualan harian, dashboard alert (stok minimal, mendekati/expired), forecast 7 hari (moving average), saran pembelian sederhana, export CSV. Semua disimpan di `localStorage` (kunci tunggal), web statis siap deploy Netlify.

## Daftar fitur (kode, prioritas, ketergantungan, status)

| Kode | Nama fitur | Prioritas | Ketergantungan | Status |
|------|------------|-----------|----------------|--------|
| F1 | Setup fondasi proyek (Vite+React+TS+Tailwind, struktur, Netlify) | P0 | - | Belum |
| F2 | Konfigurasi data bisnis & penyimpanan lokal (`src/config.ts`, `src/lib/storage.ts`, kunci `jagaproduk_state_v1`) | P0 | F1 | Belum |
| F3 | Input data produk (nama, kategori kopi/bahan/makanan, stok awal, satuan, harga modal opsional, tanggal kadaluarsa opsional sederhana) + validasi | P0 | F2 | Belum |
| F4 | Log penjualan harian (tanggal, produk, qty) + simpan localStorage | P0 | F3 | Belum |
| F5 | Dashboard alert: stok <= stok minimal, mendekati kadaluarsa (<= 3 hari) dan sudah expired | P0 | F3,F4 | Belum |
| F6 | Forecast permintaan 7 hari ke depan per produk (moving average 7–30 hari terakhir), label “data kurang” jika < 3 hari data; saran pembelian sederhana | P1 | F4 | Belum |
| F7 | Ekspor CSV (penjualan, stok, alert) di client | P1 | F3,F4,F5 | Belum |
| F8 | UI/UX responsif, aksesibilitas dasar, format angka/tanggal sesuai aturan | P1 | F3–F7 | Belum |
| F9 | Verifikasi build & deploy Netlify (dist, netlify.toml) | P0 | F1–F8 | Belum |

## Hal ambigu / saling bertentangan / tidak tertulis (perlu konfirmasi)
- Profil Proyek di instruksi belum diisi: nama aplikasi, pengguna utama, kesan visual, warna aksen, sapaan, catatan tim. (Tahap 2 akan menanyakan.)
- Format tanggal/angka: instruksi menyebut default (Rp titik ribuan tanpa desimal, desimal koma, tanggal Indonesia dd Month yyyy di contoh; jam titik). PRD draft rencana menyebut “format angka/rupiah/desimal/jam/tanggal sesuai Bagian 6 instruksi (jika PRD tidak atur, pakai default)”. Perlu ditegaskan: input tanggal pakai format apa di UI (date picker native) dan tampilan tanggal pakai format Indonesia (mis. 18 November 2026)?
- “Tanggal kadaluarsa (opsional per batch atau per item sederhana)”: rencana menyebut sederhana; perlu keputusan: satu tanggal kadaluarsa per produk (paling dekat) atau dukung batch sederhana? (MVP disarankan: satu field tanggal kedaluwarsa per produk/item sederhana.)
- Stok minimal: input per produk (ada di F3). Satuan bebas teks? atau daftar tetap? (Perlu konfirmasi; saran: teks bebas sederhana, contoh “pcs”, “gram”.)
- Forecast: “moving average 7 hari dari log penjualan 7–30 hari terakhir”. Perlu rumus eksplisit: gunakan data N hari terakhir yang ada (max 30), rata-rata = jumlah qty dalam N hari / N (N>=3), hasil dibulatkan bagaimana? (saran: bulatkan ke bilangan terdekat, tampilkan “~X satuan/hari”, saran beli besok = nilai forecast harian dibulatkan.)
- Kategori tetap: kopi/bahan/makanan (dari config contoh). Boleh tambah kategori di runtime? (saran MVP: hanya kategori dari config/dropdown tetap.)
- Harga modal opsional: dipakai di mana? (tidak disebut di fitur inti; mungkin tidak ditampilkan di MVP, simpan saja) — perlu klarifikasi apakah wajib ditampilkan/diolah.
- Export CSV: isi kolom minimal apa? (rencana menyebut “penjualan, stok, alert”). Perlu definisi kolom.
- Tidak ada backend/API: semua offline di browser. Konfirmasi: tidak perlu login, single device/browser.

## Pertanyaan terbuka (untuk pengguna, akan ditanyakan di Tahap 2/3 sesuai alur)
1. Keputusan desain (Tahap 2): kesan visual, warna aksen, sapaan, susunan halaman, posisi aksi utama, gambar (lihat Bagian 7 instruksi). Disarankan: Ramah dan hangat (Plus Jakarta Sans), aksen hijau (emerald), sapaan “Anda”, satu halaman bergulir, aksi utama di akhir konten, tanpa gambar/placeholder sederhana.
2. Konfirmasi MVP scope cepat: setujui F1–F5 sebagai inti demo, F6–F7 sebagai nilai tambah (jika waktu cukup)? (saran: ya, prioritaskan F1–F5 lalu F6,F7.)
3. Definisi kedaluwarsa sederhana: satu tanggal kedaluwarsa per produk (field tunggal) vs batch? (saran: satu tanggal kedaluwarsa per produk untuk MVP.)
4. Format tampilan tanggal di UI: pakai input type="date" (native) lalu tampilkan format Indonesia (contoh 18 November 2026)? (saran: ya.)
5. Satuan produk: input teks bebas (mis. pcs, kg, gram) atau dropdown? (saran: teks bebas.)
