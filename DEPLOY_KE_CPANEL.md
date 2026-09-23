# 🚀 Panduan Cepat & Mudah: Deploy dari GitHub ke Hosting cPanel

Project ini sudah dikonfigurasi secara lengkap agar dapat langsung di-deploy ke hosting cPanel melalui GitHub dengan mudah.

---

## ⚡ METODE 1: Paling Cepat & Mudah (Fitur Git™ Version Control di cPanel)

cPanel memiliki fitur bawaan untuk langsung meng-import repository dari GitHub. File konfigurasi `.cpanel.yml` dan folder hasil build `dist/` sudah otomatis disiapkan di project ini!

### Langkah-langkah:
1. **Push project ini ke GitHub:**
   - Buat repository baru di GitHub Anda (misal: `gepekris-tretes-web`).
   - Push seluruh isi folder ini ke repository GitHub tersebut.

2. **Login ke cPanel Hosting Anda:**
   - Masuk ke dashboard cPanel (contoh: `https://domainanda.com:2083`).

3. **Buka menu "Git™ Version Control":**
   - Cari dan klik ikon **Git™ Version Control** di cPanel.
   - Klik tombol biru **Create**.

4. **Isi Pengaturan Repository:**
   - **Clone URL:** Masukkan URL clone GitHub Anda (contoh: `https://github.com/username/gepekris-tretes-web.git`).
   - **Repository Path:** Ketik `repositories/gepekris` (atau biarkan default).
   - **Repository Name:** `gepekris`
   - Klik **Create**.

5. **Deploy ke public_html:**
   - Setelah clone selesai, klik **Manage** pada repository yang baru dibuat.
   - Buka tab **Deploy HEAD Commit**.
   - Klik tombol **Deploy HEAD Commit**.
   - File `.cpanel.yml` yang sudah terpasang akan **otomatis menyalin seluruh website ke `public_html/`** dan mengatur izin folder data ke 755!

*(Ke depan, setiap kali Anda update kode di GitHub, Anda cukup klik tombol **Update from Remote** lalu **Deploy HEAD Commit** di cPanel. Website langsung terupdate tanpa perlu upload ulang!)*

---

## 📦 METODE 2: Upload File ZIP (Tanpa Sambungkan Git)

Jika Anda tidak ingin menyambungkan akun Git di cPanel:
1. Di repository GitHub Anda atau di folder project ini, buka file **`cpanel_deploy.zip`** (tersedia di folder `public/cpanel_deploy.zip`).
2. Login ke cPanel &rarr; buka **File Manager** &rarr; masuk ke **`public_html/`**.
3. Upload **`cpanel_deploy.zip`**, lalu klik kanan dan pilih **Extract**.
4. Selesai!

---

## 🤖 METODE 3: Otomatisasi CI/CD (GitHub Actions)

Jika Anda ingin website otomatis ter-deploy setiap kali melakukan `git push` ke GitHub:
1. File workflow sudah terpasang di `.github/workflows/deploy.yml`.
2. Di repository GitHub Anda, buka tab **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
3. Tambahkan 3 Secret FTP cPanel Anda:
   - `CPANEL_FTP_SERVER`: Alamat server FTP/Domain (contoh: `ftp.domainanda.com`)
   - `CPANEL_FTP_USERNAME`: Username FTP cPanel Anda
   - `CPANEL_FTP_PASSWORD`: Password cPanel / FTP Anda
4. Setiap kali Anda melakukan `git push`, GitHub akan otomatis meng-compile dan meng-upload file ke cPanel Anda!
