export interface Operator {
  id: string;
  name: string;
  slug?: string;
  logo: string;
  hero_image_url?: string;
  verdict: string;
  overallRating: number;
  feeLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  paymentMethods: Array<'skins' | 'crypto' | 'cards'>;
  modes: string[];
  pros: string[];
  cons: string[];
  trustScore: number;
  fees: {
    deposit: number;
    withdrawal: number;
    trading: number;
  };
  payoutSpeed: string;
  kycRequired: boolean;
  countries: string[];
  url: string;
  verified: boolean;
  launch_year?: number;
  ratings?: {
    overall?: number;
    trust?: number;
    value?: number;
    ux?: number;
    support?: number;
    offering?: number;
    payments?: number;
  };
  bonus_terms?: string;
  fairness_info?: string;
  // Optional new fields
  otherFeatures?: string[];
  gamingModes?: string[];
  games?: string[];
  categories?: string[];
}

export interface Case {
  id: string;
  name: string;
  image: string;
  game: 'CS2' | 'Rust' | 'TF2' | 'Dota2';
  minPrice: number;
  oddsDisclosed: 'Yes' | 'Partial' | 'No';
  verified: boolean;
  highlights: Array<{
    name: string;
    icon: string;
    rarity: string;
  }>;
  stats: {
    openCount: number;
    avgReturn: number;
  };
  releaseDate: string;
}

export interface MysteryBox extends Case {
  type: 'digital' | 'physical';
  category: string;
}

export interface Review {
  id: string;
  entityId: string;
  entityType: 'operator' | 'case' | 'mysterybox';
  user: string;
  verified: 'operator' | 'opener' | false;
  rating: number;
  subscores: {
    trust: number;
    fees: number;
    ux: number;
    support: number;
  };
  title: string;
  body: string;
  helpful: {
    up: number;
    down: number;
  };
  photos?: string[];
  createdAt: string;
  operatorResponse?: {
    body: string;
    createdAt: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    credentials: string;
    avatar: string;
  };
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
  readTime: number;
}

export type TrustLevel = 'high' | 'medium' | 'low';
export type FeeLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';