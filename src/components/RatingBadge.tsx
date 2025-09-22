import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'trust' | 'compact';
}

const getRatingColor = (rating: number) => {
  if (rating >= 9.0) return 'bg-success text-success-foreground';
  if (rating >= 8.0) return 'bg-success/80 text-success-foreground';
  if (rating >= 7.0) return 'bg-warning text-warning-foreground';
  if (rating >= 6.0) return 'bg-warning/80 text-warning-foreground';
  if (rating >= 5.0) return 'bg-orange-500 text-white';
  return 'bg-destructive text-destructive-foreground';
};

const getRatingText = (rating: number) => {
  if (rating >= 9.0) return 'Excellent';
  if (rating >= 8.0) return 'Very Good';
  if (rating >= 7.0) return 'Good';
  if (rating >= 6.0) return 'Average';
  if (rating >= 5.0) return 'Below Average';
  return 'Poor';
};

const RatingBadge = ({ 
  rating, 
  size = 'md', 
  showText = false, 
  variant = 'default' 
}: RatingBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'trust') {
    return (
      <div className="inline-flex items-center gap-2">
        <div className={cn(
          "inline-flex items-center gap-1 rounded-full font-semibold",
          getRatingColor(rating),
          sizeClasses[size]
        )}>
          <Star className={cn("fill-current", starSizes[size])} />
          <span>{rating.toFixed(1)}/10</span>
        </div>
        {showText && (
          <span className="text-sm text-muted-foreground font-medium">
            {getRatingText(rating)}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Badge className={cn(getRatingColor(rating), sizeClasses[size])}>
        <Star className={cn("fill-current mr-1", starSizes[size])} />
        {rating.toFixed(1)}/10
      </Badge>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Badge className={cn(getRatingColor(rating), sizeClasses[size])}>
        <Star className={cn("fill-current mr-1", starSizes[size])} />
        {rating.toFixed(1)}/10
      </Badge>
      {showText && (
        <span className="text-sm text-muted-foreground font-medium">
          {getRatingText(rating)}
        </span>
      )}
    </div>
  );
};

export default RatingBadge;