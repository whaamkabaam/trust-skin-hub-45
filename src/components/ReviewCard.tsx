import { Star, ThumbsUp, ThumbsDown, Verified, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Review } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
  showEntityName?: boolean;
}

const getVerificationBadge = (verification: Review['verified']) => {
  switch (verification) {
    case 'operator':
      return { label: 'Verified Trader', color: 'bg-success text-success-foreground' };
    case 'opener':
      return { label: 'Verified Opener', color: 'bg-accent text-accent-foreground' };
    default:
      return null;
  }
};

const ReviewCard = ({ review, showEntityName = false }: ReviewCardProps) => {
  const verificationBadge = getVerificationBadge(review.verified);
  const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="hover:shadow-card transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {review.user.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{review.user}</h4>
                {verificationBadge && (
                  <Badge className={cn("text-xs", verificationBadge.color)}>
                    <Verified className="w-3 h-3 mr-1" />
                    {verificationBadge.label}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{reviewDate}</span>
              </div>
            </div>
          </div>
          
          {/* Overall Rating */}
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-gaming-gold text-gaming-gold" />
            <span className="font-medium">{review.rating}</span>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium">{review.subscores.trust}</div>
            <div className="text-xs text-muted-foreground">Trust</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">{review.subscores.fees}</div>
            <div className="text-xs text-muted-foreground">Fees</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">{review.subscores.ux}</div>
            <div className="text-xs text-muted-foreground">UX</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">{review.subscores.support}</div>
            <div className="text-xs text-muted-foreground">Support</div>
          </div>
        </div>

        {/* Review Title & Content */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">{review.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{review.body}</p>
        </div>

        {/* Photos */}
        {review.photos && review.photos.length > 0 && (
          <div className="flex gap-2 mb-4">
            {review.photos.map((photo, index) => (
              <div key={index} className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                <img 
                  src={photo} 
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Operator Response */}
        {review.operatorResponse && (
          <div className="mt-4 p-3 bg-accent/5 rounded-lg border-l-4 border-accent">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                <MessageSquare className="w-3 h-3 mr-1" />
                Operator Response
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(review.operatorResponse.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{review.operatorResponse.body}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 py-4 bg-muted/20 flex items-center justify-between">
        {/* Helpful Votes */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Was this helpful?</span>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {review.helpful.up}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsDown className="w-4 h-4 mr-1" />
            {review.helpful.down}
          </Button>
        </div>

        {/* Report */}
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;