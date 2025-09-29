import { Operator, Case, MysteryBox, Review, BlogPost } from '@/types';

export const sampleOperators: Operator[] = [
  {
    id: 'stake',
    name: 'Stake.com',
    logo: '/img/operators/stake.png',
    verdict: 'Leading crypto casino with instant payouts',
    overallRating: 4.8,
    feeLevel: 'Very Low',
    paymentMethods: ['crypto', 'cards'],
    modes: ['Sports Betting', 'Casino', 'Originals', 'Live Casino'],
    pros: ['Instant crypto withdrawals', 'No KYC required', 'Excellent mobile app', 'Live streaming'],
    cons: ['Crypto only deposits', 'Not available in all countries'],
    trustScore: 4.9,
    fees: {
      deposit: 0,
      withdrawal: 0,
      trading: 0
    },
    payoutSpeed: 'Instant',
    kycRequired: false,
    countries: ['Global except restricted'],
    url: 'https://stake.com',
    verified: true,
    otherFeatures: ['Drop feed', 'Community Chat', 'Free play drop'],
    gamingModes: ['Roulette', 'Jackpot', 'Coinflip'],
    games: ['Slots', 'Blackjack', 'Roulette', 'Live games', 'Plinko', 'Mines', 'Crash'],
    categories: ['CS2', 'Dota2', 'Rust']
  },
  {
    id: 'csgoroll',
    name: 'CSGORoll',
    logo: '/img/operators/csgoroll.png',
    verdict: 'Top CS2 skin gambling platform',
    overallRating: 4.6,
    feeLevel: 'Low',
    paymentMethods: ['skins', 'crypto'],
    modes: ['Roulette', 'Crash', 'Coinflip', 'Dice', 'Cases'],
    pros: ['Established reputation', 'Skin deposits/withdrawals', 'Fair provability', 'Active community'],
    cons: ['Limited to CS2 skins', 'High minimum bets'],
    trustScore: 4.7,
    fees: {
      deposit: 0,
      withdrawal: 2,
      trading: 3
    },
    payoutSpeed: '10-30 minutes',
    kycRequired: false,
    countries: ['Global except US'],
    url: 'https://csgoroll.com',
    verified: true,
    otherFeatures: ['Drop feed', 'Custom boxes'],
    gamingModes: ['Battles', 'Upgrader', 'Coinflip', 'Roulette'],
    games: ['Crash', 'Mines'],
    categories: ['CS2', 'Team Fortress 2']
  },
  {
    id: 'daddyskins',
    name: 'DaddySkins',
    logo: '/img/operators/daddyskins.png',
    verdict: 'Popular skin marketplace and gambling',
    overallRating: 4.2,
    feeLevel: 'Medium',
    paymentMethods: ['skins', 'crypto', 'cards'],
    modes: ['Cases', 'Roulette', 'Coinflip', 'Marketplace'],
    pros: ['Dual marketplace/gambling', 'Good case selection', 'Regular bonuses'],
    cons: ['Higher fees than competitors', 'Limited customer support hours'],
    trustScore: 4.1,
    fees: {
      deposit: 1,
      withdrawal: 4,
      trading: 5
    },
    payoutSpeed: '20-45 minutes',
    kycRequired: false,
    countries: ['Global except restricted'],
    url: 'https://daddyskins.com',
    verified: true
  },
  {
    id: 'rollbit',
    name: 'Rollbit',
    logo: '/img/operators/rollbit.jpg',
    verdict: 'Crypto casino with NFT integration',
    overallRating: 4.4,
    feeLevel: 'Low',
    paymentMethods: ['crypto'],
    modes: ['Sports Betting', 'Casino', 'NFT Battles', 'Futures'],
    pros: ['NFT integration', 'Sports betting', 'Own token (RLB)', 'Fast payouts'],
    cons: ['Complex interface for beginners', 'Limited fiat options'],
    trustScore: 4.3,
    fees: {
      deposit: 0,
      withdrawal: 1,
      trading: 2
    },
    payoutSpeed: '5-15 minutes',
    kycRequired: false,
    countries: ['Global except restricted'],
    url: 'https://rollbit.com',
    verified: true
  },
  {
    id: 'bc-game',
    name: 'BC.Game',
    logo: '/img/operators/bc-game.png',
    verdict: 'Comprehensive crypto gaming platform',
    overallRating: 4.5,
    feeLevel: 'Low',
    paymentMethods: ['crypto', 'cards'],
    modes: ['Sports Betting', 'Casino', 'Lottery', 'Crash', 'Originals'],
    pros: ['Huge game selection', 'Multiple cryptocurrencies', 'Generous bonuses', 'VIP program'],
    cons: ['Website can be slow', 'Complex bonus terms'],
    trustScore: 4.4,
    fees: {
      deposit: 0,
      withdrawal: 2,
      trading: 3
    },
    payoutSpeed: '15-30 minutes',
    kycRequired: false,
    countries: ['Global except restricted'],
    url: 'https://bc.game',
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
    slug: 'premium-knife-collection',
    image_url: '/img/boxes/premium-knife.jpg',
    game: 'CS2',
    box_type: 'digital',
    price: 49.99,
    min_price: 49.99,
    odds_disclosed: 'Yes',
    verified: true,
    provably_fair: true,
    popularity_score: 3240,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    release_date: '2024-01-15T00:00:00Z',
    highlights: [
      { name: 'Karambit | Fade', icon: '/img/knives/karambit.svg', rarity: 'Legendary' },
      { name: 'Butterfly Knife | Tiger Tooth', icon: '/img/knives/butterfly.svg', rarity: 'Legendary' },
      { name: 'M9 Bayonet | Doppler', icon: '/img/knives/m9.svg', rarity: 'Epic' }
    ],
    stats: {
      open_count: 3240,
      avg_return: 1.15
    }
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