export type ColorTheme =
  | 'deepBlue'     // Group 1
  | 'orange'       // Group 2
  | 'skyBlue'      // Group 3
  | 'amber'        // Group 4
  | 'emerald'      // Group 5
  | 'forestGreen'; // Group 6

export interface ScholarshipDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx';
  url: string;
}

export interface ScholarshipSection {
  id: string;
  order: number;
  number: number;
  title: string;
  icon: string;
  bullets: string[];
  customHtml?: string;
}

export interface ScholarshipContact {
  department: string;
  phone: string;
  email: string;
  address: string;
}

export interface Scholarship {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  cardTitle?: string;
  modalTitle?: string;
  shortTitle?: string;
  icon: string;
  order: number;
  isActive: boolean;
  viewsCount: number;
  targetAudience: string;
  educationLevel: 'sau-dai-hoc' | 'dai-hoc' | 'lien-ket-quoc-te' | 'du-hoc' | 'tat-ca';
  policyType: 'hoc-bong' | 'khen-thuong' | 'mien-giam' | 'tro-cap' | 'chinh-sach-nha-nuoc' | 'du-hoc';
  featuredImage?: string;
  intro: string;
  htmlContent?: string;
  introHtml?: string;
  rulesHtml?: string;
  noticesHtml?: string;
  statsHtml?: string;
  sections: ScholarshipSection[];
  documents: ScholarshipDocument[];
  contact?: ScholarshipContact;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description?: string;
  slogan?: string;
  shortTitle: string;
  themeColor?: ColorTheme;
  color?: string;
  icon?: string;
  order: number;
  isActive?: boolean;
  illustration?: 'cap' | 'handshake' | 'heart' | 'globe' | 'plane' | 'none';
}

export interface Announcement {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId?: string;
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  isActive: boolean;
  badgeText?: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  topic: string;
  content: string;
  status: 'new' | 'resolved';
  createdAt: string;
}

export type FAQCategory =
  | 'dai-hoc'
  | 'ngoai-truong'
  | 'mien-giam'
  | 'du-hoc'
  | 'sau-dai-hoc'
  | 'lien-ket'
  | 'chung'
  | 'quoc-te'
  | 'ho-so'
  | 'khac';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  categoryLabel: string;
  question: string;
  answerHtml: string;
  order: number;
  isActive: boolean;
}

export interface SiteSettings {
  portalName: string;
  universityName: string;
  parentUniversity: string;
  slogan: string;
  bannerTitle: string;
  bannerSubtitle: string;
  hotline: string;
  email: string;
  address: string;
  footerSlogan: string;
  facebookUrl: string;
  youtubeUrl: string;
  zaloUrl: string;
}

export interface DatabaseState {
  categories: Category[];
  scholarships: Scholarship[];
  announcements: Announcement[];
  faqs?: FAQItem[];
  users?: User[];
  inquiries?: ContactInquiry[];
  settings: SiteSettings;
  stats: {
    totalViews: number;
    dailyViews: { date: string; views: number }[];
  };
  lastUpdatedAt?: string;
  lastSyncedAt?: string;
}
