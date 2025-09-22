import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, CheckCircle, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';

interface OperatorReviewHeroProps {
  operator: {
    id: string;
    name: string;
    verified: boolean;
    url: string;
    modes: string[];
    otherFeatures?: string[];
    gamingModes?: string[];
    games?: string[];
    categories?: string[];
  };
  scores: {
    overall: number;
    user: number;
  };
  userRatings: {
    total: number;
  };
  promoCode: string;
}

const OperatorReviewHero = ({ operator, scores, userRatings, promoCode }: OperatorReviewHeroProps) => {
  const [promoCodeCopied, setPromoCodeCopied] = useState(false);
  
  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setPromoCodeCopied(true);
    setTimeout(() => setPromoCodeCopied(false), 2000);
  };

  const siteType = operator.modes.includes('Case Opening') ? 'Case Site' : 'Mystery Box';

  return (
    <>
      {/* Mobile Sticky Top Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b md:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/operators">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{operator.name}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{scores.overall}</span>
            </div>
          </div>
          <Button size="sm" asChild>
            <a href={operator.url} target="_blank" rel="noopener noreferrer">
              Visit
            </a>
          </Button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20 hidden md:block">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">›</span>
            <Link to="/reviews" className="text-muted-foreground hover:text-foreground">Reviews</Link>
            <span className="text-muted-foreground">›</span>
            <span className="font-medium">{operator.name}</span>
          </div>
        </div>
      </div>

      {/* Header / Hero */}
      <section className="relative bg-gradient-to-br from-background via-muted/20 to-muted/40 border-b overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,hsl(var(--primary)/0.03)_25%,transparent_25%,transparent_75%,hsl(var(--primary)/0.03)_75%)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex items-start gap-6 mb-8">
              {/* Site Logo */}
              <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 border">
                <span className="text-xl font-bold text-primary">{operator.name.charAt(0)}</span>
              </div>
              
              {/* Site Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold">{operator.name}</h1>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {siteType}
                  </Badge>
                  {operator.verified && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified ✓
                    </Badge>
                  )}
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-8 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Our Rating:</span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        <StarRating rating={scores.overall} size="md" />
                      </div>
                      <span className="font-bold text-lg">{scores.overall}/10</span>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">User Rating:</span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        <StarRating rating={scores.user} size="md" />
                      </div>
                      <span className="font-bold">{scores.user}/10</span>
                      <span className="text-muted-foreground">({userRatings.total})</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4 mb-6">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80" asChild>
                    <a href={operator.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Visit Site
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={copyPromoCode}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {promoCodeCopied ? "Copied!" : `Copy Code: ${promoCode}`}
                  </Button>
                  <Badge variant="outline" className="px-3 py-2">
                    18+ / Play Responsibly
                  </Badge>
                </div>

                {/* Key Facts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Launched:</span>
                    <span className="ml-2 font-medium">2020</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payments:</span>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Visa</Badge>
                      <Badge variant="outline" className="text-xs">Bitcoin</Badge>
                      <Badge variant="outline" className="text-xs">Ethereum</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">KYC:</span>
                    <span className="ml-2 font-medium">Required</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payout:</span>
                    <span className="ml-2 font-medium">Physical | Skins</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Provably Fair:</span>
                    <span className="ml-2 font-medium text-success">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center mx-auto mb-4 border">
                <span className="text-2xl font-bold text-primary">{operator.name.charAt(0)}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{operator.name}</h1>
                <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                  {siteType}
                </Badge>
                {operator.verified && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified ✓
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{scores.overall}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Our Rating</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{scores.user}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">User ({userRatings.total})</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80" asChild>
                  <a href={operator.url} target="_blank" rel="noopener noreferrer">
                    Visit Site
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={copyPromoCode}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  {promoCodeCopied ? "Copied!" : promoCode}
                </Button>
              </div>

              <Badge variant="outline" className="text-xs">18+ / Play Responsibly</Badge>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OperatorReviewHero;