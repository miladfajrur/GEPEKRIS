# Website GEPEKRIS Tretes (Gereja Persekutuan Kristen Tretes)

Website resmi Gereja Persekutuan Kristen (GEPEKRIS) Tretes, Prigen, Pasuruan, Jawa Timur. Dilengkapi dengan CMS Admin terintegrasi, pembaca warta berita ala blogspot 2 kolom, dan sistem sinkronisasi otomatis ke direktori server hosting pribadi (cPanel / PHP).

---

## 🚀 Panduan Cepat Deploy ke cPanel Hosting

Proyek ini sudah dikonfigurasi **Zero-Config (Tinggal Deploy)**. Semua file PHP API, konfigurasi `.htaccess`, dan struktur data sudah disertakan di dalam folder `public/`.

### Cara 1: Deploy Hasil Build (Paling Mudah)

1. **Jalankan Build di Komputer / Terminal Anda**:
   ```bash
   npm install
   npm run build
   ```
2. Seluruh file website yang siap tayang akan berada di dalam folder **`dist/`**.
3. Buka **cPanel File Manager** hosting Anda, lalu masuk ke direktori **`public_html/`**.
4. Unggah seluruh isi folder `dist/` ke dalam `public_html/`.
   - Pastikan file `.htaccess` dan folder `api/content.php` ikut terunggah.
5. Buat folder bernama **`data/`** di dalam `public_html/` (Permission: `0755` atau `0777`).

Website Anda kini **100% langsung aktif** dan otomatis membaca serta menyimpan warta dari server hosting Anda sendiri tanpa perlu konfigurasi ulang!

---

### Cara 2: Deploy Otomatis via GitHub Actions / CI-CD

Jika Anda menghubungkan repository GitHub ini ke hosting via Git / CI-CD:
1. Jalankan `npm run build`.
2. Arahkan direktori publik web server / DocumentRoot ke folder `dist` (atau pindahkan isi `dist` ke `public_html`).

---

## 🔐 Akses Admin CMS Gereja

- **Shortcut Masuk Admin**: Tekan `Ctrl + Shift + A` di keyboard saat membuka website (atau klik ikon gembok di bagian paling bawah footer).
- **Password Default**: `admin123` (dapat diubah kapan saja di menu Admin CMS).
- **API Secret Default**: `gepekristretes2025`

---

## 📰 Fitur Unggulan

1. **Warta Berita 2 Kolom (Blogspot Style)**:
   - Sidebar navigasi daftar warta jemaat dengan filter kategori (Ibadah Khusus, Retret, Diakonia, dll).
   - Lembar baca artikel penuh yang nyaman dibaca jemaat.
   - Tombol berbagi ke WhatsApp satu klik & copy link anchor.
2. **Koneksi Hosting Permanen**:
   - Data otomatis tersimpan ke `public_html/data/church_content.json` di server hosting Anda.
   - Semua jemaat yang membuka website langsung melihat data terbaru dari server.
3. **Responsive Mobile & Desktop**:
   - Tampilan ramah ponsel Android/iPhone untuk memudahkan jemaat lanjut usia maupun remaja.
