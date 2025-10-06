// Utility functions for formatting backend data into user-friendly labels

/**
 * Format payment method names from backend format to user-friendly display
 */
export function formatPaymentMethod(method: string | any): string {
  if (!method) return '';
  if (typeof method !== 'string') return String(method);
  
  const methodMap: Record<string, string> = {
    'debit_card': 'Debit Card',
    'credit_card': 'Credit Card',
    'visa': 'Visa',
    'mastercard': 'Mastercard',
    'american_express': 'American Express',
    'paypal': 'PayPal',
    'skrill': 'Skrill',
    'neteller': 'Neteller',
    'paysafecard': 'Paysafecard',
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
    'litecoin': 'Litecoin',
    'dogecoin': 'Dogecoin',
    'usdt': 'USDT',
    'crypto': 'Crypto',
    'cs2_skins': 'CS2 Skins',
    'csgo_skins': 'CS:GO Skins',
    'dota2_skins': 'Dota 2 Skins',
    'tf2_skins': 'TF2 Skins',
    'rust_skins': 'Rust Skins',
    'skins': 'Skins',
    'bank_transfer': 'Bank Transfer',
    'wire_transfer': 'Wire Transfer',
    'apple_pay': 'Apple Pay',
    'google_pay': 'Google Pay',
    'samsung_pay': 'Samsung Pay'
  };

  return methodMap[method.toLowerCase()] || formatGenericLabel(method);
}

/**
 * Format support channel names from backend format to user-friendly display
 */
export function formatSupportChannel(channel: string | any): string {
  if (!channel) return '';
  if (typeof channel !== 'string') return String(channel);
  
  const channelMap: Record<string, string> = {
    'live_chat': 'Live Chat',
    'email_support': 'Email Support',
    'phone_support': 'Phone Support',
    'ticket_system': 'Ticket System',
    'discord': 'Discord',
    'telegram': 'Telegram',
    'twitter': 'Twitter',
    'facebook': 'Facebook',
    'reddit': 'Reddit',
    'community_forum': 'Community Forum',
    'faq': 'FAQ',
    'help_center': 'Help Center',
    'knowledge_base': 'Knowledge Base'
  };

  return channelMap[channel.toLowerCase()] || formatGenericLabel(channel);
}

/**
 * Format game names from backend format to user-friendly display
 */
export function formatGameName(game: string | any): string {
  if (!game) return '';
  if (typeof game !== 'string') return String(game);
  
  const gameMap: Record<string, string> = {
    'cs2': 'CS2',
    'csgo': 'CS:GO',
    'counter_strike': 'Counter-Strike',
    'dota2': 'Dota 2',
    'dota_2': 'Dota 2',
    'tf2': 'Team Fortress 2',
    'team_fortress_2': 'Team Fortress 2',
    'rust': 'Rust',
    'pubg': 'PUBG',
    'valorant': 'Valorant',
    'apex_legends': 'Apex Legends',
    'fortnite': 'Fortnite',
    'overwatch': 'Overwatch',
    'rocket_league': 'Rocket League'
  };

  return gameMap[game.toLowerCase()] || formatGenericLabel(game);
}

/**
 * Format gaming mode names from backend format to user-friendly display
 */
export function formatGamingMode(mode: string | any): string {
  if (!mode) return '';
  if (typeof mode !== 'string') return String(mode);
  
  const modeMap: Record<string, string> = {
    'case_opening': 'Case Opening',
    'mystery_box': 'Mystery Box',
    'skin_trading': 'Skin Trading',
    'gambling': 'Gambling',
    'betting': 'Betting',
    'crash': 'Crash',
    'dice': 'Dice',
    'roulette': 'Roulette',
    'coinflip': 'Coinflip',
    'jackpot': 'Jackpot',
    'slots': 'Slots',
    'blackjack': 'Blackjack',
    'poker': 'Poker',
    'esports_betting': 'Esports Betting',
    'live_betting': 'Live Betting'
  };

  return modeMap[mode.toLowerCase()] || formatGenericLabel(mode);
}

/**
 * Format feature names from backend format to user-friendly display
 */
export function formatFeatureName(feature: string | any): string {
  if (!feature) return '';
  if (typeof feature !== 'string') return String(feature);
  
  const featureMap: Record<string, string> = {
    'provably_fair': 'Provably Fair',
    'instant_withdrawal': 'Instant Withdrawal',
    'no_kyc': 'No KYC Required',
    'kyc_required': 'KYC Required',
    'mobile_app': 'Mobile App',
    'live_support': 'Live Support',
    'vip_program': 'VIP Program',
    'loyalty_rewards': 'Loyalty Rewards',
    'referral_bonus': 'Referral Bonus',
    'welcome_bonus': 'Welcome Bonus',
    'deposit_bonus': 'Deposit Bonus',
    'free_spins': 'Free Spins',
    'cashback': 'Cashback',
    'tournament': 'Tournaments',
    'leaderboard': 'Leaderboards',
    'social_features': 'Social Features',
    'chat_system': 'Chat System'
  };

  return featureMap[feature.toLowerCase()] || formatGenericLabel(feature);
}

/**
 * Format category names from backend format to user-friendly display
 */
export function formatCategoryName(category: string | any): string {
  if (!category) return '';
  if (typeof category !== 'string') return String(category);
  
  const categoryMap: Record<string, string> = {
    'case_opening': 'Case Opening',
    'mystery_boxes': 'Mystery Boxes',
    'skin_trading': 'Skin Trading',
    'gambling': 'Gambling',
    'esports_betting': 'Esports Betting',
    'casino': 'Casino',
    'crash_games': 'Crash Games',
    'dice_games': 'Dice Games',
    'roulette': 'Roulette',
    'slots': 'Slots',
    'poker': 'Poker',
    'blackjack': 'Blackjack'
  };

  return categoryMap[category.toLowerCase()] || formatGenericLabel(category);
}

/**
 * Generic formatter for any underscore/hyphen separated string
 */
export function formatGenericLabel(label: string): string {
  if (!label) return '';
  
  return label
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert rating from 5-star scale to 10-star scale
 */
export function convertRatingTo10Scale(rating: number, currentScale: number = 5): number {
  if (currentScale === 10) return rating;
  return Math.round((rating / currentScale) * 10 * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert rating from 10-star scale to 5-star scale for star display
 */
export function convertRatingTo5Scale(rating: number, currentScale: number = 10): number {
  if (currentScale === 5) return rating;
  return Math.round((rating / currentScale) * 5 * 10) / 10; // Round to 1 decimal place
}

/**
 * Format verification status
 */
export function formatVerificationStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'verified': 'Verified',
    'unverified': 'Unverified',
    'pending': 'Pending Verification',
    'rejected': 'Verification Rejected'
  };

  return statusMap[status.toLowerCase()] || formatGenericLabel(status);
}

/**
 * Format withdrawal time
 */
export function formatWithdrawalTime(time: string): string {
  if (!time || time === 'N/A') return 'N/A';
  
  const timeMap: Record<string, string> = {
    'instant': 'Instant',
    'within_1_hour': 'Within 1 Hour',
    'within_24_hours': '1-24 Hours',
    'within_72_hours': '1-3 Days',
    'within_1_week': '3-7 Days',
    'manual_review': 'Manual Review Required'
  };

  return timeMap[time.toLowerCase()] || formatGenericLabel(time);
}