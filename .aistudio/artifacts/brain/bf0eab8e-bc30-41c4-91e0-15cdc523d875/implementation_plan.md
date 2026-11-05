# Penyempurnaan Portal & Admin CMS GEPEKRIS Tretes Siap Pakai

Rencana ini menyempurnakan aplikasi web resmi GEPEKRIS Tretes menjadi portal gereja yang siap pakai secara menyeluruh dalam Bahasa Indonesia, dilengkapi sistem pengelolaan konten (CMS) real-time berbasis Cloud Firestore yang rapi serta tombol pintas edit kontekstual langsung pada setiap seksi halaman.

## User Review & Critical Decisions

> [!IMPORTANT]
> Berikut adalah keputusan utama yang telah dikonfirmasi dan akan diterapkan pada pembaruan ini:

- **Keputusan Terkonfirmasi 1 (Cakupan Editor Admin Panel)**: Menambahkan pengelolaan penuh untuk **Info Persembahan (Rekening Bank, QRIS, dan Alokasi Dana)** serta **Tautan Sosial Media (Facebook, Instagram, YouTube, WhatsApp) & Live Streaming YouTube** ke dalam Admin Panel CMS, melengkapi seluruh tab yang sudah ada (Profil Gereja, Hero Banner, Tentang Kami, Jadwal Ibadah, Pelayanan & Komisi, Warta & Berita, serta Galeri Dokumentasi).
- **Keputusan Terkonfirmasi 2 (Penyelarasan Bahasa)**: Mengubah seluruh antarmuka halaman utama, bagian khusus (Khotbah, Persembahan, Ruang Doa), serta seluruh jendela modal (Rencana Kunjungan, Live Streaming, dan Kontak) menjadi **Bahasa Indonesia penuh** yang hangat dan sopan.
- **Keputusan Terkonfirmasi 3 (Pengalaman Edit Cepat Admin)**: Menambahkan **tombol pintas "Edit Seksi Ini"** pada setiap bagian halaman (Hero, Jadwal Ibadah, Tentang Kami, Pelayanan, Warta, Galeri, Persembahan, dan Kontak/Footer) yang otomatis muncul saat mode Admin aktif dan langsung membuka tab editor terkait di dalam Admin Panel.

---

## 1. Overview & Core Concept

- **What It Does**: Menyediakan portal informasi jemaat dan pengunjung gereja yang lengkap (Jadwal Ibadah, Warta Jemaat bergaya blog, Galeri Dokumentasi, Persembahan Digital QRIS/Bank, Ruang Doa Bersama, dan Arsip Khotbah) di mana seluruh teks, gambar, tautan streaming, dan nomor rekening dapat diubah secara instan tanpa menyentuh kode.
- **Target Audience / Persona**: Majelis dan sekretariat gereja yang membutuhkan panel admin yang mudah, terstruktur, dan rapi untuk memperbarui informasi mingguan, serta jemaat lintas usia yang mengakses informasi ibadah dari perangkat ponsel maupun desktop.
- **Key Value**: Pengelolaan mandiri 100% dari menu panel dengan sinkronisasi real-time Cloud Firestore, bebas teks bahasa Inggris yang belum diterjemahkan, dan navigasi pengeditan satu klik langsung dari bagian halaman yang sedang dilihat.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Alur Pengunjung & Jemaat**: Membuka beranda berbahasa Indonesia penuh -> melihat jadwal ibadah & pengumuman utama -> membuka detail warta kegiatan, menonton live streaming YouTube gereja, menyalin nomor rekening persembahan/scan QRIS, atau mendaftarkan rencana kunjungan ibadah.
  2. **Alur Edit Kontekstual Admin**: Admin masuk melalui panel login -> saat menjelajahi halaman beranda, setiap seksi menampilkan tombol pintas kontekstual (misalnya *"Edit Hero"*, *"Edit Jadwal"*, *"Edit Persembahan"*, *"Edit Sosial Media & Kontak"*) -> klik tombol langsung membuka Admin Panel tepat pada tab yang bersangkutan.
  3. **Alur Pengelolaan Persembahan & Streaming di CMS**: Admin membuka tab **Persembahan & QRIS** di Admin Panel -> memperbarui daftar rekening bank gereja (nama bank, nomor rekening, atas nama), mengganti gambar/data QRIS, serta mengatur kategori alokasi persembahan -> perubahan langsung tampil di seksi Persembahan secara real-time.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Warm Sanctuary Editorial — memadukan ketenangan ruang ibadah dengan tata letak bersih, terstruktur, dan mudah dibaca bagi semua kalangan usia.
  - *Color Palette & Mood*: Kanvas netral hangat (`#FAF8F5` & `#FFFFFF` untuk 60% permukaan utama), permukaan struktural batu hangat (`stone-100` hingga `stone-900` untuk 30% kartu dan footer), serta aksen emas amber (`amber-700` / `amber-800` untuk 10% tombol aksi utama dan penanda aktif).
  - *Typography & Hierarchy*: Kombinasi huruf judul berkarakter tegas dan hangat dengan teks isi yang nyaman dibaca pada ukuran `15px–16px`, serta angka tabular (`tabular-nums`) untuk jam ibadah, tanggal, dan nominal persembahan.
  - *Component Styling & Layout*: Tata letak kontainer proporsional (maksimal `1280px`), batas kartu halus (`1px solid`), pengelompokan formulir di dalam Admin Panel menggunakan kartu bersekat bersih dengan label jelas dan petunjuk pengisian singkat.
- **Interactive Feedback & Motion**: Transisi tab halus (`<= 200ms`), indikator status penyimpanan real-time ke Firebase Firestore, tombol salin nomor rekening dengan umpan balik instan (*"Tersalin"*), dan pratinjau langsung untuk gambar/QRIS.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Navigasi Pintas Kontekstual ("Direct-to-Tab Section Editing")**
  - *Chosen Approach*: Menyediakan state tab aktif yang dikontrol dari level aplikasi utama sehingga setiap seksi halaman memiliki tombol pintas *"Edit Seksi"* (hanya tampil saat `isAdmin === true`) yang langsung membuka `ContentManagerModal` pada tab terkait.
  - *Why*: Memangkas waktu pencarian menu bagi pengurus sekretariat; admin cukup melihat bagian yang ingin diubah di layar lalu klik tombol edit di sudut seksi tersebut.
  - *Alternatives Considered*: Inline text-editing langsung di atas DOM halaman, namun pendekatan tersebut rentan merusak tata letak responsif pada layar ponsel dan menyulitkan validasi gambar/tautan.
- **Decision 2: Skema Data Terpadu di Cloud Firestore (`church_content/main`)**
  - *Chosen Approach*: Memperluas struktur dokumen utama `ChurchWebsiteContent` dengan properti terstruktur untuk `giving` (daftar rekening bank, gambar/kode QRIS, ayat kutipan, dan alokasi dana), `social` (tautan Facebook, Instagram, YouTube, WhatsApp), serta `ministriesExtra` (daftar komisi pendamping), lengkap dengan nilai bawaan (*default fallback*) yang aman.
  - *Why*: Menjaga konsistensi sinkronisasi real-time satu pintu melalui `onSnapshot` sehingga seluruh perangkat jemaat langsung menerima pembaruan secara utuh dan instan.
  - *Alternatives Considered*: Memecah setiap konfigurasi kecil ke koleksi Firestore terpisah, yang justru meningkatkan jumlah pembacaan dokumen dan kerumitan manajemen cadangan (backup/restore JSON).

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                   Cloud Firestore (church_content/main)                   │
│  [info & stream] [hero] [about] [services] [ministries] [events] [giving] │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ Real-time onSnapshot & Sanitized Write
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    ChurchContentContext (State & CRUD)                    │
└──────┬──────────────────────────────┬──────────────────────────────┬──────┘
       │                              │                              │
       ▼                              ▼                              ▼
┌──────────────────────┐   ┌──────────────────────┐   ┌─────────────────────┐
│   Seksi Halaman Web  │   │ Modal & Fitur Khusus │   │  Admin Panel (CMS)  │
│  (Bahasa Indonesia)  │   │  (Bahasa Indonesia)  │   │  Tab Terorganisir:  │
│  • Hero + Stream CTA │   │  • Live Stream Modal │   │  • Info & Streaming │
│  • Jadwal Ibadah     │   │  • Persembahan/QRIS  │   │  • Sosial Media     │
│  • Tentang & Nilai   │   │  • Rencana Kunjungan │   │  • Hero & Tentang   │
│  • Komisi & Pelayanan│   │  • Ruang Doa Bersama │   │  • Jadwal & Komisi  │
│  • Warta & Galeri    │   │  • Koleksi Khotbah   │   │  • Warta & Galeri   │
│  • Kontak & Footer   │   │                      │   │  • Persembahan/QRIS │
└──────────┬───────────┘   └──────────┬───────────┘   └──────────▲──────────┘
           │                          │                          │
           └──────────────────────────┴──────────────────────────┘
                     Tombol Pintas "Edit Seksi Ini" (Saat Admin Login)
```

- **Data Model & State**:
  - **Perluasan `ChurchGeneralInfo`**: Menambahkan pengaturan judul & deskripsi modal Live Streaming (`streamTitle`, `streamDescription`) serta tautan sosial media resmi (`facebookUrl`, `instagramUrl`, `youtubeUrl`, `whatsappNumber`).
  - **Entitas Baru `ChurchGivingContent`**:
    - `heading`, `subheading`, `scriptureQuote`: Teks pengantar dan ayat firman pada halaman persembahan.
    - `bankAccounts`: Daftar rekening bank gereja (`id`, `bankName`, `accountNumber`, `accountHolder`).
    - `qrisImageUrl` & `qrisLabel`: Gambar kode QRIS yang dapat dipilih dari Pustaka Media/unggah langsung atau dibuat otomatis, beserta petunjuk pemindaian.
    - `funds`: Daftar kategori alokasi persembahan (`id`, `name`, `description`).
  - **Komisi Tambahan (`additionalMinistries`)**: Memindahkan daftar 4 komisi tambahan (Persekutuan Doa, Komisi Wanita, Komisi Pria, Komisi Usia Indah) beserta jadwal & lokasi kegiatan dari teks statis menjadi bagian dari state `content` agar dapat diedit penuh dari tab Pelayanan di Admin Panel.
- **Interactive Component & State Mapping**:
  - **Pintasan Edit per Seksi (`openAdminAtTab(tabName)`)**: Mengatur state `activeAdminTab` di level aplikasi utama dan membuka `ContentManagerModal` langsung pada tab yang dipilih (`info`, `hero`, `about`, `services`, `ministries`, `events`, `gallery`, `giving`).
  - **Tab Admin "Persembahan & QRIS"**: Menyediakan formulir tambah/ubah/hapus rekening bank, pemilih gambar QRIS terintegrasi dengan `ImagePickerField`, serta editor daftar alokasi dana persembahan.
  - **Tab Admin "Info & Streaming"**: Mengelompokkan informasi kontak sekretariat, embed peta Google Maps, pengaturan URL embed YouTube Live Streaming (otomatis mengonversi tautan YouTube biasa/watch menjadi format `embed`), dan tautan akun sosial media di Footer.
  - **Lokalisasi Bahasa Indonesia Menyeluruh**: Mengonversi seluruh teks antarmuka pada `Hero`, `Events`, `Contact`, `Footer`, `GivingSection`, `SermonHub`, `PrayerWall`, `PlanVisitModal`, dan modal `Watch Online` ke dalam Bahasa Indonesia yang rapi dan konsisten.
