/**
 * Centralized price formatting utility to ensure consistent price display
 * Always shows 2 decimal places for amounts with cents (e.g., $0.10 instead of $0.1)
 */
export const formatPrice = (value: number | string): string => {
  if (!value && value !== 0) return '$0.00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || numValue < 0) return '$0.00';
  
  // Always format to 2 decimal places
  return `$${numValue.toFixed(2)}`;
};

/**
 * Format price for display in cards and grids
 * Ensures consistent formatting across all box cards
 */
export const formatBoxPrice = (price: number | string): string => {
  return formatPrice(price);
};

/**
 * Format currency with proper decimal places for statistics
 * Used in category stats and detailed views
 */
export const formatCurrency = (value: number | string): string => {
  if (!value && value !== 0) return '$0.00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || numValue < 0) return '$0.00';
  
  // For large amounts, show with commas but always 2 decimal places
  if (numValue >= 1000) {
    return `$${numValue.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
  
  return `$${numValue.toFixed(2)}`;
};

/**
 * Format currency for compact display (used in summary cards)
 * Shows k/M notation for large values but maintains precision for small values
 */
export const formatCompactCurrency = (value: number | string): string => {
  if (!value && value !== 0) return '$0.00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || numValue < 0) return '$0.00';
  
  // For very large amounts, use compact notation
  if (numValue >= 1000000) {
    return `$${(numValue / 1000000).toFixed(2)}M`;
  }
  if (numValue >= 1000) {
    return `$${(numValue / 1000).toFixed(2)}k`;
  }
  
  // For small amounts, always show 2 decimal places
  return `$${numValue.toFixed(2)}`;
};