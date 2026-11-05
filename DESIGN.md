# DESIGN.md — Arah Desain & Identitas Visual GEPEKRIS Tretes

Dokumen ini adalah sumber kebenaran (*source of truth*) arah visual, kepribadian, tipografi, dan komposisi ruang website **GEPEKRIS Tretes** (Gereja Kristen Protestan di Tretes, Prigen, Pasuruan, Jawa Timur) sesuai filter **Anti-Slop** (*Rules R-01 s/d R-40*).

---

## 1. Identitas & Jiwa (*Identity & Soul*)
- **Karakter**: Berwibawa (*solemn*), pastoral hangat (*warm pastoral*), khidmat liturgis, komunal, dan transparan.
- **Bukan**: Aplikasi SaaS teknologi, halaman promosi startup, template gereja Silicon Valley generik dengan gradasi neon ungu-biru, atau kartu bento-grid mainan.
- **Konteks Lokal**: Gereja pegunungan Tretes dengan kesejukan alam, persekutuan jemaat erat lintas generasi, dan pelayanan kasih Kristiani.

---

## 2. Parameter Liveliness Dials (*R-37*)
- **ENERGY**: `2` (Tenang, hangat, khidmat, tidak tergesa-gesa; mengedepankan pembacaan firman dan kejelasan informasi).
- **RHYTHM**: `2` (Variasi berimbang: sambutan megah di Hero, jadwal ibadah presisi, monograf naratif sejarah jemaat, dan warta majalah mingguan).
- **MOTION**: `1` (Animasi reveal halus satu kali saat masuk viewport; **nol animasi denyut/pulse abadi**, nol efek memantul kartun).

---

## 3. Palet Warna & Disiplin Aksen (*R-01, R-29, 60-30-10*)
- **Warna Dasar 60% (*Archival Warm Paper*)**:
  - `#FAF8F5` (Kertas arsip hangat lembut) dan `#FFFFFF` (Putih murni untuk kartu konten).
  - `#FDFBF7` (Krem terang ruang warta).
- **Warna Teks & Struktur 30% (*Antique Charcoal*)**:
  - `#1C1917` (Stone-900 / Arang antik untuk judul berwibawa & keterbacaan tinggi).
  - `#44403C` / `#57534E` (Stone-700 / Teks deskripsi & kutipan tubuh).
  - `#E7E2DA` (Batas garis rambut *1px hairline border*).
- **Aksen Tunggal Terencana 10% (*Sacred Warm Amber / Bronze*)**:
  - `#78350F` (Perunggu tua berwibawa) dan `#D97706` / `#B45309` (Amber hangat fajar).
  - **Dose Cap**: Aksen hanya digunakan pada momen kunci (tombol panggilan utama *Rencanakan Kunjungan*, penanda hari aktif, dan garis rambut pemisah atas).
  - **Dilarang keras**: Gradasi ungu-ke-biru, cyan neon, latar belakang *radial glow* melayang, dan tombol multi-warna pelangi.

---

## 4. Tipografi & Hierarki Pembacaan (*R-06, R-09*)
- **Judul Utama & Kutipan Firman (*Display*)**: `font-serif-display` (*Playfair Display*), bobot `medium` atau `semibold`, `tracking-tight`, dengan `text-wrap: balance`.
- **Teks Bodi & Informasi (*Body Prose*)**: *Plus Jakarta Sans*, bobot `normal` atau `light`, ukuran 15–17px, jarak baris santai `leading-relaxed` (1.7–1.8), dibatasi 65–75 karakter per baris (`max-w-2xl` / `max-w-prose`).
- **Metadata & Kicker**: Huruf kapital teratur berjarak (`text-xs uppercase tracking-widest text-amber-800/90 font-semibold`).
- **Zero-Pill Discipline**: Dilarang menggunakan *pill badge* bulat tebal bertumpuk di atas judul yang mengulang nama halaman.

---

## 5. Komponen, Batasan Dosis & Aksesibilitas (*R-10 s/d R-36*)
- **Kaca / Glassmorphism (*R-10*)**: Dibatasi maksimal 2 elemen di seluruh layar (bilah navigasi melayang dan kartu jadwal ringkas di Hero). Semua kartu lain berupa permukaan padat (*solid surfaces*).
- **Bayangan & Kedalaman (*R-12*)**: Kedalaman elevasi tunggal yang tenang (`shadow-xs` hingga `shadow-sm`, transisi hover halus `hover:shadow-md`).
- **Sudut Lengkung (*Radius R-11*)**: Sudut proporsional institusional (`rounded-xl` atau `rounded-2xl`). Menghindari elemen bulat telur (*extreme pill-shaped boxes*).
- **Pembersihan Teks Palsu & Metrik Fiktif (*R-02, R-03*)**:
  - Dilarang mencantumkan statistik buatan (misal "10,000+ Jiwa Terberkati", "99.9% Kepuasan").
  - Menampilkan fakta nyata: Alamat aktual di Tretes, jadwal ibadah Minggu 07:30 WIB, rekening persembahan nyata, warta terverifikasi.
- **Bebas Emotikon Dekoratif (*R-04*)**: Tidak ada emoji yang berserakan di judul, lencana, atau tombol.
- **Aksesibilitas Manusia (*antislop-human*)**:
  - Rasio kontras teks terhadap latar belakang $\ge 4.5:1$ (standar WCAG 2.2 AA).
  - Area sentuh minimal 44px untuk kenyamanan jemari di ponsel.
  - Form persembahan dan warta memiliki navigasi papan ketik (*tab index & focus state*) yang jelas.
