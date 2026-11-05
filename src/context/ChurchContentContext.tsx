import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection, sanitizeForFirestore } from '../firebase';
import { validateContentPayloadForSync } from '../lib/imageValidation';
import { clearCacheAndHardReload } from '../lib/cacheCleaner';

export interface ChurchGeneralInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  streamUrl: string;
  streamTitle?: string;
  streamDescription?: string;
  mapEmbedUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;
}

export interface ChurchBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface ChurchGivingFund {
  id: string;
  name: string;
  description: string;
}

export interface ChurchGivingContent {
  heading: string;
  subheading: string;
  scriptureQuote: string;
  bankAccounts: ChurchBankAccount[];
  qrisImageUrl: string;
  qrisLabel: string;
  funds: ChurchGivingFund[];
}

export interface ChurchAdditionalMinistryItem {
  id: string;
  title: string;
  description: string;
  schedule?: string;
  location?: string;
}

export interface ChurchHeroContent {
  headline: string;
  subheadline: string;
  bgImage: string;
  sundayNoteTitle: string;
  sundayNoteTimes: string;
}

export interface ChurchAboutValue {
  iconName: 'Heart' | 'Users' | 'Book' | 'Star' | 'Shield';
  title: string;
  description: string;
}

export interface ChurchAboutContent {
  heading: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
  values: ChurchAboutValue[];
}

export interface ChurchServiceItem {
  id: string;
  name: string;
  times: string[];
  description: string;
  iconName: 'Clock' | 'Calendar' | 'Users';
}

export interface ChurchMinistryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface ChurchDailyVerse {
  verseReference: string;
  verseText: string;
  reflectionNote: string;
  updatedDate?: string;
}

export interface ChurchEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  featured?: boolean;
  content?: string;
  image?: string;
  author?: string;
  slug?: string;
  bibleVerse?: string;
  bibleQuote?: string;
}

export interface ChurchGalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  date?: string;
}

export type MediaCategory =
  | 'hero'
  | 'about'
  | 'services'
  | 'ministries'
  | 'events'
  | 'gallery'
  | 'general';

export interface ChurchMediaItem {
  id: string;
  title: string;
  url: string;
  category: MediaCategory | string;
  description?: string;
  uploadedAt: string;
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  source?: 'upload' | 'url' | 'system';
}

export type AdminTabType =
  | 'info'
  | 'hero'
  | 'about'
  | 'services'
  | 'ministries'
  | 'events'
  | 'gallery'
  | 'giving'
  | 'media'
  | 'hosting'
  | 'backup'
  | 'security';

export interface ChurchWebsiteContent {
  info: ChurchGeneralInfo;
  hero: ChurchHeroContent;
  about: ChurchAboutContent;
  services: ChurchServiceItem[];
  ministries: ChurchMinistryItem[];
  additionalMinistries?: ChurchAdditionalMinistryItem[];
  events: ChurchEventItem[];
  dailyVerse?: ChurchDailyVerse;
  gallery?: ChurchGalleryItem[];
  giving?: ChurchGivingContent;
  mediaLibrary?: ChurchMediaItem[];
  lastUpdated?: string;
}

export const DEFAULT_DAILY_VERSE: ChurchDailyVerse = {
  verseReference: "Mazmur 119:105",
  verseText: "Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.",
  reflectionNote: "Dalam setiap langkah dan keputusan hidup hari ini, biarlah kebenaran Firman Tuhan menuntun hati dan keluarga kita berjalan dalam damai sejahtera Kristus.",
  updatedDate: "Renungan Harian Jemaat",
};

export function formatYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('/embed/')) return trimmed;
  // Match watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`;
  }
  // Match youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
  }
  // Match youtube.com/live/VIDEO_ID
  const liveMatch = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch && liveMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${liveMatch[1]}`;
  }
  return trimmed;
}

export const DEFAULT_GIVING_CONTENT: ChurchGivingContent = {
  heading: "Memberi dengan Sukacita",
  subheading: "Persembahan & Kemurahan Hati",
  scriptureQuote: "“Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.” — 2 Korintus 9:7",
  bankAccounts: [
    {
      id: "bank-1",
      bankName: "BCA (Bank Central Asia)",
      accountNumber: "882-019-4821",
      accountHolder: "GEPEKRIS Tretes",
    },
    {
      id: "bank-2",
      bankName: "Bank Mandiri",
      accountNumber: "123-00-984712-3",
      accountHolder: "GEPEKRIS Tretes",
    },
  ],
  qrisImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GEPEKRIS-TRETES-PERSEMBAHAN",
  qrisLabel: "Scan kode QRIS di atas menggunakan BCA Mobile, Livin' by Mandiri, BRImo, GoPay, OVO, Dana, atau ShopeePay",
  funds: [
    {
      id: "tithe",
      name: "Perpuluhan & Kas Pelayanan",
      description: "Mendukung operasional ibadah mingguan, pemeliharaan jemaat, dan pelayanan pastoral gereja.",
    },
    {
      id: "outreach",
      name: "Pelayanan Diakonia & Kasih",
      description: "Penyaluran paket sembako kasih, kunjungan jemaat lansia/sakit, dan bantuan sosial masyarakat.",
    },
    {
      id: "building",
      name: "Dana Pemeliharaan Gedung & Inventaris",
      description: "Perawatan ruang ibadah utama, tata suara multimedia, serta ruang kelas Sekolah Minggu.",
    },
    {
      id: "missions",
      name: "Misi & Pekabaran Injil",
      description: "Mendukung pelayanan hamba Tuhan, persekutuan doa, dan penginjilan di daerah sekitar.",
    },
  ],
};

export const DEFAULT_ADDITIONAL_MINISTRIES: ChurchAdditionalMinistryItem[] = [
  {
    id: "add-min-1",
    title: "Persekutuan Doa & PA",
    description: "Pendalaman Alkitab dan doa syafaat bersama secara bergilir di gedung gereja & rumah jemaat",
    schedule: "Setiap Rabu Pkl. 18:30 WIB",
    location: "Gedung GEPEKRIS Tretes & Rumah Jemaat",
  },
  {
    id: "add-min-2",
    title: "Komisi Wanita (PW)",
    description: "Membangun iman, doa, dan kebersamaan yang hangat bagi ibu-ibu serta wanita kristiani",
    schedule: "Setiap Jumat Pkl. 16:00 WIB",
    location: "Ruang Persekutuan GEPEKRIS Tretes",
  },
  {
    id: "add-min-3",
    title: "Komisi Pria (PKB)",
    description: "Penguatan peran pria dan kepala keluarga kristiani sebagai imam dalam rumah tangga",
    schedule: "Sabtu Minggu Ke-2 & Ke-4 Pkl. 18:00 WIB",
    location: "Gedung GEPEKRIS Tretes",
  },
  {
    id: "add-min-4",
    title: "Komisi Usia Indah (Lansia)",
    description: "Persekutuan kasih, pujian penyembahan, dan perhatian kesehatan bagi opa dan oma",
    schedule: "Sabtu Minggu Pertama Pkl. 09:00 WIB",
    location: "Gedung GEPEKRIS Tretes",
  },
];

export const DEFAULT_CHURCH_CONTENT: ChurchWebsiteContent = {
  info: {
    name: "GEPEKRIS Tretes",
    tagline: "Gereja Persekutuan Kristen - Berakar, Bertumbuh, dan Berbuah di Dalam Kristus",
    address: "Tretes, Kec. Prigen, Kab. Pasuruan, Jawa Timur 67157",
    phone: "(0343) 881234",
    email: "sekretariat@gepekristretes.org",
    officeHours: "Selasa - Sabtu: 09:00 - 16:00 WIB",
    streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=gepekristretes",
    streamTitle: "Ibadah Raya Minggu Online (Live Streaming)",
    streamDescription: "Mari beribadah bersama keluarga jemaat GEPEKRIS Tretes. Jika siaran langsung belum dimulai, Anda dapat menyaksikan rekaman ibadah terakhir di bawah ini.",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.578619623724!2d112.6288!3d-7.6974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDEnNTAuNiJTIDExMsKwMzcnNDMuNyJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid",
    facebookUrl: "https://facebook.com/gepekristretes",
    instagramUrl: "https://instagram.com/gepekristretes",
    youtubeUrl: "https://youtube.com/@gepekristretes",
    whatsappNumber: "6281234567890",
  },
  hero: {
    headline: "Selamat Datang di GEPEKRIS Tretes",
    subheadline: "Rumah ibadah dan persekutuan bagi setiap keluarga untuk bertumbuh bersama dalam kasih karunia Kristus Yesus.",
    bgImage: "https://images.unsplash.com/photo-1724398932316-e0d488b96e15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBzYW5jdHVhcnklMjBpbnRlcmlvciUyMHBlYWNlZnVsfGVufDF8fHx8MTc1NjM2MTYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    sundayNoteTitle: "Kebaktian Hari Minggu",
    sundayNoteTimes: "Ibadah Pagi: 07.30 WIB • Ibadah Raya: 10.00 WIB • Gedung Gereja & Live Streaming",
  },
  about: {
    heading: "Tentang GEPEKRIS Tretes",
    paragraph1: "Gereja Persekutuan Kristen (GEPEKRIS) Tretes melayani jemaat dan masyarakat di kawasan Tretes, Prigen, dan sekitarnya dengan semangat persekutuan, kesaksian, dan pelayanan kasih.",
    paragraph2: "Kami rindu setiap pribadi dan keluarga mengalami perjumpaan pribadi dengan Tuhan, bertumbuh dalam kebenaran firman-Nya, serta menjadi berkat nyata bagi sesama di lingkungan Tretes.",
    image: "https://images.unsplash.com/photo-1658734029438-d97357737bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwcGVvcGxlJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU2MzYxNjU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    values: [
      {
        iconName: "Heart",
        title: "Kasih Kristus",
        description: "Mengasihi Tuhan dan sesama dengan tulus dan melayani dengan kerendahan hati",
      },
      {
        iconName: "Book",
        title: "Kebenaran Firman",
        description: "Berakar kuat pada pengajaran Alkitab yang murni dan relevan bagi kehidupan sehari-hari",
      },
      {
        iconName: "Users",
        title: "Persekutuan Erat",
        description: "Membangun hubungan kekeluargaan yang saling menguatkan dan menopang satu sama lain",
      },
      {
        iconName: "Star",
        title: "Kesaksian & Misi",
        description: "Menjadi terang dan garam di tengah masyarakat melalui perbuatan kasih nyata",
      },
    ],
  },
  services: [
    {
      id: "srv-1",
      name: "Kebaktian Umum I",
      times: ["Minggu 07:30 WIB"],
      description: "Ibadah pagi dengan puji-pujian khidmat dan pemberitaan firman Tuhan",
      iconName: "Clock",
    },
    {
      id: "srv-2",
      name: "Kebaktian Umum II & Sekolah Minggu",
      times: ["Minggu 10:00 WIB"],
      description: "Ibadah raya keluarga disertai kelas Sekolah Minggu untuk anak-anak",
      iconName: "Clock",
    },
    {
      id: "srv-3",
      name: "Persekutuan Doa Syafaat",
      times: ["Rabu 18:30 WIB"],
      description: "Mendoakan pokok doa jemaat, pelayanan, pemulihan keluarga, dan bangsa",
      iconName: "Calendar",
    },
    {
      id: "srv-4",
      name: "Persekutuan Pemuda Remaja",
      times: ["Sabtu 17:00 WIB"],
      description: "Praise and worship, diskusi firman, dan keakraban generasi muda",
      iconName: "Users",
    },
  ],
  ministries: [
    {
      id: "min-1",
      title: "Komisi Sekolah Minggu (Anak)",
      description: "Mendidik anak-anak mengenal kasih Yesus sejak usia dini dengan metode interaktif, pujian anak, dan cerita Alkitab bergambar.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNodXJjaCUyMHN1bmRheSUyMHNjaG9vbHxlbnwxfHx8fDE3NTYzNjE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Kelas Balita, Pratama, dan Madya", "Aktivitas Kreatif & Ayat Hafalan", "Guru Sekolah Minggu Terlatih"],
    },
    {
      id: "min-2",
      title: "Komisi Pemuda & Remaja (Youth)",
      description: "Menyiapkan generasi muda berkarakter Kristus, aktif melayani, dan memiliki komunitas pergaulan yang sehat serta membangun.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGdyb3VwJTIwY2h1cmNofGVufDF8fHx8MTc1NjM2MTY2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Tim Musik & Multimedia", "Camp & Retret Kepemimpinan", "Mentoring & Pemuridan Pribadi"],
    },
    {
      id: "min-3",
      title: "Pelayanan Diakonia & Kasih",
      description: "Mewujudkan kasih nyata melalui kepedulian bagi lansia, orang sakit, jemaat prasejahtera, dan bantuan sosial lingkungan sekitar.",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzZXJ2aWNlJTIwaGVscGluZ3xlbnwxfHx8fDE3NTYzNjE2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Kunjungan Jemaat Lansia & Sakit", "Bantuan Sosial & Sembako Kasih", "Konseling & Doa Keluarga"],
    },
  ],
  events: [
    {
      id: "evt-renungan-1",
      title: "Menemukan Damai Sejahtera Kristus di Tengah Badai Kehidupan",
      date: "Renungan Pekan Ini",
      time: "Bacaan 4 Menit",
      location: "Mimbar Firman GEPEKRIS Tretes",
      description: "Ketika kekuatiran dunia menekan hati kita, Tuhan Yesus mengundang setiap kita untuk datang kepada-Nya dan menerima kelegaan sejati.",
      category: "Renungan & Firman Tuhan",
      featured: true,
      bibleVerse: "Yohanes 14:27",
      bibleQuote: "Damai sejahtera Kutinggalkan bagimu. Damai sejahtera-Ku Kuberikan kepadamu, dan apa yang Kuberikan tidak seperti yang diberikan oleh dunia kepadamu. Janganlah gelisah dan gentar hatimu.",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
      author: "Pelayan Firman GEPEKRIS Tretes",
      content: `Sering kali kita mengukur damai sejahtera dari seberapa tenang keadaan di sekitar kita—ketika pekerjaan lancar, kesehatan prima, dan keluarga tanpa pergumulan. Namun Firman Tuhan dalam Injil Yohanes 14:27 mengingatkan kita bahwa damai sejahtera yang berasal dari Kristus berbeda dengan apa yang ditawarkan dunia.\n\nDamai sejahtera dari dunia bergantung pada situasi luar yang mudah berubah, sedangkan damai sejahtera Kristus berakar pada hadirat dan janji penyertaan Tuhan yang tidak pernah berubah. Sekalipun angin pergumulan menerpa, hati yang terpaut pada Firman-Nya tetap memiliki jangkar pengharapan yang teguh.\n\nHari ini, apapun beban atau pergumulan yang sedang Bapak, Ibu, dan Saudara hadapi, bawalah di dalam doa ke hadapan Tuhan. Percayalah bahwa Gembala Agung kita memegang kendali atas setiap musim kehidupan kita. Kiranya kasih dan damai sejahtera Kristus memerintah di dalam hati dan rumah tangga kita senantiasa. Tuhan Yesus memberkati.`
    },
    {
      id: "evt-1",
      title: "Kebaktian Perjamuan Kudus Awal Bulan",
      date: "Minggu Pertama Bulan Ini",
      time: "07:30 & 10:00 WIB",
      location: "Gedung Gereja GEPEKRIS Tretes",
      description: "Mengingat pengorbanan dan karya penebusan Kristus melalui perjamuan kudus bersama seluruh keluarga jemaat.",
      category: "Ibadah Khusus",
      featured: true,
      bibleVerse: "1 Korintus 11:26",
      bibleQuote: "Sebab setiap kali kamu makan roti ini dan minum cawan ini, kamu memberitakan kematian Tuhan sampai Ia datang.",
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
      author: "Majelis Gereja GEPEKRIS Tretes",
      content: `Puji syukur kepada Tuhan Yesus Kristus, Kepala Gereja kita. Segenap jemaat dan simpatisan diundang untuk hadir dan bersekutu dalam Kebaktian Perjamuan Kudus Awal Bulan di Gereja Persekutuan Kristen (GEPEKRIS) Tretes.\n\nPerjamuan Kudus ini dilaksanakan dalam dua sesi ibadah umum (Kebaktian I Pkl. 07:30 WIB dan Kebaktian II Pkl. 10:00 WIB). Seluruh jemaat yang telah menerima sakramen baptisan kudus / sidi diharapkan mempersiapkan hati dengan doa dan pembacaan firman Tuhan.\n\nMari kita datang dengan kerinduan hati untuk mengingat kembali kasih pengorbanan Kristus di kayu salib, memperbaharui komitmen hidup kudus, serta mempererat tali persaudaraan antar jemaat dalam persekutuan tubuh Kristus. Bagi jemaat yang membutuhkan pelayanan perjamuan kudus di rumah bagi lansia yang sakit, silakan menghubungi sekretariat gereja atau koordinator diakonia.`
    },
    {
      id: "evt-2",
      title: "Retret Jemaat & Pembinaan Rohani Keluarga",
      date: "Bulan Depan",
      time: "Jumat - Minggu",
      location: "Wisma Retret Tretes, Prigen",
      description: "Menikmati waktu pembaharuan rohani, kebersamaan antar jemaat, dan firman yang mendalam di udara sejuk Tretes.",
      category: "Warta Jemaat",
      featured: false,
      bibleVerse: "Kolose 2:7",
      bibleQuote: "Hendaklah kamu berakar di dalam Dia dan dibangun di atas Dia, hendaklah kamu bertambah teguh dalam iman yang telah diajarkan kepadamu, dan hendaklah hatimu melimpah dengan syukur.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
      author: "Panitia Pembinaan Rohani",
      content: `Sebagai bagian dari program pertumbuhan iman jemaat GEPEKRIS Tretes, gereja mengadakan Retret Pembinaan Rohani Keluarga dengan tema: 'Berakar Kuat, Berbuah Lebat'.\n\nKegiatan ini dirancang untuk seluruh kalangan usia—anak-anak, pemuda-remaja, hingga orang tua dan lansia. Selama tiga hari dua malam, jemaat akan diajak mendalami firman Tuhan dalam sesi pleno, kelompok sharing doa yang intim, workshop keluarga kristiani, serta malam puji-pujian dan keakraban di sejuknya hawa pegunungan Tretes.\n\nPendaftaran telah dibuka melalui sekretariat gereja. Tempat terbatas demi kenyamanan akomodasi. Mari luangkan waktu sejenak dari kesibukan rutinitas untuk disegarkan kembali dalam hadirat Tuhan bersama keluarga tercinta.`
    },
    {
      id: "evt-3",
      title: "Aksi Kasih Diakonia: Berbagi Berkat Sembako Bagi Warga Prigen",
      date: "Sabtu Pekan Depan",
      time: "09:00 WIB - Selesai",
      location: "Halaman Gereja GEPEKRIS Tretes",
      description: "Pemberian paket sembako dan pelayanan kasih bagi masyarakat sekitar lingkungan gereja.",
      category: "Diakonia",
      featured: false,
      bibleVerse: "Galatia 6:10",
      bibleQuote: "Karena itu, selama masih ada kesempatan bagi kita, marilah kita berbuat baik kepada semua orang, tetapi terutama kepada kawan-kawan kita seiman.",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
      author: "Komisi Diakonia & Sosial",
      content: `Gereja bukan hanya tempat beribadah di dalam gedung, tetapi juga terang dan garam di tengah masyarakat sekitar. Komisi Diakonia GEPEKRIS Tretes kembali menyelenggarakan 'Aksi Kasih Berbagi Berkat'.\n\nDalam aksi sosial ini, gereja menyalurkan paket bahan pokok (sembako), vitamin, serta pemeriksaan kesehatan dasar gratis bagi warga lansia dan keluarga prasejahtera di sekitar kawasan Prigen dan Tretes.\n\nBagi jemaat yang terbeban untuk mendukung pengadaan paket bahan pokok maupun tenaga sukarelawan medis / logistik, persembahan kasih dan partisipasi dapat dikoordinasikan langsung bersama tim Diakonia. Kiranya kasih Kristus terpancar nyata melalui pelayanan bersama ini.`
    },
  ],
  mediaLibrary: [],
  gallery: [],
  dailyVerse: DEFAULT_DAILY_VERSE,
  additionalMinistries: DEFAULT_ADDITIONAL_MINISTRIES,
  giving: DEFAULT_GIVING_CONTENT,
  lastUpdated: "2026-10-05T04:00:00.000Z",
};

export interface HostingDirectoryConfig {
  enabled: boolean;
  serverUrl: string;
  apiSecret: string;
  storagePath: string;
  autoSync: boolean;
  autoLoad: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: 'idle' | 'success' | 'error' | 'syncing';
  lastSyncError: string | null;
}

export const GEPEKRIS_TRETES_CONTENT: ChurchWebsiteContent = {
  info: {
    name: "GEPEKRIS Tretes",
    tagline: "Gereja Persekutuan Kristen - Berakar, Bertumbuh, dan Berbuah di Dalam Kristus",
    address: "Tretes, Kec. Prigen, Kab. Pasuruan, Jawa Timur 67157",
    phone: "(0343) 881234",
    email: "sekretariat@gepekristretes.org",
    officeHours: "Selasa - Sabtu: 09:00 - 16:00 WIB",
    streamUrl: "https://www.youtube-nocookie.com/embed/live_stream?channel=gepekristretes",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.578619623724!2d112.6288!3d-7.6974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDEnNTAuNiJTIDExMsKwMzcnNDMuNyJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid",
  },
  hero: {
    headline: "Selamat Datang di GEPEKRIS Tretes",
    subheadline: "Rumah ibadah dan persekutuan bagi setiap keluarga untuk bertumbuh bersama dalam kasih karunia Kristus Yesus.",
    bgImage: "https://images.unsplash.com/photo-1724398932316-e0d488b96e15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBzYW5jdHVhcnklMjBpbnRlcmlvciUyMHBlYWNlZnVsfGVufDF8fHx8MTc1NjM2MTYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    sundayNoteTitle: "Kebaktian Hari Minggu",
    sundayNoteTimes: "Ibadah Pagi: 07.30 WIB • Ibadah Raya: 10.00 WIB • Gedung Gereja & Live Streaming",
  },
  about: {
    heading: "Tentang GEPEKRIS Tretes",
    paragraph1: "Gereja Persekutuan Kristen (GEPEKRIS) Tretes melayani jemaat dan masyarakat di kawasan Tretes, Prigen, dan sekitarnya dengan semangat persekutuan, kesaksian, dan pelayanan kasih.",
    paragraph2: "Kami rindu setiap pribadi dan keluarga mengalami perjumpaan pribadi dengan Tuhan, bertumbuh dalam kebenaran firman-Nya, serta menjadi berkat nyata bagi sesama di lingkungan Tretes.",
    image: "https://images.unsplash.com/photo-1658734029438-d97357737bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwcGVvcGxlJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU2MzYxNjU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    values: [
      {
        iconName: "Heart",
        title: "Kasih Kristus",
        description: "Mengasihi Tuhan dan sesama dengan tulus dan melayani dengan kerendahan hati",
      },
      {
        iconName: "Book",
        title: "Kebenaran Firman",
        description: "Berakar kuat pada pengajaran Alkitab yang murni dan relevan bagi kehidupan sehari-hari",
      },
      {
        iconName: "Users",
        title: "Persekutuan Erat",
        description: "Membangun hubungan kekeluargaan yang saling menguatkan dan menopang satu sama lain",
      },
      {
        iconName: "Star",
        title: "Kesaksian & Misi",
        description: "Menjadi terang dan garam di tengah masyarakat melalui perbuatan kasih nyata",
      },
    ],
  },
  services: [
    {
      id: "srv-1",
      name: "Kebaktian Umum I",
      times: ["Minggu 07:30 WIB"],
      description: "Ibadah pagi dengan puji-pujian khidmat dan pemberitaan firman Tuhan",
      iconName: "Clock",
    },
    {
      id: "srv-2",
      name: "Kebaktian Umum II & Sekolah Minggu",
      times: ["Minggu 10:00 WIB"],
      description: "Ibadah raya keluarga disertai kelas Sekolah Minggu untuk anak-anak",
      iconName: "Clock",
    },
    {
      id: "srv-3",
      name: "Persekutuan Doa Syafaat",
      times: ["Rabu 18:30 WIB"],
      description: "Mendoakan pokok doa jemaat, pelayanan, pemulihan keluarga, dan bangsa",
      iconName: "Calendar",
    },
    {
      id: "srv-4",
      name: "Persekutuan Pemuda Remaja",
      times: ["Sabtu 17:00 WIB"],
      description: "Praise and worship, diskusi firman, dan keakraban generasi muda",
      iconName: "Users",
    },
  ],
  ministries: [
    {
      id: "min-1",
      title: "Komisi Sekolah Minggu (Anak)",
      description: "Mendidik anak-anak mengenal kasih Yesus sejak usia dini dengan metode interaktif, pujian anak, dan cerita Alkitab bergambar.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNodXJjaCUyMHN1bmRheSUyMHNjaG9vbHxlbnwxfHx8fDE3NTYzNjE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Kelas Balita, Pratama, dan Madya", "Aktivitas Kreatif & Ayat Hafalan", "Guru Sekolah Minggu Terlatih"],
    },
    {
      id: "min-2",
      title: "Komisi Pemuda & Remaja (Youth)",
      description: "Menyiapkan generasi muda berkarakter Kristus, aktif melayani, dan memiliki komunitas pergaulan yang sehat serta membangun.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGdyb3VwJTIwY2h1cmNofGVufDF8fHx8MTc1NjM2MTY2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Tim Musik & Multimedia", "Camp & Retret Kepemimpinan", "Mentoring & Pemuridan Pribadi"],
    },
    {
      id: "min-3",
      title: "Pelayanan Diakonia & Kasih",
      description: "Mewujudkan kasih nyata melalui kepedulian bagi lansia, orang sakit, jemaat prasejahtera, dan bantuan sosial lingkungan sekitar.",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzZXJ2aWNlJTIwaGVscGluZ3xlbnwxfHx8fDE3NTYzNjE2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Kunjungan Jemaat Lansia & Sakit", "Bantuan Sosial & Sembako Kasih", "Konseling & Doa Keluarga"],
    },
  ],
  events: [
    {
      id: "evt-1",
      title: "Kebaktian Perjamuan Kudus Awal Bulan",
      date: "Minggu Pertama Bulan Ini",
      time: "07:30 & 10:00 WIB",
      location: "Gedung Gereja GEPEKRIS Tretes",
      description: "Mengingat pengorbanan dan karya penebusan Kristus melalui perjamuan kudus bersama.",
      category: "Ibadah Khusus",
      featured: true,
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
      author: "Majelis Gereja GEPEKRIS Tretes",
      content: `Puji syukur kepada Tuhan Yesus Kristus, Kepala Gereja kita. Segenap jemaat dan simpatisan diundang untuk hadir dan bersekutu dalam Kebaktian Perjamuan Kudus Awal Bulan di Gereja Persekutuan Kristen (GEPEKRIS) Tretes.\n\nPerjamuan Kudus ini dilaksanakan dalam dua sesi ibadah umum (Kebaktian I Pkl. 07:30 WIB dan Kebaktian II Pkl. 10:00 WIB). Seluruh jemaat yang telah menerima sakramen baptisan kudus / sidi diharapkan mempersiapkan hati dengan doa dan pembacaan firman Tuhan.\n\nMari kita datang dengan kerinduan hati untuk mengingat kembali kasih pengorbanan Kristus di kayu salib, memperbaharui komitmen hidup kudus, serta mempererat tali persaudaraan antar jemaat dalam persekutuan tubuh Kristus. Bagi jemaat yang membutuhkan pelayanan perjamuan kudus di rumah bagi lansia yang sakit, silakan menghubungi sekretariat gereja atau koordinator diakonia.`
    },
    {
      id: "evt-2",
      title: "Retret Jemaat & Pembinaan Rohani Keluarga",
      date: "Bulan Depan",
      time: "Jumat - Minggu",
      location: "Wisma Retret Tretes, Prigen",
      description: "Menikmati waktu pembaharuan rohani, kebersamaan antar jemaat, dan firman yang mendalam di udara sejuk Tretes.",
      category: "Retret",
      featured: false,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
      author: "Panitia Pembinaan Rohani",
      content: `Sebagai bagian dari program pertumbuhan iman jemaat GEPEKRIS Tretes, gereja mengadakan Retret Pembinaan Rohani Keluarga dengan tema: 'Berakar Kuat, Berbuah Lebat'.\n\nKegiatan ini dirancang untuk seluruh kalangan usia—anak-anak, pemuda-remaja, hingga orang tua dan lansia. Selama tiga hari dua malam, jemaat akan diajak mendalami firman Tuhan dalam sesi pleno, kelompok sharing doa yang intim, workshop keluarga kristiani, serta malam puji-pujian dan keakraban di sejuknya hawa pegunungan Tretes.\n\nPendaftaran telah dibuka melalui sekretariat gereja. Tempat terbatas demi kenyamanan akomodasi. Mari luangkan waktu sejenak dari kesibukan rutinitas untuk disegarkan kembali dalam hadirat Tuhan bersama keluarga tercinta.`
    },
    {
      id: "evt-3",
      title: "Aksi Kasih Diakonia: Berbagi Berkat Sembako Bagi Warga Prigen",
      date: "Sabtu Pekan Depan",
      time: "09:00 WIB - Selesai",
      location: "Halaman Gereja GEPEKRIS Tretes",
      description: "Pemberian paket sembako dan pelayanan kasih bagi masyarakat sekitar lingkungan gereja.",
      category: "Diakonia",
      featured: false,
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
      author: "Komisi Diakonia & Sosial",
      content: `Gereja bukan hanya tempat beribadah di dalam gedung, tetapi juga terang dan garam di tengah masyarakat sekitar. Komisi Diakonia GEPEKRIS Tretes kembali menyelenggarakan 'Aksi Kasih Berbagi Berkat'.\n\nDalam aksi sosial ini, gereja menyalurkan paket bahan pokok (sembako), vitamin, serta pemeriksaan kesehatan dasar gratis bagi warga lansia dan keluarga prasejahtera di sekitar kawasan Prigen dan Tretes.\n\nBagi jemaat yang terbeban untuk mendukung pengadaan paket bahan pokok maupun tenaga sukarelawan medis / logistik, persembahan kasih dan partisipasi dapat dikoordinasikan langsung bersama tim Diakonia. Kiranya kasih Kristus terpancar nyata melalui pelayanan bersama ini.`
    },
  ],
  gallery: [],
  dailyVerse: DEFAULT_DAILY_VERSE,
  additionalMinistries: DEFAULT_ADDITIONAL_MINISTRIES,
  giving: DEFAULT_GIVING_CONTENT,
};

export const DEFAULT_HOSTING_CONFIG: HostingDirectoryConfig = {
  enabled: true,
  serverUrl: '/api/content.php',
  apiSecret: 'gepekristretes2025',
  storagePath: 'public_html/data/church_content.json',
  autoSync: true,
  autoLoad: true,
  lastSyncTime: null,
  lastSyncStatus: 'idle',
  lastSyncError: null,
};

const STORAGE_KEY = 'gepekris_tretes_content_v1';
const ADMIN_STORAGE_KEY = 'gepekris_tretes_admin_pwd';
const ADMIN_AUTH_KEY = 'gepekris_tretes_admin_auth';
const HOSTING_CONFIG_KEY = 'gepekris_tretes_hosting_config_v1';
export const DEFAULT_ADMIN_PASSWORD = 'admin123';

interface ContentContextType {
  content: ChurchWebsiteContent;
  updateInfo: (data: Partial<ChurchGeneralInfo>) => void;
  updateHero: (data: Partial<ChurchHeroContent>) => void;
  updateAbout: (data: Partial<ChurchAboutContent>) => void;
  updateServices: (services: ChurchServiceItem[]) => void;
  addService: (item: Omit<ChurchServiceItem, 'id'>) => void;
  deleteService: (id: string) => void;
  updateMinistries: (ministries: ChurchMinistryItem[]) => void;
  addMinistry: (item: Omit<ChurchMinistryItem, 'id'>) => void;
  deleteMinistry: (id: string) => void;
  updateMinistryItem: (id: string, updated: Partial<ChurchMinistryItem>) => void;
  addAdditionalMinistry: (item: Omit<ChurchAdditionalMinistryItem, 'id'>) => void;
  updateAdditionalMinistry: (id: string, updated: Partial<ChurchAdditionalMinistryItem>) => void;
  deleteAdditionalMinistry: (id: string) => void;
  updateGiving: (data: Partial<ChurchGivingContent>) => void;
  addBankAccount: (item: Omit<ChurchBankAccount, 'id'>) => void;
  updateBankAccount: (id: string, updated: Partial<ChurchBankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  addGivingFund: (item: Omit<ChurchGivingFund, 'id'>) => void;
  updateGivingFund: (id: string, updated: Partial<ChurchGivingFund>) => void;
  deleteGivingFund: (id: string) => void;
  updateEvents: (events: ChurchEventItem[]) => void;
  addEvent: (item: Omit<ChurchEventItem, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateEventItem: (id: string, updated: Partial<ChurchEventItem>) => void;
  updateDailyVerse: (data: Partial<ChurchDailyVerse>) => void;
  updateGallery: (gallery: ChurchGalleryItem[]) => void;
  addGalleryItem: (item: Omit<ChurchGalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  updateGalleryItem: (id: string, updated: Partial<ChurchGalleryItem>) => void;
  clearDefaultImages: () => void;
  updateServiceItem: (id: string, updated: Partial<ChurchServiceItem>) => void;
  addMediaItem: (item: Omit<ChurchMediaItem, 'id' | 'uploadedAt'>) => ChurchMediaItem;
  deleteMediaItem: (id: string) => void;
  updateMediaItem: (id: string, updated: Partial<ChurchMediaItem>) => void;
  getAllIndexedMedia: () => ChurchMediaItem[];
  resetToDefaults: () => void;
  importContent: (newContent: ChurchWebsiteContent) => boolean;
  applyGepekrisTretesPreset: () => void;
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  resetAdminPassword: () => void;
  activeAdminTab: AdminTabType;
  setActiveAdminTab: (tab: AdminTabType) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  openAdminAtTab: (tab: AdminTabType) => void;
  hostingConfig: HostingDirectoryConfig;
  updateHostingConfig: (config: Partial<HostingDirectoryConfig>) => void;
  resetHostingConfig: () => void;
  syncToHosting: (overrideConfig?: Partial<HostingDirectoryConfig>) => Promise<{ success: boolean; message: string; details?: any }>;
  syncFromHosting: (overrideConfig?: Partial<HostingDirectoryConfig>) => Promise<{ success: boolean; message: string; details?: any }>;
  testHostingConnection: (url?: string, secret?: string) => Promise<{ success: boolean; message: string; details?: any }>;
  clearCacheAndStartFresh: () => void;
  firestoreStatus: 'connected' | 'syncing' | 'error' | 'idle';
  firestoreError: string | null;
  syncToFirestore: () => Promise<{ success: boolean; message: string }>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const normalizeChurchContent = (raw: any): ChurchWebsiteContent => {
  if (!raw || typeof raw !== 'object') return DEFAULT_CHURCH_CONTENT;

  const services = Array.isArray(raw.services)
    ? raw.services.map((s: any, idx: number) => {
        let times: string[] = [];
        if (Array.isArray(s?.times)) {
          times = s.times;
        } else if (typeof s?.times === 'string') {
          times = [s.times];
        } else if (s?.time) {
          times = [s.day ? `${s.day} ${s.time}` : s.time];
        } else {
          times = ["Minggu 07:30 WIB"];
        }

        return {
          id: s?.id || `srv-${idx + 1}`,
          name: s?.name || `Kebaktian ${idx + 1}`,
          times,
          description: s?.description || '',
          iconName: (s?.iconName === 'Calendar' || s?.iconName === 'Users') ? s.iconName : 'Clock',
        };
      })
    : DEFAULT_CHURCH_CONTENT.services;

  const ministries = Array.isArray(raw.ministries)
    ? raw.ministries.map((m: any, idx: number) => ({
        id: m?.id || `min-${idx + 1}`,
        title: m?.title || `Pelayanan ${idx + 1}`,
        description: m?.description || '',
        image: m?.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
        features: Array.isArray(m?.features) ? m.features : (typeof m?.features === 'string' ? [m.features] : []),
      }))
    : DEFAULT_CHURCH_CONTENT.ministries;

  const additionalMinistries = Array.isArray(raw.additionalMinistries)
    ? raw.additionalMinistries.map((am: any, idx: number) => ({
        id: am?.id || `add-min-${idx + 1}`,
        title: am?.title || `Komisi ${idx + 1}`,
        description: am?.description || '',
        schedule: am?.schedule || 'Rutin Setiap Pekan / Bulan',
        location: am?.location || 'Gedung GEPEKRIS Tretes & Rumah Jemaat',
      }))
    : DEFAULT_ADDITIONAL_MINISTRIES;

  const rawGiving = raw.giving && typeof raw.giving === 'object' ? raw.giving : {};
  const giving: ChurchGivingContent = {
    heading: rawGiving.heading || DEFAULT_GIVING_CONTENT.heading,
    subheading: rawGiving.subheading || DEFAULT_GIVING_CONTENT.subheading,
    scriptureQuote: rawGiving.scriptureQuote || DEFAULT_GIVING_CONTENT.scriptureQuote,
    qrisImageUrl: rawGiving.qrisImageUrl || DEFAULT_GIVING_CONTENT.qrisImageUrl,
    qrisLabel: rawGiving.qrisLabel || DEFAULT_GIVING_CONTENT.qrisLabel,
    bankAccounts: Array.isArray(rawGiving.bankAccounts)
      ? rawGiving.bankAccounts.map((b: any, idx: number) => ({
          id: b?.id || `bank-${idx + 1}`,
          bankName: b?.bankName || 'Bank',
          accountNumber: b?.accountNumber || '',
          accountHolder: b?.accountHolder || 'GEPEKRIS Tretes',
        }))
      : DEFAULT_GIVING_CONTENT.bankAccounts,
    funds: Array.isArray(rawGiving.funds)
      ? rawGiving.funds.map((f: any, idx: number) => ({
          id: f?.id || `fund-${idx + 1}`,
          name: f?.name || 'Kas Pelayanan',
          description: f?.description || '',
        }))
      : DEFAULT_GIVING_CONTENT.funds,
  };

  const events = Array.isArray(raw.events)
    ? raw.events.map((e: any, idx: number) => {
        const item: any = {
          id: e?.id || `evt-${idx + 1}`,
          title: e?.title || `Kegiatan ${idx + 1}`,
          date: e?.date || '',
          time: e?.time || '',
          location: e?.location || '',
          description: e?.description || '',
          category: e?.category || 'Umum',
          featured: !!e?.featured,
        };
        if (e?.content !== undefined && e?.content !== null) item.content = e.content;
        if (e?.image !== undefined && e?.image !== null) item.image = e.image;
        if (e?.author !== undefined && e?.author !== null) item.author = e.author;
        if (e?.slug !== undefined && e?.slug !== null) item.slug = e.slug;
        if (e?.bibleVerse !== undefined && e?.bibleVerse !== null) item.bibleVerse = e.bibleVerse;
        if (e?.bibleQuote !== undefined && e?.bibleQuote !== null) item.bibleQuote = e.bibleQuote;
        return item;
      })
    : DEFAULT_CHURCH_CONTENT.events;

  const rawDailyVerse = raw.dailyVerse && typeof raw.dailyVerse === 'object' ? raw.dailyVerse : {};
  const dailyVerse: ChurchDailyVerse = {
    verseReference: rawDailyVerse.verseReference || DEFAULT_DAILY_VERSE.verseReference,
    verseText: rawDailyVerse.verseText || DEFAULT_DAILY_VERSE.verseText,
    reflectionNote: rawDailyVerse.reflectionNote || DEFAULT_DAILY_VERSE.reflectionNote,
    updatedDate: rawDailyVerse.updatedDate || DEFAULT_DAILY_VERSE.updatedDate,
  };

  const gallery = Array.isArray(raw.gallery)
    ? raw.gallery
        .filter((g: any) => {
          const url = (g?.imageUrl || g?.image || '').trim();
          // Filter out default placeholder unspash photos if empty string or legacy sample ids
          return url !== '';
        })
        .map((g: any, idx: number) => ({
          id: g?.id || `gal-${idx + 1}`,
          title: g?.title || `Dokumentasi ${idx + 1}`,
          category: g?.category || 'Kegiatan',
          imageUrl: g?.imageUrl || g?.image || '',
          description: g?.description || '',
          date: g?.date || '',
        }))
    : [];

  const mediaLibrary = Array.isArray(raw.mediaLibrary)
    ? raw.mediaLibrary.map((m: any, idx: number) => {
        const item: any = {
          id: m?.id || `med-${idx + 1}`,
          title: m?.title || `Media ${idx + 1}`,
          url: m?.url || '',
          category: m?.category || 'general',
          description: m?.description || '',
          uploadedAt: m?.uploadedAt || new Date().toISOString(),
          fileSizeBytes: typeof m?.fileSizeBytes === 'number' ? m.fileSizeBytes : 0,
          source: m?.source || 'upload',
        };
        if (typeof m?.width === 'number') item.width = m.width;
        if (typeof m?.height === 'number') item.height = m.height;
        return item;
      })
    : (DEFAULT_CHURCH_CONTENT.mediaLibrary || []);

  return {
    ...DEFAULT_CHURCH_CONTENT,
    ...raw,
    info: { ...DEFAULT_CHURCH_CONTENT.info, ...(raw.info || {}) },
    hero: { ...DEFAULT_CHURCH_CONTENT.hero, ...(raw.hero || {}) },
    about: { ...DEFAULT_CHURCH_CONTENT.about, ...(raw.about || {}) },
    services,
    ministries,
    additionalMinistries,
    giving,
    dailyVerse,
    events,
    gallery,
    mediaLibrary,
    lastUpdated: raw.lastUpdated || DEFAULT_CHURCH_CONTENT.lastUpdated,
  };
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ChurchWebsiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only use saved if it's GEPEKRIS and newer or equal to the fresh default version
        if (parsed.info?.name && !parsed.info.name.includes('Grace')) {
          const parsedTime = parsed.lastUpdated ? new Date(parsed.lastUpdated).getTime() : 0;
          const defaultTime = DEFAULT_CHURCH_CONTENT.lastUpdated ? new Date(DEFAULT_CHURCH_CONTENT.lastUpdated).getTime() : 0;
          if (parsedTime >= defaultTime) {
            return normalizeChurchContent(parsed);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load custom content from localStorage", e);
    }
    return DEFAULT_CHURCH_CONTENT;
  });

  const pendingSyncRef = useRef<boolean>(false);
  const lastLocalEditTimeRef = useRef<number>(0);

  const markLocalEdits = () => {
    pendingSyncRef.current = true;
    lastLocalEditTimeRef.current = Date.now();
    try {
      localStorage.setItem('church_has_local_edits', 'true');
      localStorage.setItem('church_last_edit_time', new Date().toISOString());
    } catch {}
  };

  // Automatically save to localStorage on changes with quota safety
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.warn("Quota warning saving content, running cleanup...", e);
      try {
        localStorage.removeItem('grace_church_content_v2');
        localStorage.removeItem('church_content_cache');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      } catch (err) {
        console.error("Failed to save content to localStorage", err);
      }
    }
  }, [content]);

  // Debounced auto-save to Firestore whenever Admin edits content
  useEffect(() => {
    if (!pendingSyncRef.current) return;
    const timer = setTimeout(async () => {
      pendingSyncRef.current = false;
      setFirestoreStatus('syncing');
      try {
        const cleanPayload = sanitizeForFirestore(content);
        await setDoc(doc(db, 'church_content', 'main'), cleanPayload);
        setFirestoreStatus('connected');
        setFirestoreError(null);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setFirestoreStatus('error');
        setFirestoreError(errMsg);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [content]);

  // Sync across open browser tabs in real time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated && updated.info && updated.hero) {
            setContent(normalizeChurchContent(updated));
          }
        } catch (err) {
          console.error("Failed to parse storage sync", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [firestoreStatus, setFirestoreStatus] = useState<'connected' | 'syncing' | 'error' | 'idle'>('idle');
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Real-time Firestore synchronization on boot
  useEffect(() => {
    testConnection();
    setFirestoreStatus('syncing');

    let isMounted = true;
    const path = 'church_content/main';

    const unsubscribe = onSnapshot(
      doc(db, 'church_content', 'main'),
      (docSnap) => {
        if (!isMounted) return;
        // Avoid overwriting active typing in the admin panel
        if (pendingSyncRef.current || Date.now() - lastLocalEditTimeRef.current < 1500) {
          setFirestoreStatus('connected');
          return;
        }
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.info && data.hero) {
            const normalized = normalizeChurchContent(data);
            setContent(normalized);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            } catch {}
          }
        } else {
          // Document does not exist yet; initialize it in Firestore
          const cleanDefault = sanitizeForFirestore(DEFAULT_CHURCH_CONTENT);
          setDoc(doc(db, 'church_content', 'main'), cleanDefault).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, path);
          });
        }
        setFirestoreStatus('connected');
        setFirestoreError(null);
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Firestore onSnapshot listener notice:', error.message);
        setFirestoreStatus('error');
        setFirestoreError(error.message);
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch {
          // Keep app running gracefully if permissions or network issues arise
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const syncToFirestore = async (): Promise<{ success: boolean; message: string }> => {
    setFirestoreStatus('syncing');
    const path = 'church_content/main';
    try {
      const contentToPush = sanitizeForFirestore({
        ...content,
        lastUpdated: new Date().toISOString(),
      });
      await setDoc(doc(db, 'church_content', 'main'), contentToPush);
      setFirestoreStatus('connected');
      setFirestoreError(null);
      return { success: true, message: 'Konten berhasil disimpan & disinkronkan ke Firebase Firestore secara real-time!' };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setFirestoreStatus('error');
      setFirestoreError(errMsg);
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const updateInfo = (data: Partial<ChurchGeneralInfo>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      info: { ...prev.info, ...data },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateHero = (data: Partial<ChurchHeroContent>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...data },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateAbout = (data: Partial<ChurchAboutContent>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, ...data },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateServices = (services: ChurchServiceItem[]) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      services,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addService = (item: Omit<ChurchServiceItem, 'id'>) => {
    markLocalEdits();
    const newItem: ChurchServiceItem = {
      ...item,
      id: `srv-${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      services: [...prev.services, newItem],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteService = (id: string) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateServiceItem = (id: string, updated: Partial<ChurchServiceItem>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updated } : s)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateMinistries = (ministries: ChurchMinistryItem[]) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      ministries,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addMinistry = (item: Omit<ChurchMinistryItem, 'id'>) => {
    markLocalEdits();
    const newItem: ChurchMinistryItem = {
      ...item,
      id: `min-${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      ministries: [...prev.ministries, newItem],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteMinistry = (id: string) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      ministries: prev.ministries.filter((m) => m.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateMinistryItem = (id: string, updated: Partial<ChurchMinistryItem>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      ministries: prev.ministries.map((m) => (m.id === id ? { ...m, ...updated } : m)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateEvents = (events: ChurchEventItem[]) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      events,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addEvent = (item: Omit<ChurchEventItem, 'id'>) => {
    markLocalEdits();
    const newItem: ChurchEventItem = {
      ...item,
      id: `evt-${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      events: [newItem, ...prev.events],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteEvent = (id: string) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateEventItem = (id: string, updated: Partial<ChurchEventItem>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...updated } : e)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateGallery = (gallery: ChurchGalleryItem[]) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      gallery,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addGalleryItem = (item: Omit<ChurchGalleryItem, 'id'>) => {
    markLocalEdits();
    const newItem: ChurchGalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      gallery: [newItem, ...(prev.gallery || [])],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteGalleryItem = (id: string) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((g) => g.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateGalleryItem = (id: string, updated: Partial<ChurchGalleryItem>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).map((g) => (g.id === id ? { ...g, ...updated } : g)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const clearDefaultImages = () => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      gallery: [],
      mediaLibrary: [],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addMediaItem = (item: Omit<ChurchMediaItem, 'id' | 'uploadedAt'>): ChurchMediaItem => {
    markLocalEdits();
    const newItem: ChurchMediaItem = {
      ...item,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      uploadedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      mediaLibrary: [newItem, ...(prev.mediaLibrary || [])],
      lastUpdated: new Date().toISOString(),
    }));
    return newItem;
  };

  const deleteMediaItem = (id: string) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      mediaLibrary: (prev.mediaLibrary || []).filter((m) => m.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateMediaItem = (id: string, updated: Partial<ChurchMediaItem>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      mediaLibrary: (prev.mediaLibrary || []).map((m) => (m.id === id ? { ...m, ...updated } : m)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const getAllIndexedMedia = (): ChurchMediaItem[] => {
    const list: ChurchMediaItem[] = [...(content.mediaLibrary || [])];
    const seenUrls = new Set(list.map((m) => m.url));

    // Auto-collect Hero image
    if (content.hero?.bgImage && !seenUrls.has(content.hero.bgImage)) {
      list.push({
        id: 'auto-hero',
        title: 'Foto Hero Beranda (Saat Ini)',
        url: content.hero.bgImage,
        category: 'hero',
        description: 'Latar belakang utama beranda website',
        uploadedAt: content.lastUpdated || new Date().toISOString(),
        source: 'system',
      });
      seenUrls.add(content.hero.bgImage);
    }

    // Auto-collect About image
    if (content.about?.image && !seenUrls.has(content.about.image)) {
      list.push({
        id: 'auto-about',
        title: 'Foto Profil Gereja (Tentang Kami)',
        url: content.about.image,
        category: 'about',
        description: 'Foto persekutuan jemaat di halaman Tentang Kami',
        uploadedAt: content.lastUpdated || new Date().toISOString(),
        source: 'system',
      });
      seenUrls.add(content.about.image);
    }

    // Auto-collect Ministries images
    (content.ministries || []).forEach((min, idx) => {
      if (min.image && !seenUrls.has(min.image)) {
        list.push({
          id: `auto-min-${min.id || idx}`,
          title: min.title || `Pelayanan ${idx + 1}`,
          url: min.image,
          category: 'ministries',
          description: min.description || 'Foto bidang pelayanan',
          uploadedAt: content.lastUpdated || new Date().toISOString(),
          source: 'system',
        });
        seenUrls.add(min.image);
      }
    });

    // Auto-collect Events images
    (content.events || []).forEach((evt, idx) => {
      if (evt.image && !seenUrls.has(evt.image)) {
        list.push({
          id: `auto-evt-${evt.id || idx}`,
          title: evt.title || `Warta ${idx + 1}`,
          url: evt.image,
          category: 'events',
          description: evt.description || 'Foto kegiatan warta gereja',
          uploadedAt: content.lastUpdated || new Date().toISOString(),
          source: 'system',
        });
        seenUrls.add(evt.image);
      }
    });

    // Auto-collect Gallery images
    (content.gallery || []).forEach((gal, idx) => {
      if (gal.imageUrl && !seenUrls.has(gal.imageUrl)) {
        list.push({
          id: `auto-gal-${gal.id || idx}`,
          title: gal.title || `Dokumentasi ${idx + 1}`,
          url: gal.imageUrl,
          category: 'gallery',
          description: gal.description || 'Foto dokumentasi kegiatan gereja',
          uploadedAt: content.lastUpdated || new Date().toISOString(),
          source: 'system',
        });
        seenUrls.add(gal.imageUrl);
      }
    });

    return list;
  };

  const resetToDefaults = () => {
    setContent(DEFAULT_CHURCH_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('church_has_local_edits');
      localStorage.removeItem('church_last_edit_time');
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const getStoredAdminPassword = (): string => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  };

  const loginAdmin = (password: string): boolean => {
    const currentPass = getStoredAdminPassword();
    if (password && password.trim() === currentPass.trim()) {
      setIsAdmin(true);
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const updateAdminPassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    const currentPass = getStoredAdminPassword();
    if (oldPass.trim() !== currentPass.trim()) {
      return { success: false, message: 'Kata sandi saat ini tidak sesuai.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Kata sandi baru minimal 4 karakter.' };
    }
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, newPass.trim());
      return { success: true, message: 'Kata sandi admin berhasil diperbarui!' };
    } catch {
      return { success: false, message: 'Gagal menyimpan kata sandi ke penyimpanan peramban.' };
    }
  };

  const resetAdminPassword = () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const [hostingConfig, setHostingConfig] = useState<HostingDirectoryConfig>(() => {
    try {
      const saved = localStorage.getItem(HOSTING_CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_HOSTING_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_HOSTING_CONFIG;
  });

  const updateHostingConfig = (partial: Partial<HostingDirectoryConfig>) => {
    setHostingConfig(prev => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(HOSTING_CONFIG_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const resetHostingConfig = () => {
    try {
      localStorage.removeItem(HOSTING_CONFIG_KEY);
    } catch (e) {
      console.error(e);
    }
    setHostingConfig(DEFAULT_HOSTING_CONFIG);
  };

  const applyGepekrisTretesPreset = () => {
    setContent(GEPEKRIS_TRETES_CONTENT);
  };

  const testHostingConnection = async (urlOverride?: string, secretOverride?: string): Promise<{ success: boolean; message: string; details?: any }> => {
    let targetUrl = urlOverride || hostingConfig.serverUrl;
    const testPingUrl = targetUrl.includes('?') 
      ? `${targetUrl}&action=ping&_t=${Date.now()}` 
      : `${targetUrl}?action=ping&_t=${Date.now()}`;
    
    try {
      let res = await fetch(testPingUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      // Fallback: if .php returns 404 or 405, try without .php (for Vercel serverless)
      if (!res.ok && (res.status === 404 || res.status === 405) && targetUrl.includes('.php')) {
        const fallbackUrl = targetUrl.replace(/\.php(\?|$)/, '$1');
        const fallbackPing = fallbackUrl.includes('?') 
          ? `${fallbackUrl}&action=ping&_t=${Date.now()}` 
          : `${fallbackUrl}?action=ping&_t=${Date.now()}`;
        const fallbackRes = await fetch(fallbackPing, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        }).catch(() => null);
        if (fallbackRes && fallbackRes.ok) {
          res = fallbackRes;
          targetUrl = fallbackUrl;
          updateHostingConfig({ serverUrl: fallbackUrl });
        }
      }

      if (!res.ok) {
        return { 
          success: false, 
          message: `Server merespon dengan HTTP status ${res.status} (${res.statusText}). Jika di Vercel atau cPanel, pastikan endpoint API telah aktif.`,
        };
      }

      const json = await res.json().catch(() => null);
      return {
        success: true,
        message: 'Koneksi ke direktori server gepekristretes.org berhasil terhubung!',
        details: json,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Tidak dapat terhubung ke ${targetUrl}. (${err?.message || 'Network error'})`,
      };
    }
  };

  const syncToHosting = async (overrideConfig?: Partial<HostingDirectoryConfig>): Promise<{ success: boolean; message: string; details?: any }> => {
    const cfg = { ...hostingConfig, ...(overrideConfig || {}) };
    let targetUrl = cfg.serverUrl;
    updateHostingConfig({ lastSyncStatus: 'syncing', lastSyncError: null });

    const contentToPush: ChurchWebsiteContent = {
      ...content,
      lastUpdated: new Date().toISOString(),
    };
    setContent(contentToPush);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contentToPush));
    } catch {}

    // Pre-flight client-side validation: format check (JPG/PNG) & file/payload size check
    // This blocks invalid or oversized payloads before sending to /api/content,
    // avoiding HTTP 413 / 500 errors and ensuring local state is preserved without reset.
    const payloadValidation = validateContentPayloadForSync(contentToPush);
    if (!payloadValidation.valid) {
      const errorMsg = payloadValidation.error || 'Format gambar atau ukuran payload tidak memenuhi syarat.';
      updateHostingConfig({
        lastSyncStatus: 'error',
        lastSyncError: errorMsg,
        lastSyncTime: new Date().toISOString(),
      });
      return {
        success: false,
        message: errorMsg,
        details: {
          oversizedImages: payloadValidation.oversizedImages,
          totalSize: payloadValidation.totalSizeFormatted,
        },
      };
    }

    try {
      let res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': cfg.apiSecret,
        },
        body: JSON.stringify({
          api_secret: cfg.apiSecret,
          content: contentToPush,
        }),
      });

      // If server returns 405 (e.g. Vercel static or Apache rewriting POST to index.html)
      // and URL ends with .php, try calling the serverless endpoint without .php
      if (res.status === 405 && targetUrl.includes('.php')) {
        const fallbackUrl = targetUrl.replace(/\.php(\?|$)/, '$1');
        try {
          const fallbackRes = await fetch(fallbackUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Admin-Token': cfg.apiSecret,
            },
            body: JSON.stringify({
              api_secret: cfg.apiSecret,
              content: contentToPush,
            }),
          });
          if (fallbackRes.ok) {
            res = fallbackRes;
            targetUrl = fallbackUrl;
            updateHostingConfig({ serverUrl: fallbackUrl });
          }
        } catch {
          // Keep original response
        }
      }

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        let errorMsg = json?.message || `Gagal menyimpan ke server (HTTP ${res.status})`;
        if (res.status === 405) {
          errorMsg = `Server hosting Anda saat ini menolak metode POST (HTTP 405). Perubahan Anda tetap tersimpan aman di browser. Untuk sinkronisasi cloud, deploy berkas api/content.ts (Vercel) atau upload folder api/ ke cPanel.`;
        }
        updateHostingConfig({
          lastSyncStatus: 'error',
          lastSyncError: errorMsg,
          lastSyncTime: new Date().toISOString(),
        });
        return { success: false, message: errorMsg, details: json };
      }

      updateHostingConfig({
        lastSyncStatus: 'success',
        lastSyncError: null,
        lastSyncTime: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'Konten berhasil disimpan dan disinkronkan ke server gepekristretes.org!',
        details: json,
      };
    } catch (err: any) {
      const msg = `Gagal mengirim ke hosting: ${err?.message || 'Network Error'}.`;
      updateHostingConfig({
        lastSyncStatus: 'error',
        lastSyncError: msg,
        lastSyncTime: new Date().toISOString(),
      });
      return { success: false, message: msg };
    }
  };

  const syncFromHosting = async (overrideConfig?: Partial<HostingDirectoryConfig>): Promise<{ success: boolean; message: string; details?: any }> => {
    const cfg = { ...hostingConfig, ...(overrideConfig || {}) };
    const targetUrl = cfg.serverUrl.includes('?') 
      ? `${cfg.serverUrl}&_t=${Date.now()}` 
      : `${cfg.serverUrl}?_t=${Date.now()}`;
    
    updateHostingConfig({ lastSyncStatus: 'syncing', lastSyncError: null });

    try {
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const errorMsg = json?.message || `Gagal memuat dari hosting (HTTP ${res.status})`;
        updateHostingConfig({
          lastSyncStatus: 'error',
          lastSyncError: errorMsg,
          lastSyncTime: new Date().toISOString(),
        });
        return { success: false, message: errorMsg };
      }

      const remoteData = await res.json();
      if (remoteData && remoteData.info && remoteData.hero) {
        setContent(remoteData);
        updateHostingConfig({
          lastSyncStatus: 'success',
          lastSyncError: null,
          lastSyncTime: new Date().toISOString(),
        });
        return {
          success: true,
          message: 'Konten terbaru berhasil disinkronkan dari hosting gepekristretes.org!',
          details: remoteData,
        };
      } else {
        const errorMsg = 'Format data dari server gepekristretes.org belum memiliki struktur konten gereja yang lengkap.';
        updateHostingConfig({
          lastSyncStatus: 'error',
          lastSyncError: errorMsg,
          lastSyncTime: new Date().toISOString(),
        });
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const msg = `Gagal mengunduh data dari server: ${err?.message || 'Network Error'}.`;
      updateHostingConfig({
        lastSyncStatus: 'error',
        lastSyncError: msg,
        lastSyncTime: new Date().toISOString(),
      });
      return { success: false, message: msg };
    }
  };

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTabType>('info');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const openAdminAtTab = (tab: AdminTabType) => {
    setActiveAdminTab(tab);
    setIsAdminModalOpen(true);
  };

  const updateDailyVerse = (data: Partial<ChurchDailyVerse>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      dailyVerse: { ...(prev.dailyVerse || DEFAULT_DAILY_VERSE), ...data },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addAdditionalMinistry = (item: Omit<ChurchAdditionalMinistryItem, 'id'>) => {
    markLocalEdits();
    const newItem: ChurchAdditionalMinistryItem = {
      ...item,
      id: `add-min-${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      additionalMinistries: [...(prev.additionalMinistries || DEFAULT_ADDITIONAL_MINISTRIES), newItem],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateAdditionalMinistry = (id: string, updated: Partial<ChurchAdditionalMinistryItem>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      additionalMinistries: (prev.additionalMinistries || DEFAULT_ADDITIONAL_MINISTRIES).map((m) =>
        m.id === id ? { ...m, ...updated } : m
      ),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteAdditionalMinistry = (id: string) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      additionalMinistries: (prev.additionalMinistries || DEFAULT_ADDITIONAL_MINISTRIES).filter((m) => m.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateGiving = (data: Partial<ChurchGivingContent>) => {
    markLocalEdits();
    setContent((prev) => ({
      ...prev,
      giving: { ...(prev.giving || DEFAULT_GIVING_CONTENT), ...data },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addBankAccount = (item: Omit<ChurchBankAccount, 'id'>) => {
    markLocalEdits();
    const newItem: ChurchBankAccount = {
      ...item,
      id: `bank-${Date.now()}`,
    };
    setContent((prev) => {
      const currentGiving = prev.giving || DEFAULT_GIVING_CONTENT;
      return {
        ...prev,
        giving: {
          ...currentGiving,
          bankAccounts: [...currentGiving.bankAccounts, newItem],
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const updateBankAccount = (id: string, updated: Partial<ChurchBankAccount>) => {
    markLocalEdits();
    setContent((prev) => {
      const currentGiving = prev.giving || DEFAULT_GIVING_CONTENT;
      return {
        ...prev,
        giving: {
          ...currentGiving,
          bankAccounts: currentGiving.bankAccounts.map((b) => (b.id === id ? { ...b, ...updated } : b)),
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const deleteBankAccount = (id: string) => {
    markLocalEdits();
    setContent((prev) => {
      const currentGiving = prev.giving || DEFAULT_GIVING_CONTENT;
      return {
        ...prev,
        giving: {
          ...currentGiving,
          bankAccounts: currentGiving.bankAccounts.filter((b) => b.id !== id),
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const addGivingFund = (item: Omit<ChurchGivingFund, 'id'>) => {
    markLocalEdits();
    const newItem: ChurchGivingFund = {
      ...item,
      id: `fund-${Date.now()}`,
    };
    setContent((prev) => {
      const currentGiving = prev.giving || DEFAULT_GIVING_CONTENT;
      return {
        ...prev,
        giving: {
          ...currentGiving,
          funds: [...currentGiving.funds, newItem],
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const updateGivingFund = (id: string, updated: Partial<ChurchGivingFund>) => {
    markLocalEdits();
    setContent((prev) => {
      const currentGiving = prev.giving || DEFAULT_GIVING_CONTENT;
      return {
        ...prev,
        giving: {
          ...currentGiving,
          funds: currentGiving.funds.map((f) => (f.id === id ? { ...f, ...updated } : f)),
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const deleteGivingFund = (id: string) => {
    markLocalEdits();
    setContent((prev) => {
      const currentGiving = prev.giving || DEFAULT_GIVING_CONTENT;
      return {
        ...prev,
        giving: {
          ...currentGiving,
          funds: currentGiving.funds.filter((f) => f.id !== id),
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const importContent = (newContent: ChurchWebsiteContent) => {
    try {
      if (newContent && newContent.info && newContent.hero) {
        setContent(normalizeChurchContent(newContent));
        return true;
      }
    } catch (e) {
      console.error("Invalid content import format", e);
    }
    return false;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateInfo,
        updateHero,
        updateAbout,
        updateServices,
        addService,
        deleteService,
        updateServiceItem,
        updateMinistries,
        addMinistry,
        deleteMinistry,
        updateMinistryItem,
        addAdditionalMinistry,
        updateAdditionalMinistry,
        deleteAdditionalMinistry,
        updateGiving,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        addGivingFund,
        updateGivingFund,
        deleteGivingFund,
        updateEvents,
        addEvent,
        deleteEvent,
        updateEventItem,
        updateDailyVerse,
        updateGallery,
        addGalleryItem,
        deleteGalleryItem,
        updateGalleryItem,
        clearDefaultImages,
        addMediaItem,
        deleteMediaItem,
        updateMediaItem,
        getAllIndexedMedia,
        resetToDefaults,
        importContent,
        applyGepekrisTretesPreset,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
        resetAdminPassword,
        activeAdminTab,
        setActiveAdminTab,
        isAdminModalOpen,
        setIsAdminModalOpen,
        openAdminAtTab,
        hostingConfig,
        updateHostingConfig,
        resetHostingConfig,
        syncToHosting,
        syncFromHosting,
        testHostingConnection,
        clearCacheAndStartFresh: clearCacheAndHardReload,
        firestoreStatus,
        firestoreError,
        syncToFirestore,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useChurchContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useChurchContent must be used within a ContentProvider');
  }
  return context;
};

export { ContentProvider as ChurchContentProvider };
