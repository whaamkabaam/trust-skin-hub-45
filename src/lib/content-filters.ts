/**
 * Advanced content filtering and preprocessing for Smart Import
 */

export interface ContentAnalysis {
  filtered_content: string[];
  removed_noise: string[];
  content_quality_scores: number[];
  content_types: string[];
}

// Common web elements to filter out
const NOISE_PATTERNS = [
  // Navigation and UI elements
  /^(Skip to content|Navigation|Menu|Home|About|Contact|Blog|Reviews?)$/i,
  /^(Search|Login|Register|Sign up|Sign in)$/i,
  
  // Common website structure
  /^(Header|Footer|Sidebar|Main content)$/i,
  /^\s*\/\s*$/, // Just forward slashes
  /^[\s\-_=]+$/, // Just whitespace/separator characters
  
  // Copyright and legal
  /^©\s*\d{4}.*rights?\s+reserved/i,
  /^(Privacy Policy|Terms|Cookie Policy|Legal|Disclaimer)$/i,
  /^\d+\+?\s*or\s*\d+\+?.*depending on.*location/i, // Age restrictions
  
  // Common metadata
  /^(Published:|Updated:|Created:|Modified:)/i,
  /^(Established \d+)$/i,
  
  // Common buttons and CTAs
  /^(Click here|Learn more|Read more|View all|Show more|Load more)$/i,
  /^(Subscribe|Follow us|Share|Like|Tweet)$/i,
  
  // Empty or minimal content
  /^[^\w]*$/, // No word characters
  /^.{1,3}$/, // Very short content (1-3 chars)
  
  // Common form elements
  /^(Submit|Cancel|Reset|Clear|Save|Delete|Edit)$/i,
  
  // Social media and sharing
  /^(Facebook|Twitter|Instagram|LinkedIn|YouTube|TikTok)$/i,
  /^(Share on|Follow on|Connect with)$/i
];

// Patterns for different content types
const CONTENT_TYPE_PATTERNS = {
  rating: /\b(\d+(?:\.\d+)?)\s*[\/\-]\s*(\d+)\b|\b(\d+(?:\.\d+)?)\s*(stars?|\/5|out of \d+)\b/i,
  date: /\b(?:published|updated|created|established|since):\s*[\w\s,]+\d{4}\b/i,
  author: /^(?:by\s+|author:\s*|written by\s+)?([a-z]+(?:\s+[a-z]+)*)\s*$/i,
  company_info: /\b(?:established|founded|since|operating for)\s+[\d\s\w+]+\b/i,
  trustpilot: /trustpilot\s+[\d.]+\s*\/\s*\d+.*based on.*reviews?/i,
  reddit: /reddit.*\d+\s*%\s*positive.*based on/i,
  pros_cons: /^(?:pros?|advantages?|benefits?|good|positive)[:.]?\s*(.+)$/i,
  verdict: /^(?:verdict|conclusion|summary|final thoughts?)[:.]?\s*(.+)$/i,
  bonus: /\b(?:welcome|bonus|promo|offer|promotion)\b/i,
  payment: /\b(?:visa|mastercard|crypto|bitcoin|paypal|payment|deposit|withdrawal)\b/i,
  security: /\b(?:ssl|secure|encryption|kyc|aml|licensed|regulated)\b/i,
  support: /\b(?:support|help|customer service|live chat|24\/7)\b/i
};

/**
 * Analyze and filter content to remove noise and categorize
 */
export function analyzeContent(rawContent: string): ContentAnalysis {
  // Split content into lines/segments
  const segments = rawContent
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const filtered_content: string[] = [];
  const removed_noise: string[] = [];
  const content_quality_scores: number[] = [];
  const content_types: string[] = [];

  for (const segment of segments) {
    // Check if it's noise
    const isNoise = NOISE_PATTERNS.some(pattern => pattern.test(segment));
    
    if (isNoise) {
      removed_noise.push(segment);
      continue;
    }

    // Calculate quality score
    const qualityScore = calculateContentQuality(segment);
    
    // Only keep content with reasonable quality
    if (qualityScore >= 30) { // Threshold for meaningful content
      filtered_content.push(segment);
      content_quality_scores.push(qualityScore);
      content_types.push(classifyContentType(segment));
    } else {
      removed_noise.push(segment);
    }
  }

  return {
    filtered_content,
    removed_noise,
    content_quality_scores,
    content_types
  };
}

/**
 * Calculate content quality score (0-100)
 */
function calculateContentQuality(content: string): number {
  let score = 50; // Base score

  // Length scoring
  if (content.length > 100) score += 20;
  else if (content.length > 50) score += 10;
  else if (content.length < 10) score -= 30;

  // Word count
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 15) score += 15;
  else if (wordCount > 8) score += 10;
  else if (wordCount < 3) score -= 20;

  // Contains meaningful information
  if (/\b(?:rating|score|review|experience|opinion|recommend)\b/i.test(content)) {
    score += 20;
  }

  // Contains specific details
  if (/\b(?:deposit|withdrawal|bonus|support|game|platform|website)\b/i.test(content)) {
    score += 15;
  }

  // Penalize if it looks like UI elements
  if (/^[A-Z\s]{3,}$/.test(content)) score -= 25; // ALL CAPS short text
  if (/^\d+$/.test(content)) score -= 20; // Just numbers
  if (/^[^\w]*$/.test(content)) score -= 40; // No word characters

  return Math.max(0, Math.min(100, score));
}

/**
 * Classify content type for better parsing
 */
function classifyContentType(content: string): string {
  for (const [type, pattern] of Object.entries(CONTENT_TYPE_PATTERNS)) {
    if (pattern.test(content)) {
      return type;
    }
  }

  // Default classifications based on content characteristics
  if (content.length > 200) return 'long_text';
  if (content.split(/\s+/).length < 5) return 'short_text';
  if (/[.!?]$/.test(content)) return 'sentence';
  
  return 'unknown';
}

/**
 * Extract structured data from filtered content
 */
export function extractStructuredData(content: string[]): {
  ratings: string[];
  dates: string[];
  authors: string[];
  company_info: string[];
  pros: string[];
  cons: string[];
  payments: string[];
  security: string[];
  verdicts: string[];
} {
  const extracted = {
    ratings: [] as string[],
    dates: [] as string[],
    authors: [] as string[],
    company_info: [] as string[],
    pros: [] as string[],
    cons: [] as string[],
    payments: [] as string[],
    security: [] as string[],
    verdicts: [] as string[]
  };

  for (const item of content) {
    // Rating patterns
    const ratingMatch = item.match(/\b(\d+(?:\.\d+)?)\s*[\/\-]\s*(\d+)\b/);
    if (ratingMatch) {
      extracted.ratings.push(item);
      continue;
    }

    // Date patterns
    if (CONTENT_TYPE_PATTERNS.date.test(item)) {
      extracted.dates.push(item);
      continue;
    }

    // Author patterns
    const authorMatch = item.match(CONTENT_TYPE_PATTERNS.author);
    if (authorMatch) {
      extracted.authors.push(item);
      continue;
    }

    // Company info
    if (CONTENT_TYPE_PATTERNS.company_info.test(item)) {
      extracted.company_info.push(item);
      continue;
    }

    // Pros/Cons (simplified detection)
    if (item.toLowerCase().includes('pro') || item.toLowerCase().includes('good') || item.toLowerCase().includes('positive')) {
      extracted.pros.push(item);
      continue;
    }

    if (item.toLowerCase().includes('con') || item.toLowerCase().includes('bad') || item.toLowerCase().includes('negative')) {
      extracted.cons.push(item);
      continue;
    }

    // Payments
    if (CONTENT_TYPE_PATTERNS.payment.test(item)) {
      extracted.payments.push(item);
      continue;
    }

    // Security
    if (CONTENT_TYPE_PATTERNS.security.test(item)) {
      extracted.security.push(item);
      continue;
    }

    // Verdicts
    if (CONTENT_TYPE_PATTERNS.verdict.test(item)) {
      extracted.verdicts.push(item);
    }
  }

  return extracted;
}
