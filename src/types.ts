export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  author: string;
  division: string;
  imageUrl: string;
  isPublic: boolean; // 전체 공유 (true) vs 회원 전용 (false)
  createdAt: string;
  likes: number;
}

export interface Registration {
  id: string;
  name: string;
  department: string;
  phoneNumber: string;
  experience: 'beginner' | 'intermediate' | 'expert';
  createdAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface GearItem {
  id: string;
  category: 'backpack' | 'tent' | 'sleeping' | 'cooking' | 'utility';
  name: string;
  specs: string;
  price: string;
  whyRecommend: string;
  tip: string;
}

export type NavTab = 'home' | 'guide' | 'gallery' | 'admin';
