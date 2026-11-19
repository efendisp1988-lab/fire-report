# Panduan Pengembang FIRE-REPORT

Dokumen ini memberi gambaran awal agar pengembang lain dapat memahami dan melanjutkan proyek.

## Teknologi yang digunakan

- HTML untuk struktur halaman.
- CSS untuk tampilan.
- JavaScript sisi browser untuk fungsi aplikasi.
- IndexedDB untuk menyimpan data laporan secara lokal.
- localStorage untuk menyimpan akun lokal dan identitas perusahaan.
- Web App Manifest dan Service Worker untuk instalasi PWA serta cache offline.
- Pustaka `docx` versi 9.15.1 dari CDN untuk menghasilkan dokumen Word.

## Berkas penting

| Berkas | Kegunaan |
| --- | --- |
| `index.html` | Struktur halaman, formulir, dan pemanggilan skrip |
| `assets/css/style.css` | Gaya visual |
| `assets/js/app.js` | Proses login lokal, data laporan, ekspor, backup, dan pemulihan |
| `manifest.json` | Nama, ikon, dan perilaku instalasi PWA |
| `service-worker.js` | Cache aplikasi dan pustaka Word |
| `assets/` | Gambar, ikon, dan sumber daya visual |

## Cara menjalankan untuk pengujian

Karena aplikasi memakai Service Worker, IndexedDB, dan fitur browser modern, jalankan melalui server lokal atau hosting HTTPS. Membuka berkas HTML langsung dari file manager tidak mewakili lingkungan penggunaan sebenarnya.

Setelah perubahan:
1. Buka aplikasi melalui alamat HTTPS atau server lokal.
2. Periksa Console browser jika ada kesalahan.
3. Uji pembuatan akun dan login.
4. Uji simpan, daftar, cari, edit, dan hapus laporan.
5. Uji foto dan GPS pada perangkat yang mendukung.
6. Uji ekspor PDF, Word, CSV.
7. Uji backup dan pemulihan.
8. Uji instalasi PWA dan mode pesawat setelah cache terbentuk.

## Catatan keamanan dan batasan saat ini

- Akun dan autentikasi disimpan di perangkat, bukan di server.
- Fungsi hash password memiliki fallback hash sederhana ketika Web Crypto tidak tersedia. Jangan memposisikan mekanisme ini sebagai autentikasi kuat untuk data sensitif atau lingkungan multi-pengguna yang memerlukan kontrol akses terpusat.
- Data laporan disimpan di IndexedDB lokal dan tidak dienkripsi oleh aplikasi.
- Data tidak otomatis disinkronkan atau dicadangkan.
- Jangan menambahkan API key, kata sandi, token, data pribadi, atau rahasia perusahaan ke repository publik.
- Sebelum aplikasi dipakai untuk data sensitif, lakukan penilaian keamanan dan privasi terpisah.

## Ketergantungan eksternal dan lisensi aset

- Pustaka `docx` versi 9.15.1 dimuat dari `https://unpkg.com/docx@9.15.1/dist/index.iife.js`. Periksa lisensi dan pemberitahuan pustaka tersebut sebelum distribusi paket yang menggabungkannya.
- Audit seluruh gambar, ikon, foto, logo, font, dan aset di folder `assets/`. Jangan menganggap aset tersebut otomatis berada di bawah MIT.
- MIT License pada repository ini hanya dimaksudkan untuk kode dan dokumentasi asli yang haknya dimiliki oleh pemegang hak cipta proyek; materi pihak ketiga tetap tunduk pada lisensinya sendiri.

## Rilis dan perubahan

- Lakukan perubahan sekecil mungkin dan hindari mengubah fungsi yang sudah stabil tanpa kebutuhan.
- Perbarui cache version pada service worker ketika aset inti berubah agar perangkat menerima versi baru.
- Uji instalasi baru dan pembaruan aplikasi yang sudah pernah dipasang.
- Catat perubahan penting dan hasil pengujian pada catatan rilis.
- Jangan menyatakan suatu fitur sepenuhnya offline sebelum diuji pada perangkat sasaran dalam mode pesawat.

