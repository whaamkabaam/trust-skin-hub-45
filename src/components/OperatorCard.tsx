import { Link } from 'react-router-dom';
import { Star, CreditCard, Smartphone, Bitcoin, TrendingUp, HelpCircle, ExternalLink, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Operator, FeeLevel } from '@/types';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/LazyImage';
import DOMPurify from 'dompurify';
interface OperatorCardProps {
  operator: Operator;
  view?: 'grid' | 'list';
}
const getFeeColor = (level: FeeLevel) => {
  switch (level) {
    case 'Very Low':
      return 'bg-success text-success-foreground';
    case 'Low':
      return 'bg-success/80 text-success-foreground';
    case 'Medium':
      return 'bg-warning text-warning-foreground';
    case 'High':
      return 'bg-destructive/80 text-destructive-foreground';
    case 'Very High':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};
const getTrustColor = (score: number) => {
  if (score >= 4) return 'text-success';
  if (score >= 3) return 'text-warning';
  return 'text-destructive';
};
const OperatorCard = ({
  operator,
  view = 'grid'
}: OperatorCardProps) => {
  const isListView = view === 'list';
  return <Card className={cn("group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1", isListView && "flex-row")}>
      <CardContent className={cn("p-6", isListView && "flex-1 flex items-center gap-6")}>
        {/* Logo & Header */}
        <div className={cn("flex items-start gap-4 mb-4", isListView && "mb-0 flex-shrink-0")}>
          {operator.logo ? (
            <LazyImage
              src={operator.logo}
              alt={`${operator.name} logo`}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-primary">
                {operator.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{operator.name}</h3>
              {operator.verified && <Badge variant="secondary" className="bg-success/10 text-success">
                  Verified
                </Badge>}
            </div>
            <div 
              className="text-sm text-muted-foreground mb-2 line-clamp-3 verdict-content"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(operator.verdict || '', {
                  ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
                  ALLOWED_ATTR: [],
                  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                  FORBID_ATTR: ['onclick', 'onload', 'onerror']
                })
              }}
            />
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gaming-gold text-gaming-gold" />
                <span className="font-semibold">{operator.overallRating}</span>
              </div>
              <Badge className={getFeeColor(operator.feeLevel)}>
                {operator.feeLevel} Fees
              </Badge>
            </div>
          </div>
        </div>

        {!isListView && <>
            {/* Payment Methods */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">Accepts:</span>
              <div className="flex gap-1">
                {operator.paymentMethods.includes('skins') && <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-primary" />
                  </div>}
                {operator.paymentMethods.includes('crypto') && <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <Bitcoin className="h-3 w-3 text-primary" />
                  </div>}
                {operator.paymentMethods.includes('cards') && <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <CreditCard className="h-3 w-3 text-primary" />
                  </div>}
              </div>
            </div>

            {/* Key Features / USPs */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Key Features</h4>
              <div className="space-y-2">
                {operator.pros.slice(0, 3).map((feature, i) => <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{feature}</span>
                  </div>)}
              </div>
            </div>
          </>}

        {/* Modes (for both views) */}
        <div className={cn("mb-4", isListView && "flex-shrink-0")}>
          <div className="flex flex-wrap gap-1">
            {operator.modes.slice(0, isListView ? 2 : 4).map((mode, modeIndex) => {
              const colorClasses = [
                'bg-primary/10 text-primary border-primary/20',
                'bg-green-100 text-green-700 border-green-200',
                'bg-blue-100 text-blue-700 border-blue-200',
                'bg-purple-100 text-purple-700 border-purple-200',
                'bg-orange-100 text-orange-700 border-orange-200',
                'bg-pink-100 text-pink-700 border-pink-200'
              ];
              const colorClass = colorClasses[modeIndex % colorClasses.length];
              
              return (
                <Badge key={mode} variant="outline" className={`text-xs ${colorClass}`}>
                  {mode}
                </Badge>
              );
            })}
            {operator.modes.length > (isListView ? 2 : 4) && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{operator.modes.length - (isListView ? 2 : 4)}
              </Badge>
            )}
          </div>
        </div>

        {isListView && <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <div className={cn("text-lg font-semibold", getTrustColor(operator.trustScore))}>
                {operator.trustScore}
              </div>
              <div className="text-xs text-muted-foreground">Trust</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{operator.payoutSpeed}</div>
              <div className="text-xs text-muted-foreground">Payout</div>
            </div>
          </div>}
      </CardContent>

      <CardFooter className={cn("p-6 pt-0", isListView && "p-4")}>
        {!isListView && <div className="w-full space-y-3">
            {/* Trust indicator */}
            

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to={`/operators/${operator.slug || operator.id}`}>
                  Read Review
                </Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <a href={operator.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Site
                </a>
              </Button>
            </div>
          </div>}

        {isListView && <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to={`/operators/${operator.slug || operator.id}`}>
                Read Review
              </Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <a href={operator.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit Site
              </a>
            </Button>
          </div>}
      </CardFooter>
      
      <style>{`
        .verdict-content p {
          display: inline;
          margin: 0;
        }
        .verdict-content p + p {
          margin-left: 0.5em;
        }
      `}</style>
    </Card>;
};
export default OperatorCard;