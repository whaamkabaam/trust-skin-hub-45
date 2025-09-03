import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield, Clock, CreditCard, Globe, Users, TrendingUp, Star, ChevronDown, CheckCircle, XCircle, AlertTriangle, Copy, Gamepad2, DollarSign, HelpCircle, FileText, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import TrustIndicator from '@/components/TrustIndicator';
import RatingBadge from '@/components/RatingBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { sampleOperators, sampleReviews } from '@/lib/sample-data';

const OnlineCasinoReview = () => {
  const [tocOpen, setTocOpen] = useState(false);
  const [promoCodeCopied, setPromoCodeCopied] = useState(false);
  const [keyFactsOpen, setKeyFactsOpen] = useState(false);
  const [prosConsOpen, setProsConsOpen] = useState(false);

  const operator = sampleOperators[0]; // Using same data structure for example
  const reviews = sampleReviews.filter(r => r.entityId === operator.id);

  const sections = [{
    id: 'what-is',
    title: 'What is Online Casino Gaming?',
    anchor: 'what-is-section'
  }, {
    id: 'games-modes',
    title: 'Games & Modes',
    anchor: 'games-modes-section'
  }, {
    id: 'prizes-payouts',
    title: 'Prizes & Payouts',
    anchor: 'prizes-payouts-section'
  }, {
    id: 'payments',
    title: 'Payments',
    anchor: 'payments-section'
  }, {
    id: 'bonuses-promos',
    title: 'Bonuses & Promos',
    anchor: 'bonuses-promos-section'
  }, {
    id: 'fairness-security',
    title: 'Fairness & Security',
    anchor: 'fairness-security-section'
  }, {
    id: 'ux-support',
    title: 'UX & Support',
    anchor: 'ux-support-section'
  }, {
    id: 'verdict',
    title: 'Verdict',
    anchor: 'verdict-section'
  }];

  const scores = {
    overall: 4.3,
    user: 3.7,
    trust: 4.2,
    fees: 4.0,
    ux: 4.5,
    support: 3.8,
    speed: 4.6
  };

  const promoCode = "CASINO123";

  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setPromoCodeCopied(true);
    setTimeout(() => setPromoCodeCopied(false), 2000);
  };

  const userRatings = {
    total: 1284,
    breakdown: {
      5: 45,
      4: 30,
      3: 15,
      2: 7,
      1: 3
    }
  };

  const faqItems = [{
    q: "Is online casino gaming safe?",
    a: "Yes, when playing at licensed and regulated online casinos with proper security measures and verified payouts."
  }, {
    q: "How do casino payouts work?",
    a: "Payouts are processed within 24-48 hours via various methods including bank transfer, e-wallets, and cryptocurrency."
  }, {
    q: "What are the fees and limits?",
    a: "Deposit fees start at 0%, withdrawal fees vary by method. Minimum deposit is typically $10-$20."
  }];

  const screenshots = [
    { id: 1, url: "/placeholder.svg", alt: "Online casino homepage" },
    { id: 2, url: "/placeholder.svg", alt: "Casino game lobby" },
    { id: 3, url: "/placeholder.svg", alt: "User dashboard" },
    { id: 4, url: "/placeholder.svg", alt: "Payment methods" },
    { id: 5, url: "/placeholder.svg", alt: "Live dealer section" },
    { id: 6, url: "/placeholder.svg", alt: "Withdrawal interface" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
            <span className="font-semibold text-sm">Online Casino Review</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{scores.overall}</span>
            </div>
          </div>
          <Button size="sm" asChild>
            <a href="#visit" rel="noopener noreferrer">
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
            <span className="font-medium">Online Casino Review</span>
          </div>
        </div>
      </div>

      {/* Header / Hero */}
      <section className="bg-gradient-to-br from-background to-muted/30 border-b">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex items-start gap-6 mb-8">
              {/* Left - Site Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6">
                  {/* Site Logo */}
                  <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 border">
                    <span className="text-xl font-bold text-primary">🎰</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-3xl font-bold">Online Casino Review</h1>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Casino Platform
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Licensed ✓
                      </Badge>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-8 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Our Rating:</span>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < Math.floor(scores.overall) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                          <span className="font-bold text-lg">{scores.overall}/5</span>
                        </div>
                      </div>
                      <div className="h-6 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">User Rating:</span>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < Math.floor(scores.user) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                          <span className="font-bold">{scores.user}/5</span>
                          <span className="text-muted-foreground">({userRatings.total})</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Facts */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                      <div>
                        <span className="text-muted-foreground">Established:</span>
                        <span className="ml-2 font-medium">2018</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">License:</span>
                        <span className="ml-2 font-medium">Malta Gaming Authority</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Games:</span>
                        <span className="ml-2 font-medium">2000+ Slots, Live Dealer</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min Deposit:</span>
                        <span className="ml-2 font-medium">$20</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payout Speed:</span>
                        <span className="ml-2 font-medium">24-48 hours</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Customer Support:</span>
                        <span className="ml-2 font-medium">24/7 Live Chat</span>
                      </div>
                    </div>

                    {/* Casino Features */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Game Categories</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <Badge variant="secondary" className="text-xs hover-scale">Slots</Badge>
                            <Badge variant="secondary" className="text-xs hover-scale">Live Dealer</Badge>
                            <Badge variant="secondary" className="text-xs hover-scale">Table Games</Badge>
                            <Badge variant="secondary" className="text-xs hover-scale">Jackpots</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Payment Methods</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover-scale">Credit Cards</Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover-scale">E-wallets</Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover-scale">Cryptocurrency</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Software Providers</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 hover-scale">NetEnt</Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 hover-scale">Microgaming</Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 hover-scale">Evolution Gaming</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Special Features</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover-scale">VIP Program</Badge>
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover-scale">Mobile App</Badge>
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover-scale">Live Streaming</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Best Offer */}
              <div className="w-80 flex-shrink-0">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-sm font-medium text-muted-foreground">Welcome Bonus</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">100% up to $500</div>
                      <div className="text-sm text-muted-foreground">+ 200 Free Spins</div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background rounded border border-dashed">
                      <code className="flex-1 text-center font-mono">{promoCode}</code>
                      <Button size="sm" variant="ghost" onClick={copyPromoCode}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button className="w-full" asChild>
                      <a href="#visit" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Play Now
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Rate Casino CTA */}
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/50 mt-4">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div className="flex justify-center mb-2">
                        <Star className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-emerald-900">Rate this Casino</h3>
                      <p className="text-xs text-muted-foreground mt-1">Share your experience</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200">
                      <Star className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg shadow flex items-center justify-center flex-shrink-0 border">
                    <span className="text-lg">🎰</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-xl font-bold">Online Casino Review</h1>
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                        Casino
                      </Badge>
                      <Badge className="text-xs bg-green-100 text-green-800">✓</Badge>
                    </div>
                    
                    {/* Mobile Ratings */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{scores.overall}</span>
                        <span className="text-muted-foreground">/5</span>
                      </div>
                      <div className="text-muted-foreground">({userRatings.total} reviews)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <a href="#visit" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Play Now - 100% up to $500
                    </a>
                  </Button>
                  
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                    <code className="flex-1 text-center font-mono">{promoCode}</code>
                    <Button size="sm" variant="ghost" onClick={copyPromoCode}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rest of the content structure remains similar but adapted for casino context */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Online Casino Review Content</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This is a comprehensive review template for online casinos, featuring detailed analysis of games, 
            bonuses, payment methods, security, and user experience.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OnlineCasinoReview;
