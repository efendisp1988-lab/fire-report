# Panduan Pengguna FIRE-REPORT

Panduan ini ditujukan untuk pengguna yang tidak perlu memahami pemrograman.

## 1. Membuka aplikasi

1. Buka link FIRE-REPORT dari pengelola.
2. Untuk pemakaian pertama, pastikan internet aktif agar seluruh komponen aplikasi dapat dimuat.
3. Jika ingin memasang aplikasi, gunakan pilihan **Tambahkan ke layar utama / Install app** bila tersedia pada browser.

## 2. Membuat akun dan masuk

1. Pada layar masuk, pilih **Daftar pengguna baru**.
2. Buat username dan password minimal 8 karakter.
3. Setelah akun dibuat, masuk menggunakan akun tersebut.

Akun dibuat secara lokal pada browser/perangkat. Pendaftaran tidak membuat akun server dan tidak dapat digunakan otomatis pada perangkat lain.

## 3. Membuat laporan

1. Buka tab **Buat Laporan**.
2. Isi nomor dokumen dan nomor laporan sesuai kebutuhan.
3. Isi status, tanggal, hari, waktu, lokasi, uraian awal kejadian, tindakan penanganan, kondisi, serta koordinat.
4. Gunakan tombol GPS jika ingin mengambil koordinat dari perangkat. Berikan izin lokasi saat diminta.
5. Lampirkan foto sesuai kolom yang tersedia. Periksa pratinjau foto sebelum menyimpan.
6. Isi nama/jabatan petugas dan pihak yang menyetujui bila diperlukan.
7. Tekan **Simpan Laporan**.

Tidak semua kolom harus dianggap wajib kecuali aplikasi menandainya sebagai wajib.

## 4. Melihat dan mengelola laporan

1. Buka tab **Data Laporan**.
2. Gunakan kolom pencarian untuk mencari nomor laporan, lokasi, atau uraian.
3. Gunakan **Edit** untuk memperbarui laporan.
4. Gunakan **Hapus** hanya jika yakin laporan tersebut tidak diperlukan lagi.

## 5. Mengunduh laporan

- **PDF:** tekan tombol PDF pada laporan. Browser akan membuka halaman cetak; pilih **Simpan sebagai PDF** pada pilihan printer.
- **Word:** tekan tombol Word. Pastikan pustaka ekspor Word telah berhasil dimuat pada perangkat.
- **CSV:** gunakan tombol Export CSV pada tab Data Laporan untuk mengunduh ringkasan data.

Periksa kembali hasil ekspor sebelum digunakan sebagai dokumen resmi.

## 6. Backup dan pemulihan

**Membuat backup**
1. Buka tab **Backup**.
2. Tekan **Download Backup Data (JSON)**.
3. Simpan file di tempat aman, misalnya penyimpanan perangkat atau media cadangan lain.

**Memulihkan backup**
1. Masuk ke akun lokal yang akan menerima data.
2. Buka tab **Backup**.
3. Pilih file backup JSON FIRE-REPORT.
4. Setujui proses pemulihan setelah membaca konfirmasi.

Pemulihan menambahkan laporan ke akun saat ini dan tidak dimaksudkan sebagai sinkronisasi otomatis.

## 7. Penggunaan offline

1. Buka aplikasi saat online terlebih dahulu.
2. Tunggu hingga halaman dan komponen aplikasi selesai dimuat.
3. Jika tersedia, pasang aplikasi ke layar utama.
4. Tutup aplikasi, aktifkan mode pesawat, lalu buka kembali.
5. Uji membuat laporan percobaan, menyimpan, membuka daftar laporan, dan ekspor.

Jika fitur tertentu tidak bekerja offline, sambungkan kembali internet dan muat ulang aplikasi. Khusus ekspor Word, pengujian offline wajib dilakukan karena pustaka Word berasal dari CDN dan disimpan dalam cache browser.

## 8. Hal yang wajib diingat

- Data hanya berada di browser/perangkat tempat data dibuat.
- Jangan menghapus data situs/browser sebelum membuat backup.
- Backup secara rutin, terutama sebelum mengganti perangkat atau browser.
- Jangan membagikan perangkat yang sudah login kepada orang yang tidak berwenang.
- Untuk laporan resmi, ikuti prosedur dan persetujuan perusahaan masing-masing.
