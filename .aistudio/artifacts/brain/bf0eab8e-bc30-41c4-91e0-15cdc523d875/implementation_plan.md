# Rencana Pembersihan Anti-Slop & Harmonisasi Desain GEPEKRIS Tretes

Rencana pelaksanaan pembersihan pola-pola *AI Slop* (berdasarkan aturan **R-01 s/d R-40** dari skill `anti-slop`) dan penerapan terpadu parameter **`DESIGN.md`** (*ENERGY: 2, RHYTHM: 2, MOTION: 1*) pada seluruh seksi halaman website **GEPEKRIS Tretes**.

---

## Ringkasan Keputusan Pengguna (Hasil Klarifikasi)

> [!IMPORTANT]
> **Keputusan Terkonfirmasi dari Pengguna:**
> 1. **Prioritas Pembersihan Komprehensif**: Menjangkau seluruh seksi utama: **Arsip Khotbah & Media**, **Ruang Dinding Doa**, **Hub Kontak Sekretariat**, **Galeri Dokumentasi Foto**, **Formulir Rencana Kunjungan**, serta **Footer Halaman & Navigasi Ponsel**.
> 2. **Gaya Penyajian Khotbah**: Format kuratorial gereja yang elegan (*Curatorial Sermon Hub*), menampilkan pemutar video khotbah, perikop ayat Alkitab, ringkasan pastoral terstruktur, nama pembicara, dan tab kategori rohani dalam Bahasa Indonesia.
> 3. **Konsep Dinding Doa Jemaat**: Format kartu doa khidmat bergaris halus (*hairline border*) dengan tipografi khusyuk, penghapusan angka statistik fiktif (*anti-slop R-02*), dan tombol aksi "Doakan / Amin" yang rapi dan bermakna.

---

## 1. Konsep & Arsitektur Alur Kerja Anti-Slop

```
┌────────────────────────────────────────────────────────────────────────┐
│               ARSITEKTUR PENERAPAN FILTER ANTI-SLOP                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [1. SERMON HUB (ARSIP KHOTBAH)]                                       │
│      ├── Format kuratorial: Kartu khotbah utama dengan pemutar YouTube │
│      ├── Hapus pill badges tebal -> ganti unboxed tracked small caps   │
│      └── Terjemahkan kategori ke Bahasa Indonesia (Iman, Kasih, dll)   │
│                                                                        │
│  [2. PRAYER WALL (DINDING DOA)]                                        │
│      ├── Hapus angka buatan fiktif (+120 offset) -> tampilkan data riil│
│      ├── Kartu permohonan bernuansa tenang & berwibawa                 │
│      └── Tombol Doakan / Amin dengan interaksi santun tanpa animasi liar│
│                                                                        │
│  [3. HUB KONTAK & FORM KONSULTASI]                                     │
│      ├── Ubah palet abu-abu mentah (bg-gray-50) ke warm paper (#FAF8F5)│
│      ├── Tipografi judul Playfair Display serif                        │
│      └── Formulir surat sekretariat rapi & aksesibel (WCAG 2.2 AA)     │
│                                                                        │
│  [4. GALERI FOTO & MODAL KUNJUNGAN]                                    │
│      ├── Bersihkan badge pill ganda pada header galeri                 │
│      └── Bingkai foto institusional dengan caption teratur             │
│                                                                        │
│  [5. FOOTER & NAVIGASI MOBILE]                                         │
│      ├── Latar stone-950 berwibawa dengan hairline border halus        │
│      └── Menu ponsel responsif dengan touch target minimal 44px        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Rincian Pembaruan per Komponen Sesuai Aturan Anti-Slop

### A. Arsip Khotbah Kuratorial (`src/components/SermonHub.tsx`)
- **Pembersihan R-09 (Zero-Pill)**: Mengganti lencana pill tebal `bg-amber-100 px-3 py-1 rounded-full` menjadi label teks berjarak `text-xs uppercase tracking-widest font-semibold text-amber-800/90`.
- **Lokalisasi Bahasa (C-1)**: Mengganti kategori bahasa Inggris (`Faith, Hope, Family, Grace, Purpose`) menjadi Bahasa Indonesia penuh (`Semua, Iman, Pengharapan, Keluarga, Kasih Karunia, Tujuan Hidup`).
- **Gaya Kuratorial (R-05)**: Merapikan tata letak pemutar video khotbah pilihan (*featured sermon*) dengan catatan perikop Alkitab berwibawa, kutipan intisari khotbah, dan tombol putar tanpa kilatan warna-warni generik.

### B. Dinding Doa Khidmat (`src/components/PrayerWall.tsx`)
- **Pembersihan R-02 (No Invented Numbers)**: Menghapus angka offset fiktif `+ 120` pada perhitungan total doa. Menghitung murni jumlah pokok doa nyata yang ada di sistem/Firestore.
- **Pembersihan R-09 & R-13**: Mengganti pill badge dengan teks tajam, dan merapikan kartu permohonan doa dengan border hairline halus `border-stone-200/90`, tipografi kutipan doa yang tenang, serta tombol "Doakan" yang bersahaja.
- **Modal Permohonan Doa**: Formulir input dengan label jelas, pilihan kategori doa berbahasa Indonesia (Kesembuhan, Keluarga, Pekerjaan, Pelayanan, Syukur), dan navigasi papan ketik yang mudah.

### C. Hub Kontak Sekretariat (`src/components/Contact.tsx`)
- **Pembersihan R-01 (Palette & Direction)**: Mengganti `bg-gray-50` generik menjadi palet hangat `#FAF8F5` sesuai `DESIGN.md`.
- **Tipografi Playfair Serif**: Judul diubah ke `font-serif-display font-medium text-stone-900`.
- **Kartu Informasi Kontak**: Kartu telepon, email, alamat fisik di Tretes, dan jam operasional ditata dengan ikon bernuansa perunggu hangat dan teks yang terbaca jelas.

### D. Galeri Dokumentasi Foto (`src/components/PhotoGallery.tsx`)
- **Pembersihan R-09**: Menghapus pill badge bertumpuk di atas judul galeri.
- **Harmonisasi Tipografi**: Judul diubah ke `font-serif-display text-3xl sm:text-4xl font-medium text-stone-900`.
- **Zero-State Rapi**: Mempertahankan tampilan kotak dokumen elegan ketika galeri baru atau kosong tanpa tautan gambar rusak.

### E. Footer Institusional & Navigasi Mobile (`src/components/Footer.tsx` & `src/components/Header.tsx`)
- **Footer**: Latar `bg-stone-950` arang berwibawa, tipografi nama gereja `font-serif-display`, tautan cepat teratur, dan kontak WhatsApp resmi.
- **Navigasi Ponsel (antislop-layoutmobile)**: Memastikan menu navigasi dropdown mobile memiliki area sentuh minimal 44px (*finger-friendly*), kontras teks terang di atas latar bersih, dan penutup otomatis saat tautan diklik.

---

## 3. Rencana Eksekusi & Verifikasi
1. Memperbarui `SermonHub.tsx` (kuratorial khotbah, unboxed kicker, kategori bahasa Indonesia).
2. Memperbarui `PrayerWall.tsx` (pembersihan angka fiktif R-02, kartu doa khidmat, modal pastoral).
3. Memperbarui `Contact.tsx` (palet warm paper, Playfair Display serif, form kontak bersih).
4. Memperbarui `PhotoGallery.tsx` (header tanpa pill badge, font-serif-display).
5. Memperbarui `Footer.tsx` & `Header.tsx` (stone-950 footer, touch target mobile $\ge 44px$).
6. Menjalankan pengujian build & linting serentak (`compile_applet` dan `lint_applet`) untuk memastikan nol error.
