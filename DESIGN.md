# DESIGN.md — Keputusan desain (Jaga Produk UMKM)

## Sumber
- Berdasarkan Bagian 7 “System Instructions Prototipe Aplikasi Web.md”.
- Keputusan di bawah adalah pilihan default yang disarankan untuk hackathon (UMKM kopi/kue, nada ramah-hangat) dan dicatat agar konsisten. Jika pengguna ingin mengubah, perbarui file ini.

## Keputusan (Tahap 2)
- Nama aplikasi: Jaga Produk UMKM (sementara, bisa diubah)
- Pengguna utama: pemilik/penjaga warung kopi dan UMKM makanan kecil (skala rumahan/toko kecil)
- Kesan visual: **Ramah dan hangat** (font: Plus Jakarta Sans, via `@fontsource/plus-jakarta-sans`, bobot 400/500/600)
- Warna aksen: **hijau** (`emerald`) — tombol utama `bg-emerald-700` hover `bg-emerald-800`, teks aksen `text-emerald-700`, elemen terpilih garis aksen + `bg-emerald-50`, fokus `focus-visible` aksen 2px jarak 2px
- Sapaan: **Anda**
- Susunan halaman: **Satu halaman bergulir** (scroll)
- Posisi aksi utama: **Di akhir konten** (form/aksi utama diletakkan di bagian bawah setiap blok relevan; tidak pakai bar menempel bawah layar untuk MVP)
- Gambar: **Tanpa gambar** (hindari placeholder yang tidak perlu)

## Gaya tetap (ringkas)
- Latar halaman `bg-neutral-50`; kartu/panel `bg-white`.
- Pemisah permukaan pakai beda warna; garis tepi `border-neutral-200` hanya untuk input, tabel, pemisah.
- Tidak menaruh kartu di dalam kartu.
- Sudut: kartu/panel `rounded-2xl`, tombol/input `rounded-xl`, badge `rounded-full`.
- Bayangan hanya elemen melayang: `shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]`.
- Spasi hanya skala Tailwind 1,2,3,4,6,8,12.
- Warna teks: utama `text-neutral-900`, pendukung `text-neutral-600`, placeholder `text-neutral-500`.
- Status: hijau (berhasil), merah (gagal/error), amber (peringatan), netral (info) — selalu dengan label teks dan ikon sederhana jika ada.
- Tipografi: satu font (Plus Jakarta Sans), ukuran minimal 14px, input minimal 16px, angka pakai `tabular-nums`.

## Catatan tim (maks 3)
1. MVP fokus demo hackathon: input produk, log penjualan, alert, forecast sederhana, export CSV.
2. Semua data lokal (`localStorage`, kunci `jagaproduk_state_v1`), tanpa backend/API eksternal saat runtime.
3. Format angka/tanggal mengikuti default Bagian 6 instruksi kecuali disebut lain di PRD.
