export type Language = 'en' | 'id';

export interface ServiceSchedule {
  id: string;
  name: string;
  nameId: string;
  day: string;
  time: string;
  location: string;
  description: string;
  descriptionId: string;
  tag: string;
  tagId: string;
  isNext?: boolean;
}

export interface Sermon {
  id: string;
  title: string;
  titleId: string;
  speaker: string;
  role: string;
  date: string;
  scripture: string;
  series: string;
  duration: string;
  category: 'Faith' | 'Hope' | 'Family' | 'Grace' | 'Purpose';
  thumbnail: string;
  videoUrl?: string;
  audioUrl?: string;
  summary: string;
  summaryId: string;
  keyPoints: string[];
  keyPointsId: string[];
}

export interface ChurchEvent {
  id: string;
  title: string;
  titleId: string;
  date: string;
  time: string;
  location: string;
  category: 'Worship' | 'Youth' | 'Community' | 'Outreach' | 'Seminar';
  description: string;
  descriptionId: string;
  image: string;
  spotsLeft?: number;
  rsvpCount: number;
  featured?: boolean;
}

export interface Ministry {
  id: string;
  name: string;
  nameId: string;
  leader: string;
  schedule: string;
  targetAudience: string;
  description: string;
  descriptionId: string;
  image: string;
  tags: string[];
}

export interface PrayerRequest {
  id: string;
  author: string;
  category: 'Healing' | 'Family' | 'Work/Studies' | 'Guidance' | 'Thanksgiving';
  request: string;
  date: string;
  prayersCount: number;
  isPrivate: boolean;
  prayedByMe?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  roleId: string;
  bio: string;
  bioId: string;
  image: string;
  email?: string;
}

export interface GivingPledge {
  id: string;
  donorName: string;
  amount: number;
  currency: 'IDR' | 'USD';
  fund: string;
  frequency: 'one-time' | 'weekly' | 'monthly';
  paymentMethod: 'qris' | 'bank_transfer' | 'credit_card';
  date: string;
  receiptNumber: string;
}
