import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // Rating out of 10
  maxStars?: number; // Number of stars to display (default: 5)
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showHalfStars?: boolean;
}

const StarRating = ({ 
  rating, 
  maxStars = 5, 
  size = 'md', 
  className,
  showHalfStars = true 
}: StarRatingProps) => {
  // Convert 10-point scale to 5-star scale for display
  const normalizedRating = (rating / 10) * maxStars;
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const starSize = sizeClasses[size];

  const stars = [];
  
  for (let i = 1; i <= maxStars; i++) {
    const starValue = i;
    const isFilled = normalizedRating >= starValue;
    const isHalfFilled = showHalfStars && normalizedRating >= starValue - 0.5 && normalizedRating < starValue;
    
    stars.push(
      <div key={i} className="relative">
        <Star 
          className={cn(
            starSize,
            isFilled 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-muted-foreground'
          )} 
        />
        {isHalfFilled && (
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className={cn(starSize, 'fill-yellow-400 text-yellow-400')} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {stars}
    </div>
  );
};

export default StarRating;