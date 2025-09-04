import { Star, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TopOperatorListProps {
  title: string;
  subtitle: string;
  operators: Array<{
    id: string;
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    trustScore: number;
    specialFeature: string;
    specialValue: string;
    payoutSpeed: string;
    tags: string[];
  }>;
}

const TopOperatorList = ({ title, subtitle, operators }: TopOperatorListProps) => {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4 max-w-5xl mx-auto">
        {operators.map((operator, index) => (
          <Card key={operator.id} className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                {/* Rank Badge */}
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                    index === 1 ? 'bg-gray-100 text-gray-700 border-2 border-gray-300' :
                    index === 2 ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Logo */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {operator.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-lg sm:text-xl font-bold">{operator.name}</h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {operator.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{operator.rating}</span>
                        <span className="text-muted-foreground text-sm">({operator.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span>{operator.specialFeature}: <span className="text-blue-600 font-medium">{operator.specialValue}</span></span>
                    <span>Trust Score: <span className="text-green-600 font-medium">{operator.trustScore}/10</span></span>
                    <span>Payout Speed: <span className="font-medium">{operator.payoutSpeed}</span></span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {operator.tags.map((tag, tagIndex) => {
                      const colorClasses = [
                        'bg-primary/10 text-primary border-primary/20',
                        'bg-green-100 text-green-700 border-green-200',
                        'bg-blue-100 text-blue-700 border-blue-200',
                        'bg-purple-100 text-purple-700 border-purple-200',
                        'bg-orange-100 text-orange-700 border-orange-200',
                        'bg-pink-100 text-pink-700 border-pink-200'
                      ];
                      const colorClass = colorClasses[tagIndex % colorClasses.length];
                      
                      return (
                        <Badge key={tag} variant="outline" className={colorClass}>
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none">
                  Read Review
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Site
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TopOperatorList;