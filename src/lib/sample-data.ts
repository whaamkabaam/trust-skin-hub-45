import { Operator, Case, MysteryBox, Review, BlogPost } from '@/types';

export const sampleOperators: Operator[] = [
  {
    id: 'clash-gg',
    name: 'Clash.gg',
    logo: '/img/operators/clash-gg.svg',
    verdict: 'Fast payouts, clear pricing',
    overallRating: 4.3,
    feeLevel: 'Low',
    paymentMethods: ['skins', 'crypto', 'cards'],
    modes: ['Cases', 'Crash', 'Coinflip', 'Roulette'],
    pros: ['Quick withdrawals', 'Transparent fees', 'Good mobile UX'],
    cons: ['Limited payment options', 'No live chat'],
    trustScore: 4.2,
    fees: {
      deposit: 0,
      withdrawal: 3,
      trading: 5
    },
    payoutSpeed: '15 minutes',
    kycRequired: false,
    countries: ['Global except US'],
    url: 'https://clash.gg',
    verified: true
  },
  {
    id: 'key-drop',
    name: 'Key-Drop',
    logo: '/img/operators/key-drop.svg', 
    verdict: 'Premium cases, higher costs',
    overallRating: 4.0,
    feeLevel: 'Medium',
    paymentMethods: ['skins', 'cards'],
    modes: ['Cases', 'Contracts', 'Upgrader'],
    pros: ['Quality cases', 'Fair odds', 'Strong reputation'],
    cons: ['Higher fees', 'Slower support'],
    trustScore: 4.4,
    fees: {
      deposit: 2,
      withdrawal: 5,
      trading: 7
    },
    payoutSpeed: '1-2 hours',
    kycRequired: true,
    countries: ['EU', 'UK', 'Canada'],
    url: 'https://key-drop.com',
    verified: true
  },
  {
    id: 'hellcase',
    name: 'Hellcase',
    logo: '/img/operators/hellcase.svg',
    verdict: 'Wide selection, mixed reviews',
    overallRating: 3.7,
    feeLevel: 'Medium',
    paymentMethods: ['skins', 'crypto'],
    modes: ['Cases', 'Upgrade', 'Contracts'],
    pros: ['Large case library', 'Regular promotions', 'Mobile app'],
    cons: ['Inconsistent odds', 'Support delays'],
    trustScore: 3.5,
    fees: {
      deposit: 1,
      withdrawal: 4,
      trading: 6
    },
    payoutSpeed: '30-60 minutes',
    kycRequired: false,
    countries: ['Global except restricted'],
    url: 'https://hellcase.com',
    verified: true
  }
];

export const sampleCases: Case[] = [
  {
    id: 'revolution-case',
    name: 'Revolution Case',
    image: '/img/cases/revolution-case.jpg',
    game: 'CS2',
    minPrice: 2.49,
    oddsDisclosed: 'Yes',
    verified: true,
    highlights: [
      { name: 'AK-47 | Nightwish', icon: '/img/weapons/ak47.svg', rarity: 'Covert' },
      { name: 'M4A4 | Temukau', icon: '/img/weapons/m4a4.svg', rarity: 'Covert' },
      { name: 'AWP | Duality', icon: '/img/weapons/awp.svg', rarity: 'Classified' }
    ],
    stats: {
      openCount: 15420,
      avgReturn: 0.73
    },
    releaseDate: '2023-02-15'
  },
  {
    id: 'recoil-case',
    name: 'Recoil Case',
    image: '/img/cases/recoil-case.jpg',
    game: 'CS2',
    minPrice: 0.89,
    oddsDisclosed: 'Partial',
    verified: true,
    highlights: [
      { name: 'AK-47 | Leet Museo', icon: '/img/weapons/ak47.svg', rarity: 'Covert' },
      { name: 'M4A4 | Royal Paladin', icon: '/img/weapons/m4a4.svg', rarity: 'Covert' },
      { name: 'Dual Berettas | Flora Carnivora', icon: '/img/weapons/duals.svg', rarity: 'Classified' }
    ],
    stats: {
      openCount: 23801,
      avgReturn: 0.45
    },
    releaseDate: '2022-07-01'
  }
];

export const sampleMysteryBoxes: MysteryBox[] = [
  {
    id: 'premium-knife-box',
    name: 'Premium Knife Collection',
    image: '/img/boxes/premium-knife.jpg',
    game: 'CS2',
    type: 'digital',
    category: 'Knives',
    minPrice: 49.99,
    oddsDisclosed: 'Yes',
    verified: true,
    highlights: [
      { name: 'Karambit | Fade', icon: '/img/knives/karambit.svg', rarity: 'Legendary' },
      { name: 'Butterfly Knife | Tiger Tooth', icon: '/img/knives/butterfly.svg', rarity: 'Legendary' },
      { name: 'M9 Bayonet | Doppler', icon: '/img/knives/m9.svg', rarity: 'Epic' }
    ],
    stats: {
      openCount: 3240,
      avgReturn: 1.15
    },
    releaseDate: '2024-01-15'
  }
];

export const sampleReviews: Review[] = [
  {
    id: 'r_001',
    entityId: 'clash-gg',
    entityType: 'operator',
    user: 'NovaR***',
    verified: 'operator',
    rating: 5,
    subscores: { trust: 5, fees: 4, ux: 5, support: 4 },
    title: 'Fast cashout, clear fees',
    body: 'Payout hit my wallet in under 15 minutes. Fees are listed clearly and the mobile UI is smooth. Support could be faster but overall great experience.',
    helpful: { up: 12, down: 1 },
    photos: ['/img/reviews/r_001_1.jpg'],
    createdAt: '2024-08-24T15:03:00Z',
    operatorResponse: {
      body: 'Thanks for the feedback—glad withdrawals were quick!',
      createdAt: '2024-08-25T09:11:00Z'
    }
  },
  {
    id: 'r_002',
    entityId: 'key-drop',
    entityType: 'operator',
    user: 'SkinHunt***',
    verified: 'operator',
    rating: 4,
    subscores: { trust: 5, fees: 3, ux: 4, support: 3 },
    title: 'Reliable but expensive',
    body: 'Been using Key-Drop for 6 months. Great case selection and fair odds, but fees add up quickly. KYC process was smooth.',
    helpful: { up: 8, down: 2 },
    createdAt: '2024-08-20T10:22:00Z'
  }
];

export const sampleBlogPosts: BlogPost[] = [
  {
    id: 'cs2-trading-guide-2024',
    title: 'CS2 Skin Trading Guide: Market Analysis for 2024',
    excerpt: 'Essential strategies for CS2 skin trading in 2024, including market trends, risk management, and platform comparisons.',
    content: '# CS2 Skin Trading Guide: Market Analysis for 2024\n\nThe CS2 trading market has evolved significantly...',
    author: {
      name: 'Alex Chen',
      credentials: '5 years CS:GO/CS2 trading experience',
      avatar: '/img/authors/alex-chen.jpg'
    },
    publishedAt: '2024-08-25T09:00:00Z',
    updatedAt: '2024-08-25T09:00:00Z',
    category: 'Trading',
    tags: ['CS2', 'Trading', 'Market Analysis'],
    featured: true,
    image: '/img/blog/cs2-trading-2024.jpg',
    readTime: 8
  },
  {
    id: 'case-opening-odds-explained',
    title: 'Case Opening Odds: What You Need to Know',
    excerpt: 'Understanding probability in CS2 case openings and how to make informed decisions.',
    content: '# Case Opening Odds: What You Need to Know\n\nCase opening is exciting but requires understanding...',
    author: {
      name: 'Sarah Williams', 
      credentials: 'Data Analyst, 3+ years gaming research',
      avatar: '/img/authors/sarah-williams.jpg'
    },
    publishedAt: '2024-08-20T14:30:00Z',
    updatedAt: '2024-08-22T10:15:00Z',
    category: 'Education',
    tags: ['Cases', 'Probability', 'Education'],
    featured: false,
    image: '/img/blog/case-odds.jpg',
    readTime: 6
  }
];