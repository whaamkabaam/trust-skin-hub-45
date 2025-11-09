import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle, Copy, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md font-bold text-sm",
              scores.overall >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
              scores.overall >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
              scores.overall >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
              scores.overall >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}>
              <span>{scores.overall}</span>
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
      <section className="relative bg-gradient-hero border-b overflow-hidden min-h-[400px] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Primary gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-gaming-blue/3 to-accent/5"></div>
          
          {/* Floating circles */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-gaming-orange/20 to-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-gaming-blue/15 to-gaming-gold/15 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-accent/25 to-secondary/25 rounded-full blur-2xl animate-pulse-glow"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
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
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-medium">Our Rating:</span>
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg",
                      scores.overall >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      scores.overall >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                      scores.overall >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      scores.overall >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      <span className="text-2xl font-black">{scores.overall}</span>
                      <span className="text-sm opacity-70">/10</span>
                    </div>
                    <span className={cn(
                      "text-sm font-semibold",
                      scores.overall >= 9 ? "text-green-600 dark:text-green-400" :
                      scores.overall >= 8 ? "text-blue-600 dark:text-blue-400" :
                      scores.overall >= 7 ? "text-yellow-600 dark:text-yellow-400" :
                      scores.overall >= 6 ? "text-orange-600 dark:text-orange-400" :
                      "text-red-600 dark:text-red-400"
                    )}>
                      {scores.overall >= 9 ? 'Excellent' :
                       scores.overall >= 8 ? 'Very Good' :
                       scores.overall >= 7 ? 'Good' :
                       scores.overall >= 6 ? 'Average' :
                       scores.overall >= 5 ? 'Below Average' : 'Poor'}
                    </span>
                  </div>
                  
                  <div className="h-6 w-px bg-border" />
                  
                  {userRatings.total > 0 ? (
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-medium">User Rating:</span>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-bold",
                        scores.user >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        scores.user >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        scores.user >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        scores.user >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        <span className="text-2xl font-black">{scores.user}</span>
                        <span className="text-sm opacity-70">/10</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({userRatings.total} reviews)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-medium">User Rating:</span>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">No reviews yet</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => {
                        const reviewForm = document.getElementById('review-form');
                        reviewForm?.scrollIntoView({ behavior: 'smooth' });
                      }}>
                        Be the first to review
                      </Button>
                    </div>
                  )}
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

              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold",
                    scores.overall >= 9 ? "bg-green-100 text-green-800" :
                    scores.overall >= 8 ? "bg-blue-100 text-blue-800" :
                    scores.overall >= 7 ? "bg-yellow-100 text-yellow-800" :
                    scores.overall >= 6 ? "bg-orange-100 text-orange-800" :
                    "bg-red-100 text-red-800"
                  )}>
                    <span className="text-xl font-black">{scores.overall}</span>
                    <span className="text-xs opacity-70">/10</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Our Rating</span>
                </div>
                
                <div className="h-8 w-px bg-border" />
                
                {userRatings.total > 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold",
                      scores.user >= 9 ? "bg-green-100 text-green-800" :
                      scores.user >= 8 ? "bg-blue-100 text-blue-800" :
                      scores.user >= 7 ? "bg-yellow-100 text-yellow-800" :
                      scores.user >= 6 ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      <span className="text-xl font-black">{scores.user}</span>
                      <span className="text-xs opacity-70">/10</span>
                    </div>
                    <span className="text-xs text-muted-foreground">User ({userRatings.total})</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">No reviews</span>
                  </div>
                )}
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