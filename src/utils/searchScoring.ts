/**
 * Search relevance scoring system for mystery boxes
 * Prioritizes name matches over tag matches to improve search quality
 */

export interface SearchMatch {
  score: number;
  matchType: 'exact_name' | 'partial_name' | 'category' | 'tag' | 'partial_tag';
  matchedTerm: string;
}

/**
 * Calculate search relevance score for a mystery box
 * Higher scores indicate better matches
 */
export const calculateSearchScore = (
  searchTerm: string,
  boxName: string,
  category: string,
  tags: string[]
): SearchMatch | null => {
  const searchLower = searchTerm.toLowerCase().trim();
  const nameLower = boxName.toLowerCase();
  const categoryLower = category.toLowerCase();
  
  if (!searchLower) return null;

  let bestMatch: SearchMatch | null = null;

  // 1. Exact box name match (highest priority)
  if (nameLower === searchLower) {
    bestMatch = {
      score: 100,
      matchType: 'exact_name',
      matchedTerm: boxName
    };
  }
  // 2. Box name starts with search term
  else if (nameLower.startsWith(searchLower)) {
    bestMatch = {
      score: 85,
      matchType: 'partial_name',
      matchedTerm: boxName
    };
  }
  // 3. Box name contains search term
  else if (nameLower.includes(searchLower)) {
    // Score based on position (earlier = better) and length ratio
    const position = nameLower.indexOf(searchLower);
    const lengthRatio = searchLower.length / nameLower.length;
    const positionPenalty = Math.min(position * 2, 20); // Max 20 point penalty
    const baseScore = 75 + (lengthRatio * 10) - positionPenalty;
    
    bestMatch = {
      score: Math.max(baseScore, 60), // Minimum 60 for name matches
      matchType: 'partial_name',
      matchedTerm: boxName
    };
  }
  // 4. Category match
  else if (categoryLower.includes(searchLower)) {
    bestMatch = {
      score: 50,
      matchType: 'category',
      matchedTerm: category
    };
  }
  // 5. Tag matches (lower priority)
  else {
    let bestTagScore = 0;
    let bestTagMatch = '';
    
    for (const tag of tags) {
      const tagLower = String(tag).toLowerCase();
      
      // Exact tag match
      if (tagLower === searchLower) {
        const score = 35;
        if (score > bestTagScore) {
          bestTagScore = score;
          bestTagMatch = tag;
        }
      }
      // Partial tag match
      else if (tagLower.includes(searchLower)) {
        // Score based on how much of the tag matches
        const lengthRatio = searchLower.length / tagLower.length;
        const score = Math.min(25 + (lengthRatio * 10), 30);
        if (score > bestTagScore) {
          bestTagScore = score;
          bestTagMatch = tag;
        }
      }
    }
    
    if (bestTagScore > 0) {
      bestMatch = {
        score: bestTagScore,
        matchType: bestTagScore > 30 ? 'tag' : 'partial_tag',
        matchedTerm: bestTagMatch
      };
    }
  }

  return bestMatch;
};

/**
 * Enhanced multi-word search scoring
 * Handles searches like "high roller" by checking both individual words and the full phrase
 */
export const calculateMultiWordSearchScore = (
  searchTerm: string,
  boxName: string,
  category: string,
  tags: string[]
): SearchMatch | null => {
  const words = searchTerm.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
  
  if (words.length === 0) return null;
  if (words.length === 1) return calculateSearchScore(searchTerm, boxName, category, tags);

  // Try full phrase first
  const fullPhraseMatch = calculateSearchScore(searchTerm, boxName, category, tags);
  if (fullPhraseMatch && fullPhraseMatch.score >= 60) {
    return fullPhraseMatch;
  }

  // Try individual words and combine scores
  const nameLower = boxName.toLowerCase();
  let totalScore = 0;
  let matchedWords = 0;
  let bestMatchType: SearchMatch['matchType'] = 'partial_tag';
  let matchedTerm = '';

  for (const word of words) {
    if (word.length < 2) continue; // Skip very short words
    
    const wordMatch = calculateSearchScore(word, boxName, category, tags);
    if (wordMatch && wordMatch.score > 0) {
      totalScore += wordMatch.score;
      matchedWords++;
      
      // Use the best match type
      if (wordMatch.matchType === 'exact_name' || wordMatch.matchType === 'partial_name') {
        bestMatchType = wordMatch.matchType;
        matchedTerm = boxName;
      }
    }
  }

  // Bonus for matching all words
  if (matchedWords === words.length && matchedWords > 1) {
    totalScore += 15; // All words matched bonus
  }

  // Bonus for words appearing in sequence in the name
  if (matchedWords >= 2) {
    const searchPhrase = words.join('\\s+');
    const regex = new RegExp(searchPhrase, 'i');
    if (regex.test(nameLower)) {
      totalScore += 20; // Sequential bonus
      bestMatchType = 'partial_name';
      matchedTerm = boxName;
    }
  }

  // Average the score but don't let it exceed single word matches unfairly
  const averageScore = totalScore / Math.max(words.length, 1);
  const finalScore = Math.min(averageScore, fullPhraseMatch?.score || 95);

  if (finalScore > 10) {
    return {
      score: finalScore,
      matchType: bestMatchType,
      matchedTerm: matchedTerm || searchTerm
    };
  }

  return fullPhraseMatch;
};

/**
 * Sort boxes by search relevance
 * Used when a search term is active to prioritize relevant results
 */
export const sortBySearchRelevance = (
  boxes: any[],
  searchTerm: string,
  fallbackSort?: (a: any, b: any) => number
): any[] => {
  if (!searchTerm.trim()) {
    return fallbackSort ? [...boxes].sort(fallbackSort) : boxes;
  }

  return [...boxes]
    .map(box => {
      const searchMatch = calculateMultiWordSearchScore(
        searchTerm,
        box.box_name || '',
        box.category || '',
        Array.isArray(box.tags) ? box.tags : []
      );
      
      return {
        ...box,
        _searchScore: searchMatch?.score || 0,
        _searchMatch: searchMatch
      };
    })
    .sort((a, b) => {
      // Primary sort: by search score (descending)
      const scoreDiff = (b._searchScore || 0) - (a._searchScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      
      // Secondary sort: use fallback or name
      if (fallbackSort) {
        return fallbackSort(a, b);
      }
      
      return (a.box_name || '').localeCompare(b.box_name || '');
    });
};