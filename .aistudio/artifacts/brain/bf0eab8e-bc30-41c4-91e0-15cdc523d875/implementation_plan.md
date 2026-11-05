# Rencana Pengembangan Tampilan & Fitur Berbagi Warta / Firman Tuhan

Rencana ini mencakup pembaruan desain visual website **GEPEKRIS Tretes** menjadi bergaya majalah rohani modern (*Warm Editorial Sanctuary*) serta penambahan fitur penulisan dan pembagian **Warta Jemaat & Tulisan Firman Tuhan** yang terintegrasi penuh dengan **Firebase Firestore** dan **Admin Panel**.

---

## 1. Pengembangan Struktur Data & Firebase (`ChurchContentContext.tsx` & `firebase-blueprint.json`)
- **Dukungan Ayat Firman pada Artikel/Warta (`ChurchEventItem`)**:
  - Menambahkan properti opsional `bibleVerse` (contoh: *"Mazmur 23:1-3"*) dan `bibleQuote` (teks kutipan ayat firman Tuhan) pada setiap item Warta / Tulisan Firman Tuhan.
  - Menambahkan artikel bawaan bertema **Renungan & Firman Tuhan** agar halaman langsung menampilkan contoh tulisan renungan rohani yang indah.
- **Data Banner Ayat Firman Harian (`ChurchDailyVerse`)**:
  - Menambahkan objek `dailyVerse` di dalam konten utama gereja yang berisi `verseReference` (pasal & ayat), `verseText` (isi firman), `reflectionNote` (kalimat perenungan singkat), dan `updatedDate`.
  - Seluruh perubahan pada Ayat Harian maupun Tulisan Firman otomatis tersinkronisasi secara *real-time* ke Firebase Firestore (`church_content/main`).

---

## 2. Perbaikan Tampilan Utama (Visual & UI Upgrade)
- **Header Transparan Modern (`Header.tsx`)**:
  - Menggunakan efek *frosted glassmorphism* (`backdrop-blur-md bg-white/90`) dengan aksen tipografi serif pada identitas gereja, indikator navigasi yang halus, serta tombol pintas menuju **Warta & Firman** dan **Persembahan**.
- **Banner Ayat Firman Harian (`DailyVerseBanner.tsx`)**:
  - Seksi elegan berlatar hangat (*warm stone & gold gradient*) yang menampilkan **Ayat Firman Hari Ini** beserta renungan singkatnya.
  - Dilengkapi tombol **Bagikan Ayat (WhatsApp, Facebook, Telegram, Salin Teks)** dan tombol pintas **Edit Ayat Harian** khusus Admin.
- **Kartu Warta & Tulisan Firman Bergaya Majalah (`Events.tsx`)**:
  - Menampilkan **Foto Sampul (Cover Thumbnail)** beresolusi tajam dengan efek *hover zoom* halus dan lencana kategori.
  - Menyediakan **Tab Filter Cepat** di halaman utama: *Semua*, *Renungan & Firman Tuhan*, *Warta Jemaat*, *Ibadah Khusus*, dan *Diakonia & Kasih*.
  - Menampilkan kutipan **Ayat Alkitab Acuan** langsung di dalam kartu untuk tulisan Firman Tuhan, serta tipografi judul bergaya editorial (`font-serif-display`).
- **Tombol Cepat WhatsApp Mengambang (`App.tsx`)**:
  - Menambahkan tombol mengambang (*floating button*) WhatsApp Sekretariat di sudut kanan bawah layar agar jemaat atau tamu baru dapat langsung menghubungi gereja dengan satu sentuhan.

---

## 3. Fitur Berbagi Lengkap (WhatsApp, Facebook, Telegram & Salin Link)
- **Komponen & Fungsi Berbagi Terpadu (`Events.tsx` & `NewsBlogReader.tsx`)**:
  - **Bagikan ke WhatsApp Otomatis**: Menyusun pesan terformat rapi berisi **Judul Tulisan/Warta**, **Kutipan Ayat Alkitab** (jika ada), **Ringkasan Singkat**, dan **Tautan Langsung (`#berita/:id`)** menuju artikel tersebut.
  - **Bagikan ke Facebook & Telegram**: Membuka jendela berbagi resmi Facebook (`sharer.php`) dan Telegram (`t.me/share/url`) lengkap dengan teks pengantar dan tautan artikel.
  - **Salin Link & Teks Lengkap**: Menyalin tautan langsung atau paket teks renungan ke papan klip (*clipboard*) dengan umpan balik instan (*Tersalin!*).
  - Tersedia baik **langsung pada kartu di halaman depan** maupun **di dalam halaman pembaca artikel (`NewsBlogReader`)**.

---

## 4. Pembaruan Panel Admin (`ContentManagerModal.tsx`)
- **Pengaturan Ayat Firman Harian**:
  - Menambahkan bagian khusus untuk mengubah **Ayat Firman Hari Ini** (Pasal/Ayat, Isi Ayat, dan Kalimat Perenungan Singkat) yang langsung memperbarui banner di beranda.
- **Formulir Penulisan Firman Tuhan & Warta Jemaat**:
  - Menambahkan kategori **Renungan & Firman Tuhan** dan **Pengajaran Alkitab** pada tab *Warta & Kegiatan*.
  - Menambahkan kolom input **Ayat Alkitab Acuan** (misal: *Yohanes 15:5*) dan **Kutipan Teks Ayat** saat menambah atau mengedit tulisan, sehingga pengurus/gembala dapat dengan mudah menerbitkan renungan maupun warta mingguan.
