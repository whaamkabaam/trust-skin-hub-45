import { Link } from 'react-router-dom';
import { Star, ExternalLink, Home, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePublicOperatorsQuery } from '@/hooks/usePublicOperatorsQuery';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const MysteryBoxOperators = () => {
  const { data, isLoading, error } = usePublicOperatorsQuery({
    games: ['mystery-boxes'],
    sortBy: '-rating'
  });

  const operators = data?.operators || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back to Hub */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/mystery-boxes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mystery Boxes
            </Link>
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="w-4 h-4" />
          <span>Hub</span>
          <span>/</span>
          <Link to="/mystery-boxes" className="hover:text-foreground">Mystery Boxes</Link>
          <span>/</span>
          <span className="text-foreground">Top Operators</span>
        </div>
      </div>

      {/* Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Top Rated Mystery Box Operators</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most trusted platforms for mystery box openings, ranked by community reviews and box selection
          </p>
        </div>
      </section>

      {/* Top Rated Operators */}
      <section className="container mx-auto px-4 pb-12">
        <div className="space-y-4 max-w-4xl mx-auto">
          {isLoading ? (
            // Loading state
            Array.from({ length: 5 }, (_, i) => (
              <Card key={i} className="p-4 md:p-6">
                <div className="animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : operators.length === 0 ? (
            // Empty state
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No mystery box operators found.</p>
            </Card>
          ) : (
            // Real operators data
            operators.map((operator) => (
              <Card key={operator.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                    {operator.logo ? (
                      <img 
                        src={operator.logo} 
                        alt={operator.name} 
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                        {operator.name.charAt(0)}
                      </div>
                    )}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h3 className="text-lg sm:text-xl font-bold">{operator.name}</h3>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          {operator.verified && <Badge variant="secondary" className="bg-success/10 text-success">Verified</Badge>}
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="font-semibold">{operator.overallRating}</span>
                            <span className="text-muted-foreground text-sm">(Trust: {operator.trustScore}/10)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <span>Payment Methods: <span className="text-primary font-medium">{operator.paymentMethods.length}</span></span>
                        <span>Trust Score: <span className="text-success font-medium">{operator.trustScore}/10</span></span>
                        <span>Payout Speed: <span className="font-medium">{operator.payoutSpeed}</span></span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {operator.categories.map((category, i) => (
                          <Badge key={i} variant="outline" className="capitalize">{category.replace('-', ' ')}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                    <Button className="flex-1 sm:flex-none" asChild>
                      <Link to={`/operator/${operator.slug}`}>Read Review</Link>
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none" asChild>
                      <a href={operator.url} target="_blank" rel="noopener noreferrer">Visit Site</a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link to="/operators">View All Operators</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxOperators;