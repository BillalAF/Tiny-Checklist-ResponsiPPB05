# Tenggat

PWA pencatat tugas kuliah. Dibuat untuk praktikum PPB oleh Billal Ardi Firangga (NIM 21120124140128, Kelompok 09).

## Teknologi

Sama dengan modul praktikum: Vite, React 19, Tailwind CSS 4, vite-plugin-pwa (Workbox), lucide-react, dan oxlint. Data disimpan lebih dulu di `localStorage` (offline-first) lalu disinkronkan ke Supabase (Postgres) lewat `@supabase/supabase-js`. Tanpa variabel Supabase, aplikasi tetap jalan dalam mode lokal saja.

## Halaman

| Alamat | Isi |
| --- | --- |
| `#/` | Beranda: tugas belum selesai, urut dari prioritas tertinggi lalu tenggat terdekat |
| `#/tugas` | Tugas: CRUD (tambah, lihat, ubah, hapus), cari, filter, centang selesai |
| `#/tugas/baru` | Tautan langsung yang membuka form tambah tugas |
| `#/agenda` | Agenda: tugas belum selesai dikelompokkan menurut jarak tenggat |
| `#/profil` | Profil: nama, NIM, kelompok, tema, akun dan sinkronisasi, pasang aplikasi, hapus data |
| (otomatis) | Login: tampil bila Supabase aktif dan belum masuk (opsi A) |

## Menjalankan

```bash
npm install
npm run dev       # pengembangan
npm run build     # hasil produksi ke dist/
npm run preview   # coba hasil build di http://localhost:4173
npm run lint
```

## Supabase

1. Di Supabase > SQL Editor, jalankan `tenggat-schema.sql` (file terpisah, bukan di dalam zip ini). Pilih opsi A (login) atau opsi B (tanpa login) di dalam file itu.
2. Salin `.env.example` menjadi `.env`, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari Project Settings > API.
3. Opsi A: biarkan `VITE_REQUIRE_LOGIN=true`. Opsi B: ubah menjadi `false`.
4. Opsi A: di Authentication > Providers pastikan Email aktif. Isi Site URL di Authentication > URL Configuration dengan alamat Vercel Anda.

### Cara kerja sinkronisasi

- Layar selalu membaca dan menulis ke `localStorage`, jadi semua fitur CRUD jalan saat offline.
- Setiap tambah, ubah, centang, dan hapus ditandai belum terkirim. Tanda itu dikirim ke Supabase saat online, setelah tombol Sinkronkan sekarang ditekan, atau otomatis tiap 30 detik selama masih ada yang tertunda.
- Setelah mengirim, aplikasi mengambil data terbaru dari server. Perubahan lokal yang belum terkirim selalu menang atas data server. Tugas yang dihapus dari perangkat lain ikut hilang di sini.
- Data lokal disimpan per akun, jadi pergantian akun di satu perangkat tidak mencampur tugas.

## Mengubah data profil

Edit objek `PROFILE` di `src/pages/Profile.jsx`.

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Di Vercel pilih Add New Project lalu import repository tersebut.
3. Framework akan terdeteksi sebagai Vite. Build command `npm run build`, output directory `dist`, tidak perlu diubah.
4. Buka Environment Variables lalu isi `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, dan `VITE_REQUIRE_LOGIN`. Variabel ini dibaca saat build, jadi jalankan Redeploy setelah mengisinya.
5. Klik Deploy.

Alternatif lewat CLI: `npx vercel` lalu `npx vercel --prod`.

## Menguji PWA

PWA hanya aktif pada build produksi (`npm run build` lalu `npm run preview`) atau setelah di-deploy lewat HTTPS.

1. Buka di Chrome atau Edge, lalu cek ikon pasang di address bar atau tombol Pasang aplikasi di halaman Profil.
2. Buka DevTools, tab Application, pastikan Manifest terbaca dan Service Worker berstatus activated.
3. Uji offline: centang Offline di tab Network (atau matikan internet), lalu muat ulang. Aplikasi tetap terbuka dan data tugas tetap ada.
