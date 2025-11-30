/**
 * Smart auto-assignment rules for categorizing content
 */

export interface AutoAssignmentResult {
  assignments: Array<{
    content: string;
    field: string;
    confidence: number;
    reason: string;
  }>;
  unassigned: string[];
}

export interface AssignmentRule {
  field: string;
  patterns: RegExp[];
  keywords: string[];
  contextKeywords?: string[];
  minConfidence: number;
  maxLength?: number;
  minLength?: number;
}

// Comprehensive assignment rules
const ASSIGNMENT_RULES: AssignmentRule[] = [
  // Ratings and scores
  {
    field: 'operator.rating',
    patterns: [
      /\b(?:our rating|overall rating|score):\s*(\d+(?:\.\d+)?)\s*[\/\-]\s*(\d+)\b/i,
      /\b(\d+(?:\.\d+)?)\s*[\/\-]\s*(\d+)\b/
    ],
    keywords: ['rating', 'score', '/10', '/5', 'stars'],
    minConfidence: 85
  },

  // Operator name
  {
    field: 'operator.name',
    patterns: [
      /^([A-Za-z0-9]+(?:\.[a-z]{2,3})?)\s*(?:review|casino|site|platform)?$/i
    ],
    keywords: ['review', 'casino', 'site', 'platform', '.com', '.gg'],
    minConfidence: 80,
    maxLength: 50
  },

  // Dates
  {
    field: 'metadata.date',
    patterns: [
      /(?:published|updated|created|established):\s*([\w\s,]+\d{4})/i,
      /\b(established \d{4})\b/i
    ],
    keywords: ['published', 'updated', 'created', 'established', '2024', '2025'],
    minConfidence: 90
  },

  // Author information
  {
    field: 'review.author',
    patterns: [
      /^([A-Z][a-z]+ [A-Z][a-z]+)$/,
      /^(Project Lead|Chief Editor|Reviewer|Author)$/i
    ],
    keywords: ['project lead', 'chief editor', 'reviewer', 'author'],
    minConfidence: 75,
    maxLength: 100
  },

  // Welcome offers and bonuses
  {
    field: 'operator.welcome_bonus',
    patterns: [
      /welcome\s+offer/i,
      /bonus.*%/i,
      /free\s+spins?/i
    ],
    keywords: ['welcome', 'bonus', 'offer', 'free', 'spins', '%', 'deposit'],
    minConfidence: 80
  },

  // Bonus Terms (now in content_sections)
  {
    field: 'content_sections.bonuses_summary',
    patterns: [
      /bonus(?:es)?\s+(?:terms?|summary)[:\s]+(.*?)(?:\n\n|$)/is,
      /wagering\s+requirements?[:\s]+(.*?)(?:\n|$)/i
    ],
    keywords: ['bonus', 'bonuses', 'wagering', 'terms', 'requirements', 'promotion'],
    minConfidence: 70
  },

  // Company background (now in content_sections)
  {
    field: 'content_sections.company_background',
    patterns: [
      /(?:company|corporate)\s+background[:\s]+(.*?)(?:\n\n|$)/is,
      /(?:about|history)[:\s]+(.*?)(?:\n\n|$)/is,
      /established \d{4}/i,
      /operating for \d+\+? years?/i,
      /registered in \w+/i
    ],
    keywords: ['company', 'background', 'history', 'founded', 'established', 'operating', 'registered'],
    minConfidence: 70
  },

  // Fairness Info (now in content_sections)
  {
    field: 'content_sections.fairness',
    patterns: [
      /fairness[:\s]+(.*?)(?:\n\n|$)/is,
      /provably\s+fair[:\s]+(.*?)(?:\n\n|$)/is
    ],
    keywords: ['fairness', 'provably fair', 'random', 'rng', 'algorithm'],
    minConfidence: 75
  },

  // Trust and legitimacy indicators
  {
    field: 'operator.trust_indicators',
    patterns: [
      /trustpilot\s+[\d.]+\s*\/\s*\d+/i,
      /ssl\s+cert/i,
      /kyc\s+on\s+wins/i,
      /provably\s+fair/i
    ],
    keywords: ['trustpilot', 'ssl', 'kyc', 'provably fair', 'secure', 'verified', 'licensed'],
    minConfidence: 85
  },

  // Payment methods
  {
    field: 'operator.payment_methods',
    patterns: [
      /visa\/mastercard/i,
      /crypto.*(?:coming soon|tba)/i,
      /payment processing/i
    ],
    keywords: ['visa', 'mastercard', 'crypto', 'payment', 'deposit', 'withdrawal'],
    minConfidence: 80
  },

  // Platform features
  {
    field: 'operator.features',
    patterns: [
      /drop rate transparency/i,
      /per item odds/i,
      /number of boxes?: \d+/i,
      /delivery time?: [\d\-]+ days?/i
    ],
    keywords: ['boxes', 'odds', 'delivery', 'transparency', 'features'],
    minConfidence: 75
  },


  // Pros and cons
  {
    field: 'operator.pros',
    patterns: [
      /^(?:pros?|advantages?|benefits?|good points?)[:.]?\s*(.+)/i,
      /✓\s*(.+)/,
      /\+\s*(.+)/
    ],
    keywords: ['pros', 'advantages', 'benefits', 'good', 'positive', '✓', '+'],
    minConfidence: 75
  },

  {
    field: 'operator.cons',
    patterns: [
      /^(?:cons?|disadvantages?|negatives?|bad points?)[:.]?\s*(.+)/i,
      /✗\s*(.+)/,
      /\-\s*(.+)/
    ],
    keywords: ['cons', 'disadvantages', 'negatives', 'bad', 'issues', '✗', '-'],
    minConfidence: 75
  },

  // Review content
  {
    field: 'review.content',
    patterns: [
      /my experience with/i,
      /i tried/i,
      /user review/i
    ],
    keywords: ['experience', 'tried', 'review', 'opinion', 'think', 'feel'],
    minConfidence: 60,
    minLength: 30
  },

  // FAQ content
  {
    field: 'extensions.faq',
    patterns: [
      /frequently asked questions?/i,
      /^(?:q:|question:)/i,
      /^(?:a:|answer:)/i
    ],
    keywords: ['faq', 'question', 'answer', 'frequently asked'],
    minConfidence: 85
  }
];

/**
 * Apply auto-assignment rules to content
 */
export function applyAutoAssignmentRules(content: string[]): AutoAssignmentResult {
  const assignments: AutoAssignmentResult['assignments'] = [];
  const unassigned: string[] = [];
  const processedContent = new Set<string>();

  for (const item of content) {
    if (processedContent.has(item)) continue;

    let bestMatch: {
      field: string;
      confidence: number;
      reason: string;
    } | null = null;

    // Test against all rules
    for (const rule of ASSIGNMENT_RULES) {
      const confidence = calculateMatchConfidence(item, rule);
      
      if (confidence >= rule.minConfidence) {
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = {
            field: rule.field,
            confidence,
            reason: getMatchReason(item, rule)
          };
        }
      }
    }

    if (bestMatch) {
      assignments.push({
        content: item,
        field: bestMatch.field,
        confidence: bestMatch.confidence,
        reason: bestMatch.reason
      });
      processedContent.add(item);
    } else {
      unassigned.push(item);
    }
  }

  return { assignments, unassigned };
}

/**
 * Calculate confidence score for a rule match
 */
function calculateMatchConfidence(content: string, rule: AssignmentRule): number {
  let confidence = 0;

  // Check length constraints
  if (rule.maxLength && content.length > rule.maxLength) return 0;
  if (rule.minLength && content.length < rule.minLength) return 0;

  // Pattern matching (highest weight)
  for (const pattern of rule.patterns) {
    if (pattern.test(content)) {
      confidence += 40; // High confidence for exact pattern match
      break;
    }
  }

  // Keyword matching
  const contentLower = content.toLowerCase();
  const keywordMatches = rule.keywords.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  ).length;
  
  if (keywordMatches > 0) {
    confidence += (keywordMatches / rule.keywords.length) * 30;
  }

  // Context keywords (bonus points)
  if (rule.contextKeywords) {
    const contextMatches = rule.contextKeywords.filter(keyword =>
      contentLower.includes(keyword.toLowerCase())
    ).length;
    
    if (contextMatches > 0) {
      confidence += (contextMatches / rule.contextKeywords.length) * 15;
    }
  }

  // Content quality adjustments
  if (content.length > 100) confidence += 5; // Substantial content
  if (content.split(/\s+/).length > 10) confidence += 5; // Multiple words

  // Penalize if content looks like UI elements
  if (/^[A-Z\s]{3,}$/.test(content)) confidence -= 20; // ALL CAPS
  if (/^\d+$/.test(content)) confidence -= 15; // Just numbers

  return Math.min(100, Math.max(0, confidence));
}

/**
 * Get human-readable reason for match
 */
function getMatchReason(content: string, rule: AssignmentRule): string {
  const reasons: string[] = [];

  // Check which pattern matched
  for (const pattern of rule.patterns) {
    if (pattern.test(content)) {
      reasons.push('matched pattern');
      break;
    }
  }

  // Check keyword matches
  const contentLower = content.toLowerCase();
  const matchedKeywords = rule.keywords.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  );
  
  if (matchedKeywords.length > 0) {
    reasons.push(`contains keywords: ${matchedKeywords.slice(0, 3).join(', ')}`);
  }

  return reasons.length > 0 ? reasons.join('; ') : 'general match';
}

/**
 * Get suggested assignments for bulk operations
 */
export function getBulkAssignmentSuggestions(content: string[]): {
  [field: string]: string[];
} {
  const suggestions: { [field: string]: string[] } = {};
  
  const result = applyAutoAssignmentRules(content);
  
  for (const assignment of result.assignments) {
    if (!suggestions[assignment.field]) {
      suggestions[assignment.field] = [];
    }
    suggestions[assignment.field].push(assignment.content);
  }

  return suggestions;
}