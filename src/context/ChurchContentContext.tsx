import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateContentPayloadForSync } from '../lib/imageValidation';

export interface ChurchGeneralInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  streamUrl: string;
  mapEmbedUrl: string;
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
}

export interface ChurchGalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  date?: string;
}

export interface ChurchWebsiteContent {
  info: ChurchGeneralInfo;
  hero: ChurchHeroContent;
  about: ChurchAboutContent;
  services: ChurchServiceItem[];
  ministries: ChurchMinistryItem[];
  events: ChurchEventItem[];
  gallery?: ChurchGalleryItem[];
  lastUpdated?: string;
}

export const DEFAULT_CHURCH_CONTENT: ChurchWebsiteContent = {
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
  gallery: [
    {
      id: "gal-1",
      title: "Ibadah Raya & Perjamuan Kudus",
      category: "Ibadah",
      imageUrl: "https://images.unsplash.com/photo-1548625361-19597793d980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5kYXklMjB3b3JzaGlwJTIwY2h1cmNoJTIwcHJheWVyfGVufDF8fHx8MTc1NjM2MTY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Suasana ibadah minggu yang khidmat dan perjamuan kudus jemaat GEPEKRIS Tretes.",
      date: "Minggu, 7 September 2025"
    },
    {
      id: "gal-2",
      title: "Persekutuan Pemuda & Remaja (Youth)",
      category: "Pemuda",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGZlbGxvd3NoaXAlMjBncm91cCUyMGZyaWVuZHN8ZW58MXx8fHwxNzU2MzYxNjU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Kebersamaan generasi muda dalam praise & worship serta diskusi firman di Tretes.",
      date: "Sabtu, 13 September 2025"
    },
    {
      id: "gal-3",
      title: "Sekolah Minggu Ceria Bersama Anak",
      category: "Sekolah Minggu",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJpYmxlJTIwc3R1ZHklMjBzbWlsaW5nfGVufDF8fHx8MTc1NjM2MTY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Aktivitas kreatif dan pujian anak-anak sekolah minggu dalam mengenal kasih Kristus.",
      date: "Minggu, 14 September 2025"
    },
    {
      id: "gal-4",
      title: "Aksi Kasih Diakonia & Baksos Warga",
      category: "Diakonia",
      imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwY29tbXVuaXR5JTIwaGVscGluZ3xlbnwxfHx8fDE3NTYzNjE2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Penyaluran paket bahan pokok dan pelayanan kasih bagi masyarakat di kawasan Prigen.",
      date: "Sabtu, 30 Agustus 2025"
    },
    {
      id: "gal-5",
      title: "Pelayanan Musik & Multimedia",
      category: "Ibadah",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjB3b3JzaGlwJTIwbXVzaWMlMjBiYW5kfGVufDF8fHx8MTc1NjM2MTY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Penyembahan dan pelayanan tim musik dalam memimpin jemaat menghadap hadirat Tuhan.",
      date: "Minggu, 31 Agustus 2025"
    },
    {
      id: "gal-6",
      title: "Retreat Keluarga & Persekutuan Jemaat",
      category: "Persekutuan",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjb21tdW5pdHklMjBmZWxsb3dzaGlwfGVufDF8fHx8MTc1NjM2MTY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Kebersamaan jemaat dalam retret pembinaan iman dan keakraban keluarga di kawasan Tretes.",
      date: "Juli 2025"
    }
  ],
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
  updateEvents: (events: ChurchEventItem[]) => void;
  addEvent: (item: Omit<ChurchEventItem, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateEventItem: (id: string, updated: Partial<ChurchEventItem>) => void;
  updateGallery: (gallery: ChurchGalleryItem[]) => void;
  addGalleryItem: (item: Omit<ChurchGalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  updateGalleryItem: (id: string, updated: Partial<ChurchGalleryItem>) => void;
  updateServiceItem: (id: string, updated: Partial<ChurchServiceItem>) => void;
  resetToDefaults: () => void;
  importContent: (newContent: ChurchWebsiteContent) => boolean;
  applyGepekrisTretesPreset: () => void;
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  resetAdminPassword: () => void;
  hostingConfig: HostingDirectoryConfig;
  updateHostingConfig: (config: Partial<HostingDirectoryConfig>) => void;
  resetHostingConfig: () => void;
  syncToHosting: (overrideConfig?: Partial<HostingDirectoryConfig>) => Promise<{ success: boolean; message: string; details?: any }>;
  syncFromHosting: (overrideConfig?: Partial<HostingDirectoryConfig>) => Promise<{ success: boolean; message: string; details?: any }>;
  testHostingConnection: (url?: string, secret?: string) => Promise<{ success: boolean; message: string; details?: any }>;
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

  const events = Array.isArray(raw.events)
    ? raw.events.map((e: any, idx: number) => ({
        id: e?.id || `evt-${idx + 1}`,
        title: e?.title || `Kegiatan ${idx + 1}`,
        date: e?.date || '',
        time: e?.time || '',
        location: e?.location || '',
        description: e?.description || '',
        category: e?.category || 'Umum',
        featured: !!e?.featured,
        content: e?.content,
        image: e?.image,
        author: e?.author,
        slug: e?.slug,
      }))
    : DEFAULT_CHURCH_CONTENT.events;

  const gallery = Array.isArray(raw.gallery)
    ? raw.gallery.map((g: any, idx: number) => ({
        id: g?.id || `gal-${idx + 1}`,
        title: g?.title || `Dokumentasi ${idx + 1}`,
        category: g?.category || 'Kegiatan',
        imageUrl: g?.imageUrl || g?.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
        description: g?.description || '',
        date: g?.date || '',
      }))
    : (DEFAULT_CHURCH_CONTENT.gallery || []);

  return {
    ...DEFAULT_CHURCH_CONTENT,
    ...raw,
    info: { ...DEFAULT_CHURCH_CONTENT.info, ...(raw.info || {}) },
    hero: { ...DEFAULT_CHURCH_CONTENT.hero, ...(raw.hero || {}) },
    about: { ...DEFAULT_CHURCH_CONTENT.about, ...(raw.about || {}) },
    services,
    ministries,
    events,
    gallery,
    lastUpdated: raw.lastUpdated || DEFAULT_CHURCH_CONTENT.lastUpdated,
  };
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ChurchWebsiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('grace_church_content_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If saved data was the old Grace church, automatically discard and use GEPEKRIS Tretes
        if (parsed.info?.name && !parsed.info.name.includes('Grace')) {
          return normalizeChurchContent(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load custom content from localStorage", e);
    }
    return DEFAULT_CHURCH_CONTENT;
  });

  const markLocalEdits = () => {
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

  // Background fetch latest content from server ONLY ONCE on initial app load
  useEffect(() => {
    let isCancelled = false;

    const fetchRemoteContent = async () => {
      const hasLocalEdits = localStorage.getItem('church_has_local_edits') === 'true';
      const hasSavedStorage = !!localStorage.getItem(STORAGE_KEY);

      // Try endpoints: api/content.php, api/content, and data/church_content.json with anti-cache timestamp
      const endpoints = [
        `/api/content.php?_t=${Date.now()}`,
        `/api/content?_t=${Date.now()}`,
        `/data/church_content.json?_t=${Date.now()}`,
      ];

      for (const endpoint of endpoints) {
        if (isCancelled) break;
        try {
          const res = await fetch(endpoint, {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
            },
          }).catch(() => null);

          if (res && res.ok) {
            const remoteRaw = await res.json().catch(() => null);
            if (remoteRaw && remoteRaw.info && remoteRaw.hero) {
              if (isCancelled) break;

              const remoteJson = normalizeChurchContent(remoteRaw);
              
              setContent((prev) => {
                // If the user has local edits or saved storage in this browser, preserve their work
                if (hasLocalEdits || hasSavedStorage) {
                  if (prev.lastUpdated && remoteJson.lastUpdated) {
                    const localTime = new Date(prev.lastUpdated).getTime();
                    const remoteTime = new Date(remoteJson.lastUpdated).getTime();
                    // Only adopt remote if remote is STRICTLY newer than local edits
                    if (remoteTime <= localTime) {
                      return prev;
                    }
                  } else {
                    return prev;
                  }
                }

                // If no local edits or remote is strictly newer, adopt remote
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteJson));
                } catch {}
                return remoteJson;
              });
              break;
            }
          }
        } catch {
          // Continue to next endpoint fallback
        }
      }
    };

    fetchRemoteContent();

    // Note: Deliberately DO NOT re-fetch on window focus or visibilitychange.
    // Re-fetching when returning from the OS file picker was causing newly chosen photos to be overwritten!

    return () => {
      isCancelled = true;
    };
  }, []);

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

  // Auto-load latest content from gepekristretes.org if enabled
  useEffect(() => {
    if (hostingConfig.enabled && hostingConfig.autoLoad && hostingConfig.serverUrl) {
      const fetchRemote = async () => {
        try {
          const fetchUrl = hostingConfig.serverUrl.includes('?') 
            ? `${hostingConfig.serverUrl}&_t=${Date.now()}` 
            : `${hostingConfig.serverUrl}?_t=${Date.now()}`;
          const res = await fetch(fetchUrl, {
            headers: { 'Accept': 'application/json' },
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.info && data.hero) {
              setContent(prev => ({
                ...prev,
                ...data,
                info: { ...prev.info, ...(data.info || {}) },
                hero: { ...prev.hero, ...(data.hero || {}) },
                about: { ...prev.about, ...(data.about || {}) },
              }));
              updateHostingConfig({
                lastSyncStatus: 'success',
                lastSyncTime: new Date().toISOString(),
                lastSyncError: null,
              });
            }
          }
        } catch {
          // Silent fallback to local storage
        }
      };
      fetchRemote();
    }
  }, []);

  const importContent = (newContent: ChurchWebsiteContent) => {
    try {
      if (newContent && newContent.info && newContent.hero) {
        setContent(newContent);
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
        updateEvents,
        addEvent,
        deleteEvent,
        updateEventItem,
        updateGallery,
        addGalleryItem,
        deleteGalleryItem,
        updateGalleryItem,
        resetToDefaults,
        importContent,
        applyGepekrisTretesPreset,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
        resetAdminPassword,
        hostingConfig,
        updateHostingConfig,
        resetHostingConfig,
        syncToHosting,
        syncFromHosting,
        testHostingConnection,
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
