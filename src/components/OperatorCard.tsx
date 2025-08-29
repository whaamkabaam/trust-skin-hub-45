import { Star, CreditCard, Smartphone, Bitcoin, TrendingUp, HelpCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Operator, FeeLevel } from '@/types';
import { cn } from '@/lib/utils';

interface OperatorCardProps {
  operator: Operator;
  view?: 'grid' | 'list';
}

const getFeeColor = (level: FeeLevel) => {
  switch (level) {
    case 'Very Low': return 'bg-success text-success-foreground';
    case 'Low': return 'bg-success/80 text-success-foreground';
    case 'Medium': return 'bg-warning text-warning-foreground';
    case 'High': return 'bg-destructive/80 text-destructive-foreground';
    case 'Very High': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTrustColor = (score: number) => {
  if (score >= 4) return 'text-success';
  if (score >= 3) return 'text-warning';
  return 'text-destructive';
};

const OperatorCard = ({ operator, view = 'grid' }: OperatorCardProps) => {
  const isListView = view === 'list';

  return (
    <Card className={cn(
      "group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1",
      isListView && "flex-row"
    )}>
      <CardContent className={cn("p-6", isListView && "flex-1 flex items-center gap-6")}>
        {/* Logo & Header */}
        <div className={cn("flex items-start gap-4 mb-4", isListView && "mb-0 flex-shrink-0")}>
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold text-primary">
              {operator.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{operator.name}</h3>
              {operator.verified && (
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{operator.verdict}</p>
            
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

        {!isListView && (
          <>
            {/* Payment Methods */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">Accepts:</span>
              <div className="flex gap-1">
                {operator.paymentMethods.includes('skins') && (
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-primary" />
                  </div>
                )}
                {operator.paymentMethods.includes('crypto') && (
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <Bitcoin className="h-3 w-3 text-primary" />
                  </div>
                )}
                {operator.paymentMethods.includes('cards') && (
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <CreditCard className="h-3 w-3 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-success mb-1">Pros</h4>
                <ul className="text-xs space-y-1">
                  {operator.pros.slice(0, 2).map((pro, i) => (
                    <li key={i} className="text-muted-foreground">• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-destructive mb-1">Cons</h4>
                <ul className="text-xs space-y-1">
                  {operator.cons.slice(0, 2).map((con, i) => (
                    <li key={i} className="text-muted-foreground">• {con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Modes (for both views) */}
        <div className={cn("mb-4", isListView && "flex-shrink-0")}>
          <div className="flex flex-wrap gap-1">
            {operator.modes.slice(0, isListView ? 2 : 4).map((mode) => (
              <Badge key={mode} variant="outline" className="text-xs">
                {mode}
              </Badge>
            ))}
            {operator.modes.length > (isListView ? 2 : 4) && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{operator.modes.length - (isListView ? 2 : 4)}
              </Badge>
            )}
          </div>
        </div>

        {isListView && (
          <div className="flex items-center gap-4 flex-shrink-0">
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
          </div>
        )}
      </CardContent>

      <CardFooter className={cn("p-6 pt-0 flex justify-between", isListView && "flex-col gap-2 p-4")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <HelpCircle className="h-4 w-4 mr-1" />
                Why we recommend
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p>Based on our trust score ({operator.trustScore}/5), fee analysis, 
                 and community feedback. View full methodology.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Read Review
          </Button>
          <Button size="sm" className="bg-gradient-trust">
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit Site
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OperatorCard;