import { MysteryBoxData } from '@/components/MysteryBoxCard';

/**
 * Transforms Trust Skin Hub mystery box format to RillaBox format
 * for consistent rendering across all pages
 */
export const transformToRillaBoxFormat = (trustHubBox: any): MysteryBoxData => {
  // Calculate EV percentage
  const evPercent = trustHubBox.expected_value && trustHubBox.price 
    ? (trustHubBox.expected_value / trustHubBox.price) * 100 
    : 0;
  
  // Determine volatility bucket based on available data
  let volatilityBucket: 'Low' | 'Medium' | 'High' = 'Medium';
  if (trustHubBox.volatility !== undefined) {
    if (trustHubBox.volatility < 100) volatilityBucket = 'Low';
    else if (trustHubBox.volatility > 300) volatilityBucket = 'High';
  } else if (trustHubBox.risk_level) {
    volatilityBucket = trustHubBox.risk_level as 'Low' | 'Medium' | 'High';
  }
  
  // Map operator to provider
  const providerMap: Record<string, string> = {
    'rillabox': 'rillabox',
    'hypedrop': 'hypedrop',
    'casesgg': 'casesgg',
    'luxdrop': 'luxdrop',
    'cases-gg': 'casesgg',
    'cases.gg': 'casesgg'
  };
  
  const operatorSlug = trustHubBox.operator?.slug?.toLowerCase() || '';
  const provider = providerMap[operatorSlug] || 'rillabox';
  
  // Map provider to site name for display
  const siteNameMap: Record<string, string> = {
    'rillabox': 'RillaBox',
    'hypedrop': 'Hypedrop',
    'casesgg': 'Cases.GG',
    'luxdrop': 'LuxDrop'
  };
  
  return {
    box_name: trustHubBox.name || 'Unknown Box',
    box_price: Number(trustHubBox.price) || 0,
    box_image: trustHubBox.image_url || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
    expected_value_percent_of_price: evPercent,
    volatility_bucket: volatilityBucket,
    standard_deviation_percent: Number(trustHubBox.volatility) || 0,
    floor_rate_percent: Number(trustHubBox.floor_rate_percent) || 0,
    category: trustHubBox.category || 'Mystery Boxes',
    tags: Array.isArray(trustHubBox.tags) ? trustHubBox.tags : [],
    provider: provider,
    site_name: siteNameMap[provider] || provider
  };
};

/**
 * Batch transform multiple boxes
 */
export const transformBoxes = (trustHubBoxes: any[]): MysteryBoxData[] => {
  return trustHubBoxes.map(transformToRillaBoxFormat);
};


