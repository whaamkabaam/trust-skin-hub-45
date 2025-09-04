import { Calendar, TrendingUp, Verified, Eye, BarChart3, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Case } from '@/types';
import { cn } from '@/lib/utils';

interface CaseCardProps {
  case: Case;
  view?: 'grid' | 'list';
}

const getOddsDisclosureColor = (status: Case['oddsDisclosed']) => {
  switch (status) {
    case 'Yes': return 'bg-success text-success-foreground';
    case 'Partial': return 'bg-warning text-warning-foreground';
    case 'No': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'covert': return 'text-destructive';
    case 'classified': return 'text-gaming-blue';
    case 'restricted': return 'text-primary';
    case 'mil-spec': return 'text-accent';
    case 'legendary': return 'text-gaming-gold';
    case 'epic': return 'text-primary';
    default: return 'text-muted-foreground';
  }
};

const CaseCard = ({ case: caseData, view = 'grid' }: CaseCardProps) => {
  const isListView = view === 'list';

  return (
    <Card className={cn(
      "group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1",
      isListView && "flex-row"
    )}>
      <CardContent className="p-4">
        {/* Two Column Layout */}
        <div className="flex gap-4">
          {/* Left Column - Compact Image */}
          <div className={cn(
            "relative overflow-hidden flex-shrink-0 rounded-lg",
            isListView ? "w-20 h-20" : "w-24 h-24"
          )}>
            <img
              src={caseData.image || '/img/cases/default-case.jpg'}
              alt={caseData.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {caseData.verified && (
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-success text-success-foreground text-xs px-1 py-0">
                  <Verified className="w-2 h-2" />
                </Badge>
              </div>
            )}
            <div className="absolute -top-1 -left-1">
              <Badge variant="secondary" className="text-xs px-1 py-0">{caseData.game}</Badge>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-base mb-1 line-clamp-1">{caseData.name}</h3>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    ${caseData.minPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
                <Badge className={getOddsDisclosureColor(caseData.oddsDisclosed)} variant="outline">
                  {caseData.oddsDisclosed}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{new Date(caseData.releaseDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Featured Items - Condensed */}
            <div className="mb-3">
              <h4 className="text-xs font-medium mb-1 text-muted-foreground">Featured Items</h4>
              <div className="space-y-1">
                {caseData.highlights.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-muted rounded flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className={cn("text-xs font-medium", getRarityColor(item.rarity))}>
                      {item.rarity}
                    </span>
                  </div>
                ))}
                {caseData.highlights.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{caseData.highlights.length - 2} more items
                  </div>
                )}
              </div>
            </div>

            {/* Stats - Horizontal */}
            <div className="flex gap-3 p-2 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium">
                  {caseData.stats.openCount.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">opens</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-muted-foreground" />
                <span className={cn(
                  "text-xs font-medium",
                  caseData.stats.avgReturn >= 1 ? "text-success" : "text-destructive"
                )}>
                  {(caseData.stats.avgReturn * 100).toFixed(0)}%
                </span>
                <span className="text-xs text-muted-foreground">return</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1">
            <BarChart3 className="w-4 h-4 mr-1" />
            Drop Table
          </Button>
          <Button size="sm" className="flex-1 bg-gradient-trust">
            <ExternalLink className="w-4 h-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CaseCard;