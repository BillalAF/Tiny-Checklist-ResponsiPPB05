# Arah desain Tenggat

Dial: ENERGY 2 / RHYTHM 2 / MOTION 1.

Pembacaan: aplikasi pencatat tugas untuk mahasiswa, bergaya buku catatan kertas, tenang dan jelas, tanpa animasi selain transisi hover.

## Keputusan dan alasannya

- Palet: kertas krem, tinta biru tua, satu aksen terakota. Kertas membuat aplikasi terasa seperti buku tugas, bukan dashboard. Mode gelap memakai warna turunan yang sama, dan pengguna bisa memilih terang, gelap, atau ikut perangkat.
- Aksen terakota hanya dipakai untuk tenggat yang lewat atau jatuh hari ini, tombol hapus, penanda menu aktif, dan fokus keyboard. Aksen sengaja langka supaya tenggat mendesak langsung terlihat.
- Huruf judul memakai serif bawaan sistem (Iowan Old Style, Palatino, Georgia), isi memakai sans bawaan sistem. Alasannya nuansa buku catatan dan tidak perlu mengunduh font, jadi tetap cepat saat offline.
- Motif identitas: "tab tanggal" di sisi kiri tiap tugas (angka hari besar dengan bulan singkat). Tab ini membawa informasi tenggat, bukan hiasan.
- Tombol utama berwarna tinta, bukan aksen, agar aksen tidak muncul di semua tempat.
- Radius kecil (4 sampai 6px) dan tanpa bayangan. Pemisah memakai garis, karena tidak ada elemen yang perlu tampak melayang.
- Ikon dari lucide-react hanya untuk aksi yang jelas maknanya (tambah, ubah, hapus, pasang, offline). Alasannya modul praktikum memakai pustaka yang sama. Navigasi utama berupa teks saja.
- Tata letak halaman berbeda sesuai isi: Beranda satu fokus besar lalu ringkasan teks, Tugas daftar kartu dengan kontrol, Agenda daftar grup tanpa kartu, Profil definisi dan bagian bertumpuk.
- Navigasi: tab bawah di ponsel (mudah dijangkau jempol), tautan atas di layar lebar.
- Ikon aplikasi: huruf T geometris sederhana sebagai penanda sementara. Ganti `public/icon*.png` dan `public/icon.svg` bila sudah punya logo sendiri.
