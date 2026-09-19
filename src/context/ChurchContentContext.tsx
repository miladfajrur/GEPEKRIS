import React, { createContext, useContext, useState, useEffect } from 'react';

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

export interface ChurchWebsiteContent {
  info: ChurchGeneralInfo;
  hero: ChurchHeroContent;
  about: ChurchAboutContent;
  services: ChurchServiceItem[];
  ministries: ChurchMinistryItem[];
  events: ChurchEventItem[];
}

export const DEFAULT_CHURCH_CONTENT: ChurchWebsiteContent = {
  info: {
    name: "Grace Community Church",
    tagline: "A place where faith grows, community thrives, and love abounds",
    address: "123 Faith Street, Grace City, GC 12345",
    phone: "(555) 123-4567",
    email: "info@gracecommunitychurch.org",
    officeHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    streamUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126922.11585890987!2d106.75883658253909!3d-6.229386684698585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e49fe32743%3A0xb35a0f62d1d0c410!2sJakarta!5e0!3m2!1sen!2sid!4v1690000000000!5m2!1sen!2sid",
  },
  hero: {
    headline: "Welcome to Grace Community Church",
    subheadline: "A place where faith grows, community thrives, and love abounds",
    bgImage: "https://images.unsplash.com/photo-1724398932316-e0d488b96e15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBzYW5jdHVhcnklMjBpbnRlcmlvciUyMHBlYWNlZnVsfGVufDF8fHx8MTc1NjM2MTYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    sundayNoteTitle: "Join Us This Sunday",
    sundayNoteTimes: "Service Times: 9:00 AM & 11:00 AM • Main Sanctuary & Online",
  },
  about: {
    heading: "About Our Church",
    paragraph1: "Grace Community Church has been serving our community for over 25 years. We are a vibrant, diverse congregation committed to following Jesus Christ and making a positive impact in our world.",
    paragraph2: "Our mission is to know God and make Him known through authentic worship, biblical teaching, and loving service to others. We believe that everyone has a place in God's family and in our church family.",
    image: "https://images.unsplash.com/photo-1658734029438-d97357737bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwcGVvcGxlJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU2MzYxNjU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    values: [
      {
        iconName: "Heart",
        title: "Love",
        description: "We believe love is the foundation of our faith and community",
      },
      {
        iconName: "Users",
        title: "Community",
        description: "Building meaningful relationships and supporting one another",
      },
      {
        iconName: "Book",
        title: "Truth",
        description: "Committed to biblical teaching and authentic discipleship",
      },
      {
        iconName: "Star",
        title: "Hope",
        description: "Bringing hope and transformation to our city and beyond",
      },
    ],
  },
  services: [
    {
      id: "srv-1",
      name: "Sunday Morning Worship",
      times: ["9:00 AM", "11:00 AM"],
      description: "Join us for inspiring worship, biblical teaching, and fellowship",
      iconName: "Clock",
    },
    {
      id: "srv-2",
      name: "Wednesday Bible Study",
      times: ["7:00 PM"],
      description: "Dive deeper into God's word with our midweek study",
      iconName: "Calendar",
    },
    {
      id: "srv-3",
      name: "Youth Service",
      times: ["6:00 PM Sunday"],
      description: "Engaging worship and relevant teaching for teens",
      iconName: "Users",
    },
  ],
  ministries: [
    {
      id: "min-1",
      title: "Children's Ministry",
      description: "Fun, safe, and engaging programs for kids from birth to 5th grade",
      image: "https://images.unsplash.com/photo-1713012633197-1426a345ca99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN1bmRheSUyMHNjaG9vbHxlbnwxfHx8fDE3NTYzNjE2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Sunday School", "Vacation Bible School", "Children's Worship"],
    },
    {
      id: "min-2",
      title: "Youth Ministry",
      description: "Connecting teens with God and each other through relevant teaching and fun activities",
      image: "https://images.unsplash.com/photo-1545886082-e66c6b9e011a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMGdyb3VwJTIwdGVlbmFnZXJzfGVufDF8fHx8MTc1NjM2MTY3OHww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Youth Group", "Summer Camps", "Mission Trips"],
    },
    {
      id: "min-3",
      title: "Community Outreach",
      description: "Serving our neighbors and making a difference in our community",
      image: "https://images.unsplash.com/photo-1560220604-1985ebfe28b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwc2VydmluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NTYzNjE2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Food Bank", "Homeless Ministry", "Community Events"],
    },
  ],
  events: [
    {
      id: "evt-1",
      title: "Easter Sunday Celebration",
      date: "March 31, 2024",
      time: "9:00 AM & 11:00 AM",
      location: "Main Sanctuary",
      description: "Join us for a special Easter service celebrating the resurrection of Jesus Christ",
      category: "Special Service",
      featured: true,
    },
    {
      id: "evt-2",
      title: "Community Food Drive",
      date: "April 5-12, 2024",
      time: "All Week",
      location: "Church Lobby",
      description: "Help us collect food donations for local families in need",
      category: "Outreach",
    },
    {
      id: "evt-3",
      title: "Men's Breakfast",
      date: "April 13, 2024",
      time: "8:00 AM",
      location: "Fellowship Hall",
      description: "Monthly fellowship breakfast with guest speaker",
      category: "Fellowship",
    },
    {
      id: "evt-4",
      title: "Youth Retreat",
      date: "April 19-21, 2024",
      time: "Weekend",
      location: "Camp Wilderness",
      description: "Annual youth retreat with worship, teaching, and outdoor activities",
      category: "Youth",
    },
    {
      id: "evt-5",
      title: "Women's Conference",
      date: "April 27, 2024",
      time: "9:00 AM - 4:00 PM",
      location: "Main Sanctuary",
      description: "A day of worship, teaching, and fellowship for women of all ages",
      category: "Special Event",
    },
    {
      id: "evt-6",
      title: "Volunteer Appreciation Dinner",
      date: "May 4, 2024",
      time: "6:00 PM",
      location: "Fellowship Hall",
      description: "Celebrating our amazing volunteers with dinner and recognition",
      category: "Fellowship",
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

const STORAGE_KEY = 'grace_church_content_v2';
const ADMIN_STORAGE_KEY = 'grace_church_admin_pwd';
const ADMIN_AUTH_KEY = 'grace_church_admin_auth';
const HOSTING_CONFIG_KEY = 'gepekristretes_hosting_config_v1';
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
  updateEvents: (events: ChurchEventItem[]) => void;
  addEvent: (item: Omit<ChurchEventItem, 'id'>) => void;
  deleteEvent: (id: string) => void;
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

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ChurchWebsiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CHURCH_CONTENT,
          ...parsed,
          info: { ...DEFAULT_CHURCH_CONTENT.info, ...(parsed.info || {}) },
          hero: { ...DEFAULT_CHURCH_CONTENT.hero, ...(parsed.hero || {}) },
          about: { ...DEFAULT_CHURCH_CONTENT.about, ...(parsed.about || {}) },
          services: parsed.services || DEFAULT_CHURCH_CONTENT.services,
          ministries: parsed.ministries || DEFAULT_CHURCH_CONTENT.ministries,
          events: parsed.events || DEFAULT_CHURCH_CONTENT.events,
        };
      }
    } catch (e) {
      console.error("Failed to load custom content from localStorage", e);
    }
    return DEFAULT_CHURCH_CONTENT;
  });

  // Automatically save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error("Failed to save content to localStorage", e);
    }
  }, [content]);

  const updateInfo = (data: Partial<ChurchGeneralInfo>) => {
    setContent((prev) => ({ ...prev, info: { ...prev.info, ...data } }));
  };

  const updateHero = (data: Partial<ChurchHeroContent>) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, ...data } }));
  };

  const updateAbout = (data: Partial<ChurchAboutContent>) => {
    setContent((prev) => ({ ...prev, about: { ...prev.about, ...data } }));
  };

  const updateServices = (services: ChurchServiceItem[]) => {
    setContent((prev) => ({ ...prev, services }));
  };

  const addService = (item: Omit<ChurchServiceItem, 'id'>) => {
    const newItem: ChurchServiceItem = {
      ...item,
      id: `srv-${Date.now()}`,
    };
    setContent((prev) => ({ ...prev, services: [...prev.services, newItem] }));
  };

  const deleteService = (id: string) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  const updateMinistries = (ministries: ChurchMinistryItem[]) => {
    setContent((prev) => ({ ...prev, ministries }));
  };

  const addMinistry = (item: Omit<ChurchMinistryItem, 'id'>) => {
    const newItem: ChurchMinistryItem = {
      ...item,
      id: `min-${Date.now()}`,
    };
    setContent((prev) => ({ ...prev, ministries: [...prev.ministries, newItem] }));
  };

  const deleteMinistry = (id: string) => {
    setContent((prev) => ({
      ...prev,
      ministries: prev.ministries.filter((m) => m.id !== id),
    }));
  };

  const updateEvents = (events: ChurchEventItem[]) => {
    setContent((prev) => ({ ...prev, events }));
  };

  const addEvent = (item: Omit<ChurchEventItem, 'id'>) => {
    const newItem: ChurchEventItem = {
      ...item,
      id: `evt-${Date.now()}`,
    };
    setContent((prev) => ({ ...prev, events: [newItem, ...prev.events] }));
  };

  const deleteEvent = (id: string) => {
    setContent((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };

  const resetToDefaults = () => {
    setContent(DEFAULT_CHURCH_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
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
    const targetUrl = urlOverride || hostingConfig.serverUrl;
    const testPingUrl = targetUrl.includes('?') 
      ? `${targetUrl}&action=ping&_t=${Date.now()}` 
      : `${targetUrl}?action=ping&_t=${Date.now()}`;
    
    try {
      const res = await fetch(testPingUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        return { 
          success: false, 
          message: `Server merespon dengan HTTP status ${res.status} (${res.statusText}). Pastikan file api/content.php sudah diunggah di gepekristretes.org.`,
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
        message: `Tidak dapat terhubung ke ${targetUrl}. Kemungkinan CORS belum aktif, file belum diupload di hosting, atau server offline. (${err?.message || 'Network error'})`,
      };
    }
  };

  const syncToHosting = async (overrideConfig?: Partial<HostingDirectoryConfig>): Promise<{ success: boolean; message: string; details?: any }> => {
    const cfg = { ...hostingConfig, ...(overrideConfig || {}) };
    const targetUrl = cfg.serverUrl;
    updateHostingConfig({ lastSyncStatus: 'syncing', lastSyncError: null });

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': cfg.apiSecret,
        },
        body: JSON.stringify({
          api_secret: cfg.apiSecret,
          content: content,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg = json?.message || `Gagal menyimpan ke server (HTTP ${res.status})`;
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
        message: 'Konten berhasil disimpan ke direktori hosting gepekristretes.org!',
        details: json,
      };
    } catch (err: any) {
      const msg = `Gagal mengirim ke hosting: ${err?.message || 'Network Error'}. Pastikan content.php sudah diunggah di hosting gepekristretes.org.`;
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
        updateMinistries,
        addMinistry,
        deleteMinistry,
        updateEvents,
        addEvent,
        deleteEvent,
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
