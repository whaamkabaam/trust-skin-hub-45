// Taxonomy interfaces
export interface Category {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description_rich?: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description_rich?: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface MysteryBox {
  id: string;
  operator_id?: string;
  name: string;
  slug: string;
  image_url?: string;
  game?: 'CS2' | 'Rust' | 'TF2' | 'Dota2' | 'Apple' | 'Tech';
  price: number;
  expected_value?: number;
  profit_rate?: number;
  min_price?: number;
  odds_disclosed?: 'Yes' | 'Partial' | 'No';
  verified: boolean;
  provably_fair: boolean;
  box_type: 'digital' | 'physical';
  site_name?: string;
  rarity_mix?: Record<string, any>;
  highlights?: Array<{
    name: string;
    rarity: string;
    icon?: string;
  }>;
  stats?: {
    open_count: number;
    avg_return: number;
  };
  popularity_score: number;
  release_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  operator?: Operator;
  categories?: Category[];
}

export interface Operator {
  id: string;
  name: string;
  slug?: string;
  logo: string; // legacy field
  logo_url?: string; // database field
  hero_image_url?: string;
  /** @deprecated Use content_sections with section_key='overview' instead */
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
  /** @deprecated Use content_sections with section_key='bonuses_summary' instead */
  bonus_terms?: string;
  /** @deprecated Use content_sections with section_key='security_overview' instead */
  fairness_info?: string;
  // Database fields
  promo_code?: string;
  site_type?: string;
  verification_status?: string;
  withdrawal_time_crypto?: string;
  withdrawal_time_fiat?: string;
  withdrawal_time_skins?: string;
  support_channels?: string[];
  /** @deprecated Use content_sections with section_key='company_background' instead */
  company_background?: string;
  supported_countries?: string[];
  community_links?: Record<string, string>;
  // Optional new fields (database snake_case)
  other_features?: string[];
  gaming_modes?: string[];
  games?: string[];
  categories?: string[];
  // Relations
  payment_methods?: PaymentMethod[];
  mystery_boxes?: MysteryBox[];
  derived_categories?: Category[];
}

// Legacy Case interface for backward compatibility
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

export interface RillaBoxMetricsBox {
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  floor_rate_percent: number;
  category: string;
  tags: string[];
  jackpot_items: any[];
  unwanted_items: any[];
  all_items: any[];
  provider?: string;
  provider_config?: {
    displayName: string;
    color: string;
    gradient: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

export interface BoxItem {
  name: string;
  value: number;
  drop_chance?: number;
  image?: string;
  type?: string;
}

export interface BoxAllocation {
  boxName?: string;
  count?: number;
  totalSpend?: number;
  box: RillaBoxMetricsBox;
  quantity: number;
  cost: number;
  reasoning?: string;
}

export interface OutcomeItem {
  name: string;
  value: number;
  chance: number;
  boxName: string;
  roi: number;
  amount?: number;
  probability?: number;
  label?: string;
  color?: string;
  bgColor?: string;
}

export interface OutcomeScenario {
  icon: any;
  label: string;
  description: string;
  amount: string;
  probability: number;
  color: string;
  bgColor: string;
  calculation: {
    title: string;
    formula?: string;
    result?: number;
    items: OutcomeItem[];
    methodology: string;
    totalItems: number;
    avgReturn: number;
  };
  name?: string;
}

export interface PortfolioStrategy {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  allocations?: BoxAllocation[];
  totalBudget?: number;
  expectedReturn?: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  boxes: BoxAllocation[];
  totalCost: number;
  portfolioFloorValue?: number;
  worstCaseScenario?: string;
  keyMetric?: string | { label: string; value: string; tooltip: string };
  topJackpotItem?: {
    name: string;
    value: number;
    box?: string;
  };
}

export interface HuntResult {
  boxName: string;
  boxPrice: number;
  boxImage: string;
  box: RillaBoxMetricsBox;
  targetItem: {
    name: string;
    value: number;
    dropChance?: number;
    drop_chance?: number;
  };
  expectedCost?: number;
  targetingCost?: number;
  expectedMoneyLeft?: number;
  efficiency: number;
  costRange?: {
    min: number;
    max: number;
  };
  profitProbability?: number;
  rank?: number;
}

export type TrustLevel = 'high' | 'medium' | 'low';
export type FeeLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';