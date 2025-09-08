import type { OperatorBonus, OperatorPayment, OperatorSecurity, OperatorFAQ } from '@/hooks/useOperatorExtensions';

export const createBonusTemplate = (operatorId: string): OperatorBonus[] => [
  {
    operator_id: operatorId,
    title: 'Welcome Bonus',
    value: 'Free $10 + 3 Cases',
    description: 'New players receive $10 credit and 3 free cases upon registration',
    bonus_type: 'welcome',
    terms: 'Valid for new accounts only. Cases must be opened within 7 days.',
    is_active: true,
    order_number: 1
  },
  {
    operator_id: operatorId,
    title: 'Daily Rakeback',
    value: 'Up to 10%',
    description: 'Get up to 10% of your losses back daily',
    bonus_type: 'rakeback',
    terms: 'Calculated on net losses over 24 hours. Minimum rakeback $1.',
    is_active: true,
    order_number: 2
  }
];

export const createPaymentTemplate = (operatorId: string): OperatorPayment[] => [
  // Deposit methods
  {
    operator_id: operatorId,
    payment_method: 'Visa/Mastercard',
    method_type: 'deposit',
    minimum_amount: 10,
    maximum_amount: 5000,
    fee_percentage: 0,
    processing_time: 'Instant',
    is_available: true
  },
  {
    operator_id: operatorId,
    payment_method: 'Bitcoin',
    method_type: 'deposit',
    minimum_amount: 25,
    maximum_amount: 10000,
    fee_percentage: 0,
    processing_time: '10-30 minutes',
    is_available: true
  },
  {
    operator_id: operatorId,
    payment_method: 'Steam Items',
    method_type: 'deposit',
    minimum_amount: 5,
    fee_percentage: 0,
    processing_time: 'Instant',
    is_available: true
  },
  // Withdrawal methods
  {
    operator_id: operatorId,
    payment_method: 'Steam Trade',
    method_type: 'withdrawal',
    minimum_amount: 5,
    fee_percentage: 0,
    processing_time: 'Instant - 24 hours',
    is_available: true
  },
  {
    operator_id: operatorId,
    payment_method: 'Bitcoin',
    method_type: 'withdrawal',
    minimum_amount: 50,
    fee_percentage: 2,
    processing_time: '1-6 hours',
    is_available: true
  }
];

export const createSecurityTemplate = (operatorId: string): OperatorSecurity => ({
  operator_id: operatorId,
  ssl_enabled: true,
  ssl_provider: 'CloudFlare SSL',
  license_info: 'Licensed and regulated by Curacao Gaming Authority',
  provably_fair: true,
  provably_fair_description: 'All case openings use cryptographic hash verification. Players can verify each result using our provably fair system.',
  compliance_certifications: ['SSL Certificate', 'Gaming License', 'Anti-Money Laundering Compliance'],
  data_protection_info: 'User data encrypted with AES-256. GDPR compliant data handling.',
  responsible_gaming_info: 'Self-exclusion tools available. Deposit limits can be set.',
  complaints_platform: 'Internal dispute resolution available 24/7',
  audit_info: 'Regular third-party security audits conducted'
});

export const createFAQTemplate = (operatorId: string, operatorName: string): OperatorFAQ[] => [
  {
    operator_id: operatorId,
    question: `Is ${operatorName} legitimate and safe?`,
    answer: `Yes, ${operatorName} is a legitimate platform with proper licensing, SSL encryption, and provably fair gaming. All transactions are secure and transparent.`,
    category: 'security',
    is_featured: true,
    order_number: 1
  },
  {
    operator_id: operatorId,
    question: 'How do payouts work?',
    answer: 'Skin payouts are processed instantly through Steam trade. Crypto withdrawals take 1-6 hours depending on network confirmation.',
    category: 'payments',
    is_featured: true,
    order_number: 2
  },
  {
    operator_id: operatorId,
    question: 'What are the fees and limits?',
    answer: 'Deposits start from $10 with no fees for most methods. Withdrawal fees vary by payment method. See payment section for details.',
    category: 'payments',
    is_featured: true,
    order_number: 3
  }
];