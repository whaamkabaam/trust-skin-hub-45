/**
 * Enhanced slug generation and normalization utilities
 * Handles special characters, unicode, and provides robust matching
 */

export interface SlugMatch {
  originalName: string;
  slug: string;
  score: number;
  provider: string;
}

/**
 * Normalize a string for slug generation
 * Handles unicode, special characters, and common variations
 */
export const normalizeString = (str: string): string => {
  if (!str) return '';
  
  return str
    // Normalize unicode characters
    .normalize('NFD')
    // Remove diacritical marks
    .replace(/[\u0300-\u036f]/g, '')
    // Convert to lowercase
    .toLowerCase()
    // Replace special characters and spaces with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-');
};

/**
 * Generate a URL-safe slug from box name
 * Enhanced version that handles edge cases and special characters
 */
export const generateSlug = (boxName: string): string => {
  if (!boxName) return '';
  
  // First normalize the string
  let slug = normalizeString(boxName);
  
  // Handle common abbreviations and replacements
  const replacements: Record<string, string> = {
    'and': 'n',
    'the': '',
    'box': '',
    'case': '',
    'mystery': 'myst',
    'premium': 'prem',
    'ultimate': 'ult',
    'special': 'spec',
    'limited': 'ltd',
    'edition': 'ed'
  };
  
  // Apply replacements for common words to shorten slugs
  Object.entries(replacements).forEach(([word, replacement]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    slug = slug.replace(regex, replacement);
  });
  
  // Clean up after replacements
  slug = slug
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
  
  return slug || 'unknown-box';
};

/**
 * Calculate similarity score between two strings
 * Uses Levenshtein distance with normalization
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2) return 0;
  
  const normalize = (s: string) => normalizeString(s);
  const a = normalize(str1);
  const b = normalize(str2);
  
  if (a === b) return 1;
  
  // Levenshtein distance calculation
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  const maxLength = Math.max(a.length, b.length);
  return maxLength === 0 ? 1 : (maxLength - matrix[b.length][a.length]) / maxLength;
};

/**
 * Advanced matching function that tries multiple strategies
 */
export const findBestMatches = (searchSlug: string, boxNames: string[]): SlugMatch[] => {
  const results: SlugMatch[] = [];
  
  boxNames.forEach((boxName, index) => {
    const boxSlug = generateSlug(boxName);
    let score = 0;
    
    // Stage 1: Exact slug match (highest priority)
    if (boxSlug === searchSlug) {
      score = 1.0;
    }
    // Stage 2: Partial slug match
    else if (boxSlug.includes(searchSlug) || searchSlug.includes(boxSlug)) {
      score = 0.8;
    }
    // Stage 3: Name similarity matching
    else {
      const nameScore = calculateSimilarity(searchSlug, boxSlug);
      const originalNameScore = calculateSimilarity(searchSlug, normalizeString(boxName));
      score = Math.max(nameScore, originalNameScore) * 0.6;
    }
    
    // Boost score for shorter, more precise matches
    if (score > 0.3) {
      const lengthDiff = Math.abs(boxSlug.length - searchSlug.length);
      const lengthPenalty = Math.min(lengthDiff / Math.max(boxSlug.length, searchSlug.length), 0.3);
      score = Math.max(0, score - lengthPenalty);
    }
    
    if (score > 0.3) { // Only include matches with reasonable confidence
      results.push({
        originalName: boxName,
        slug: boxSlug,
        score,
        provider: '' // Will be set by caller
      });
    }
  });
  
  return results.sort((a, b) => b.score - a.score);
};

/**
 * Extract search keywords from a slug for fuzzy matching
 */
export const extractKeywords = (slug: string): string[] => {
  return slug
    .split('-')
    .filter(word => word.length > 2) // Ignore very short words
    .filter(word => !['the', 'and', 'box', 'case'].includes(word)); // Filter common words
};

/**
 * Check if two slugs are likely the same box with different naming
 */
export const areSlugsEquivalent = (slug1: string, slug2: string): boolean => {
  if (!slug1 || !slug2) return false;
  
  const keywords1 = new Set(extractKeywords(slug1));
  const keywords2 = new Set(extractKeywords(slug2));
  
  // Check for significant keyword overlap
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  
  const overlap = intersection.size / union.size;
  return overlap > 0.6; // 60% keyword overlap suggests same box
};