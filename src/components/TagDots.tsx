
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TagDotsProps {
  tags: string[];
  maxVisibleTags?: number;
  maxDots?: number;
}

// Color mapping for consistent brand/category colors
const getTagColor = (tag: string): string => {
  const tagLower = tag.toLowerCase();
  
  // Gaming platforms
  if (tagLower.includes('steam') || tagLower.includes('valve')) return 'bg-blue-500';
  if (tagLower.includes('xbox') || tagLower.includes('microsoft')) return 'bg-green-500';
  if (tagLower.includes('playstation') || tagLower.includes('sony')) return 'bg-indigo-500';
  if (tagLower.includes('nintendo')) return 'bg-red-500';
  if (tagLower.includes('epic')) return 'bg-gray-700';
  
  // Game genres
  if (tagLower.includes('fps') || tagLower.includes('shooter')) return 'bg-orange-500';
  if (tagLower.includes('rpg') || tagLower.includes('role')) return 'bg-purple-500';
  if (tagLower.includes('mmo') || tagLower.includes('online')) return 'bg-cyan-500';
  if (tagLower.includes('strategy') || tagLower.includes('rts')) return 'bg-yellow-500';
  if (tagLower.includes('racing') || tagLower.includes('sports')) return 'bg-emerald-500';
  if (tagLower.includes('horror') || tagLower.includes('survival')) return 'bg-red-700';
  if (tagLower.includes('puzzle') || tagLower.includes('casual')) return 'bg-pink-500';
  
  // Rarity/Quality
  if (tagLower.includes('rare') || tagLower.includes('legendary')) return 'bg-yellow-400';
  if (tagLower.includes('common') || tagLower.includes('basic')) return 'bg-gray-400';
  if (tagLower.includes('premium') || tagLower.includes('exclusive')) return 'bg-purple-600';
  
  // Default colors based on string hash
  const hash = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const colors = [
    'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 
    'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-cyan-400'
  ];
  return colors[hash % colors.length];
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TagDots: React.FC<TagDotsProps> = ({ 
  tags, 
  maxVisibleTags = 1, 
  maxDots = 4 
}) => {
  if (!tags || tags.length === 0) return null;

  // Prioritize important tags (platforms, major brands)
  const priorityTags = tags.filter(tag => {
    const tagLower = tag.toLowerCase();
    return tagLower.includes('steam') || tagLower.includes('xbox') || 
           tagLower.includes('playstation') || tagLower.includes('nintendo') ||
           tagLower.includes('premium') || tagLower.includes('legendary') ||
           tagLower.includes('rare') || tagLower.includes('exclusive');
  });

  const otherTags = tags.filter(tag => !priorityTags.includes(tag));
  const sortedTags = [...priorityTags, ...otherTags];

  const primaryTag = sortedTags[0];
  const dotTags = sortedTags.slice(maxVisibleTags, maxVisibleTags + maxDots);
  const remainingCount = Math.max(0, tags.length - maxVisibleTags - maxDots);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Primary tag as text */}
        {primaryTag && (
          <Badge 
            variant="secondary" 
            className="text-xs bg-gray-100 text-gray-700 border-gray-200 max-w-[100px] truncate hover:bg-gray-200 transition-colors"
            title={capitalizeFirstLetter(primaryTag)}
          >
            {capitalizeFirstLetter(primaryTag)}
          </Badge>
        )}
        
        {/* Dot tags with tooltips */}
        {dotTags.length > 0 && (
          <div className="flex items-center gap-1">
            {dotTags.map((tag, index) => (
              <Tooltip key={`${tag}-${index}`} delayDuration={200}>
                <TooltipTrigger asChild>
                  <div
                    className={`
                      w-2 h-2 rounded-full cursor-help
                      transition-all duration-200 ease-out
                      hover:scale-125 hover:shadow-md
                      motion-reduce:hover:scale-100
                      ${getTagColor(tag)}
                    `}
                    aria-label={`Tag: ${capitalizeFirstLetter(tag)}`}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="bg-gray-900 text-white border-gray-700 text-xs px-2 py-1"
                  sideOffset={5}
                >
                  {capitalizeFirstLetter(tag)}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
        
        {/* Remaining count indicator */}
        {remainingCount > 0 && (
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-50 text-gray-600 border-gray-300 px-1.5 py-0.5 cursor-help hover:bg-gray-100 transition-colors"
                aria-label={`${remainingCount} more tags`}
              >
                +{remainingCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-gray-900 text-white border-gray-700 text-xs px-2 py-1 max-w-[200px]"
              sideOffset={5}
            >
              <div className="flex flex-wrap gap-1">
                {tags.slice(maxVisibleTags + maxDots).map((tag, index) => (
                  <span key={index} className="text-gray-200">
                    {capitalizeFirstLetter(tag)}{index < tags.slice(maxVisibleTags + maxDots).length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default TagDots;
