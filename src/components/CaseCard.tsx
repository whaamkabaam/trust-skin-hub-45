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
      <div className={cn(
        "relative overflow-hidden",
        isListView ? "w-32 flex-shrink-0" : "aspect-[4/3]"
      )}>
        <img
          src={caseData.image || '/img/cases/default-case.jpg'}
          alt={caseData.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {caseData.verified && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-success text-success-foreground">
              <Verified className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary">{caseData.game}</Badge>
        </div>
      </div>

      <CardContent className={cn("p-4", isListView && "flex-1")}>
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{caseData.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ${caseData.minPrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">minimum</span>
            </div>
            <Badge className={getOddsDisclosureColor(caseData.oddsDisclosed)}>
              Odds: {caseData.oddsDisclosed}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(caseData.releaseDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Highlight Drops */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Featured Items</h4>
          <div className="space-y-2">
            {caseData.highlights.slice(0, isListView ? 2 : 3).map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <span className="flex-1 truncate">{item.name}</span>
                <span className={cn("text-xs font-medium", getRarityColor(item.rarity))}>
                  {item.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium">
              {caseData.stats.openCount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Opens</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className={cn(
              "text-sm font-medium",
              caseData.stats.avgReturn >= 1 ? "text-success" : "text-destructive"
            )}>
              {(caseData.stats.avgReturn * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Return</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className={cn("p-4 pt-0", isListView && "flex-col justify-center")}>
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