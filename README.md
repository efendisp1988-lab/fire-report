# FIRE-REPORT

**Offline-first Hotspot Verification & Fire Incident Reporting**

FIRE-REPORT adalah aplikasi web progresif (PWA) untuk membantu pencatatan dan dokumentasi verifikasi hotspot serta kejadian kebakaran hutan dan lahan.

## Tujuan proyek

Aplikasi ini dikembangkan agar dapat digunakan secara mandiri, mudah dipelajari, dan dapat dikembangkan oleh komunitas. Semboyan proyek:

> **Bukan tentang siapa yang membuat, tetapi seberapa luas manfaat yang bisa diberikan.**

## Fitur utama

- Login dan pendaftaran akun lokal pada perangkat.
- Formulir laporan kejadian kebakaran.
- Pencatatan lokasi dan koordinat GPS (memerlukan izin lokasi perangkat).
- Lampiran foto dokumentasi.
- Daftar, pencarian, ubah, dan hapus laporan.
- Ekspor laporan ke PDF melalui fitur cetak browser.
- Ekspor laporan ke Word (.docx).
- Ekspor data CSV.
- Backup dan pemulihan data melalui berkas JSON.
- Identitas perusahaan yang dapat diatur oleh pengguna.
- Penyimpanan data laporan pada browser/perangkat menggunakan IndexedDB.
- Dukungan instalasi PWA dan penggunaan offline setelah aset aplikasi berhasil tersimpan di perangkat.

## Mulai menggunakan

1. Buka link aplikasi yang dibagikan oleh pengelola hosting.
2. Pada penggunaan pertama, buat akun melalui tautan **Daftar pengguna baru**.
3. Masuk menggunakan akun tersebut.
4. Isi laporan dan simpan.
5. Buka menu **Backup** secara berkala dan simpan berkas cadangan di tempat yang aman.
6. Untuk menggunakan secara offline, buka aplikasi saat online terlebih dahulu dan tunggu sampai aplikasi selesai dimuat/terpasang. Setelah itu uji kembali dengan memutus koneksi internet.

## Penting diketahui

- Data disimpan lokal pada browser dan perangkat yang digunakan. Data tidak otomatis tersinkron ke perangkat lain atau ke server.
- Menghapus data browser, mengganti browser, atau mengganti perangkat dapat menyebabkan data lokal tidak tersedia. Buat backup JSON secara berkala.
- Akun lokal bukan sistem autentikasi server dan tidak boleh dianggap sebagai perlindungan setara sistem perusahaan/enterprise.
- Fitur GPS membutuhkan perangkat yang mendukung lokasi dan izin pengguna.
- Ekspor Word menggunakan pustaka `docx` versi 9.15.1 yang dimuat dari CDN dan dicoba disimpan oleh service worker untuk pemakaian offline. Karena itu, ekspor Word harus diuji pada perangkat dan browser sasaran setelah instalasi pertama.
- Ketersediaan link aplikasi bergantung pada penyedia hosting. Source code di repository ini dapat dipindahkan ke penyedia hosting lain yang mendukung berkas statis dan HTTPS.

## Struktur berkas utama

- `index.html` — halaman dan struktur antarmuka.
- `assets/css/style.css` — tampilan aplikasi.
- `assets/js/app.js` — logika aplikasi.
- `manifest.json` — pengaturan instalasi PWA.
- `service-worker.js` — penyimpanan aset untuk penggunaan offline.
- `docs/` — panduan pengguna dan pengembang.
- `LICENSE` — lisensi MIT untuk materi proyek yang memang dimiliki dan dilisensikan oleh proyek ini.

## Lisensi dan aset pihak ketiga

Kode dan dokumentasi asli proyek yang haknya dimiliki oleh pemegang hak cipta proyek dilisensikan berdasarkan MIT License. Pemberitahuan lisensi harus dipertahankan saat mendistribusikan salinan atau bagian substansial dari materi yang dilisensikan.

**Pengecualian:** pustaka pihak ketiga, logo/merek perusahaan, foto, gambar, font, dan aset lain yang berasal dari pihak lain tidak otomatis dilisensikan dengan MIT. Hak dan ketentuan masing-masing pemilik tetap berlaku. Periksa folder aset dan sumber setiap berkas sebelum menggunakannya di luar konteks proyek.

## Kontribusi

Perbaikan dan pengembangan dapat dilakukan dengan menyalin repository, menguji perubahan, lalu mengajukan perubahan untuk ditinjau. Sebelum rilis, uji minimal login, simpan/buka/edit/hapus laporan, foto, ekspor PDF/Word/CSV, backup/pemulihan, serta mode offline.

