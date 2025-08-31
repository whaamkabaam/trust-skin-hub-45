import { Link } from 'react-router-dom';
import { Star, ExternalLink, Home, CreditCard, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkinsHero from '@/components/SkinsHero';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleOperators } from '@/lib/sample-data';

const Skins = () => {

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'skins': return '🎮';
      case 'crypto': return '₿';
      case 'cards': return '💳';
      default: return '💰';
    }
  };

  const getSiteTypeFromModes = (modes: string[]) => {
    const types = [];
    if (modes.some(mode => mode.toLowerCase().includes('case'))) {
      types.push('Case Opening');
    }
    if (modes.some(mode => ['trading', 'marketplace', 'sell'].some(t => mode.toLowerCase().includes(t)))) {
      types.push('Marketplace');
    }
    if (types.length === 0) {
      types.push('Gaming');
    }
    return types;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="w-4 h-4" />
          <span>Hub</span>
          <span>/</span>
          <span className="text-foreground">Skins</span>
        </div>
      </div>

      {/* Hero Section */}
      <SkinsHero />

      {/* Top Operators Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Top Gaming Platforms</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Most trusted platforms for skin trading, case opening, and marketplace activities
          </p>
        </div>

        <div className="space-y-4 max-w-5xl mx-auto">
          {sampleOperators.map((operator, index) => (
            <Card key={operator.id} className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 flex-1">
                  <img 
                    src={operator.logo}
                    alt={operator.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
                  />
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-lg sm:text-xl font-bold">{operator.name}</h3>
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {operator.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{operator.overallRating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Site Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Trust Score:</span>
                        <span className="text-green-600 font-medium">{operator.trustScore}/5.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Payout:</span>
                        <span className="font-medium">{operator.payoutSpeed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Fees:</span>
                        <Badge variant="outline" className={
                          operator.feeLevel === 'Low' ? 'text-green-600 border-green-200' :
                          operator.feeLevel === 'Medium' ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }>
                          {operator.feeLevel}
                        </Badge>
                      </div>
                    </div>

                    {/* Site Types and Games */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Site Type:</span>
                        {getSiteTypeFromModes(operator.modes).map((type) => (
                          <Badge key={type} variant="outline" className="text-blue-600 border-blue-200">
                            {type}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Games:</span>
                        {operator.modes.slice(0, 3).map((mode) => (
                          <Badge key={mode} variant="outline">{mode}</Badge>
                        ))}
                        {operator.modes.length > 3 && (
                          <Badge variant="outline">+{operator.modes.length - 3} more</Badge>
                        )}
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Payment:</span>
                      {operator.paymentMethods.map((method) => (
                        <Badge key={method} variant="outline" className="flex items-center gap-1">
                          <span>{getPaymentMethodIcon(method)}</span>
                          <span className="capitalize">{method}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto lg:w-auto">
                  <Button className="flex-1 sm:flex-none" asChild>
                    <Link to={`/operators/${operator.id}/review`}>Read Review</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none group" asChild>
                    <a href={operator.url} target="_blank" rel="noopener noreferrer">
                      Visit Site
                      <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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

export default Skins;