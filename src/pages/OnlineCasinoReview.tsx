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
    id: 'overview',
    title: 'Overview',
    anchor: 'overview-section'
  }, {
    id: 'licensing',
    title: 'Licensing & Ownership',
    anchor: 'licensing-section'
  }, {
    id: 'payments',
    title: 'Payments & Payout Speed',
    anchor: 'payments-section'
  }, {
    id: 'bonuses',
    title: 'Bonuses & Promo Terms',
    anchor: 'bonuses-section'
  }, {
    id: 'games',
    title: 'Games & Providers',
    anchor: 'games-section'
  }, {
    id: 'fairness',
    title: 'Fairness & Security',
    anchor: 'fairness-section'
  }, {
    id: 'responsible-gambling',
    title: 'Responsible Gambling',
    anchor: 'responsible-gambling-section'
  }, {
    id: 'support',
    title: 'Support & KYC',
    anchor: 'support-section'
  }, {
    id: 'restrictions',
    title: 'Country Restrictions',
    anchor: 'restrictions-section'
  }, {
    id: 'reviews',
    title: 'User Reviews',
    anchor: 'reviews-section'
  }, {
    id: 'faq',
    title: 'FAQ',
    anchor: 'faq-section'
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
            <div className="space-y-4">
              {/* Main Casino Card */}
              <Card className="bg-gradient-to-br from-background to-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center flex-shrink-0 border">
                      <span className="text-2xl">🎰</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h1 className="text-xl font-bold leading-tight mb-2">Online Casino Review</h1>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Casino
                            </Badge>
                            <Badge className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Licensed
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Ratings */}
                      <div className="flex items-center gap-6 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{scores.overall}</span>
                            <span className="text-muted-foreground">/5</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">({userRatings.total} reviews)</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile CTA */}
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <div className="text-lg font-bold text-primary mb-1">100% up to $500</div>
                      <div className="text-sm text-muted-foreground">+ 200 Free Spins</div>
                    </div>
                    
                    <Button className="w-full h-12 text-base font-semibold" asChild>
                      <a href="#visit" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Play Now
                      </a>
                    </Button>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
                      <span className="text-xs text-muted-foreground">Promo Code:</span>
                      <code className="flex-1 text-center font-mono font-bold">{promoCode}</code>
                      <Button size="sm" variant="ghost" onClick={copyPromoCode} className="h-8 w-8 p-0">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Founded:</span>
                      <div className="font-medium">2018</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">License:</span>
                      <div className="font-medium">MGA, UKGC</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min Deposit:</span>
                      <div className="font-medium">$20</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Cashout:</span>
                      <div className="font-medium">$10,000/day</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Payout:</span>
                      <div className="font-medium">24-48h</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Currencies:</span>
                      <div className="font-medium">USD, EUR, BTC</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Section Navigation - Hide on mobile/tablet, show mobile nav instead */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        {/* Desktop Navigation */}
        <div className="hidden xl:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 lg:gap-6 py-3 overflow-x-auto scrollbar-hide">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.anchor}`}
                  className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded hover:bg-muted/50 flex-shrink-0"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile/Tablet Navigation */}
        <div className="xl:hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap mr-2">Sections:</span>
              {sections.slice(0, 5).map((section) => (
                <a
                  key={section.id}
                  href={`#${section.anchor}`}
                  className="whitespace-nowrap text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded hover:bg-muted/50 flex-shrink-0 bg-muted/30"
                >
                  {section.title}
                </a>
              ))}
              <span className="text-xs text-muted-foreground">...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="space-y-8 sm:space-y-12">
            
            {/* Overview Section */}
            <section id="overview-section" className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold">Overview</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                </p>
                
                {/* Mode Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    <Gamepad2 className="w-4 h-4 mr-1" />
                    Casino
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Users className="w-4 h-4 mr-1" />
                    Live Dealer
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Sportsbook
                  </Badge>
                </div>
              </div>
            </section>

            {/* Licensing & Ownership */}
            <section id="licensing-section" className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold">Licensing & Ownership</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                </p>
              </div>
              
              {/* Regulator Seals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold text-sm sm:text-base">Malta Gaming Authority</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">License: MGA/B2C/394/2017</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold text-sm sm:text-base">UK Gambling Commission</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">License: 39028</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold text-sm sm:text-base">Swedish Gambling Authority</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">License: 18-10-024</div>
                </Card>
              </div>

              {/* Company Facts Accordion */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">Company Information</span>
                  <ChevronDown className="w-4 h-4 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Parent Company:</span>
                      <span className="ml-2 text-muted-foreground">Gaming Innovations Ltd</span>
                    </div>
                    <div>
                      <span className="font-medium">Registration:</span>
                      <span className="ml-2 text-muted-foreground">C81112 (Malta)</span>
                    </div>
                    <div>
                      <span className="font-medium">Headquarters:</span>
                      <span className="ml-2 text-muted-foreground">St. Julian's, Malta</span>
                    </div>
                    <div>
                      <span className="font-medium">Sister Sites:</span>
                      <span className="ml-2 text-muted-foreground">CasinoSibling.com, SpinPartner.com</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </section>

            {/* Payments & Payout Speed */}
            <section id="payments-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Payments & Payout Speed</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                {['Visa', 'Mastercard', 'PayPal', 'Skrill', 'Neteller', 'Bitcoin', 'Bank Transfer', 'Apple Pay'].map((method) => (
                  <div key={method} className="flex flex-col items-center gap-2 p-2 sm:p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                    <span className="text-xs font-medium text-center leading-tight">{method}</span>
                  </div>
                ))}
              </div>

              {/* Payment Methods Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto -mx-1">
                    <div className="inline-block min-w-full align-middle">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[80px]">Method</th>
                            <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[100px]">Min/Max</th>
                            <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[60px]">Fee</th>
                            <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[90px]">Avg Payout</th>
                            <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[120px] hidden sm:table-cell">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b">
                            <td className="py-3 px-1 sm:px-2 font-medium">Credit Cards</td>
                            <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm">$20 / $5,000</td>
                            <td className="py-3 px-1 sm:px-2">0%</td>
                            <td className="py-3 px-1 sm:px-2">24-48h</td>
                            <td className="py-3 px-1 sm:px-2 hidden sm:table-cell text-xs sm:text-sm">Visa/Mastercard accepted</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-1 sm:px-2 font-medium">E-wallets</td>
                            <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm">$10 / $10,000</td>
                            <td className="py-3 px-1 sm:px-2">0%</td>
                            <td className="py-3 px-1 sm:px-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                Instant
                              </Badge>
                            </td>
                            <td className="py-3 px-1 sm:px-2 hidden sm:table-cell text-xs sm:text-sm">PayPal, Skrill, Neteller</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-1 sm:px-2 font-medium">Cryptocurrency</td>
                            <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm">$25 / $25,000</td>
                            <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm">Network fee</td>
                            <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm">15min - 2h</td>
                            <td className="py-3 px-1 sm:px-2 hidden sm:table-cell text-xs sm:text-sm">Bitcoin, Ethereum, Litecoin</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Bonuses & Promo Terms */}
            <section id="bonuses-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Bonuses & Promo Terms</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Welcome Bonus */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                      Welcome Bonus
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">New Players</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold">100% up to $500</div>
                      <div className="text-sm text-muted-foreground">+ 200 Free Spins</div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border border-dashed">
                      <code className="flex-1 text-center font-mono text-sm">WELCOME500</code>
                      <Button size="sm" variant="ghost">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Min Dep: $20 • Wagering: 35x • Max Bet: $5</div>
                      <div>Expiry: 30 days • Non-sticky bonus</div>
                    </div>
                  </CardContent>
                </Card>

                {/* No Deposit Bonus */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                      No Deposit Bonus
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Free</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold">$10 Free</div>
                      <div className="text-sm text-muted-foreground">No deposit required</div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border border-dashed">
                      <code className="flex-1 text-center font-mono text-sm">NODEPOSIT10</code>
                      <Button size="sm" variant="ghost">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Wagering: 50x • Max Cashout: $100</div>
                      <div>Expiry: 7 days • Selected games only</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Full Terms Accordion */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">Full Bonus Terms & Conditions</span>
                  <ChevronDown className="w-4 h-4 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Game Contributions</h4>
                    <ul className="space-y-1">
                      <li>• Slots: 100%</li>
                      <li>• Table Games: 10%</li>
                      <li>• Live Casino: 10%</li>
                      <li>• Video Poker: 5%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Excluded Games</h4>
                    <p>Progressive jackpot slots, certain high RTP games, and all skill-based games are excluded from bonus play.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Geographic Restrictions</h4>
                    <p>Bonuses not available to players from UK, US, France, and other restricted jurisdictions.</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </section>

            {/* Games & Providers */}
            <section id="games-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Games & Providers</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              {/* Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="text-center p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl font-bold text-primary">2,000+</div>
                  <div className="text-sm text-muted-foreground">Slots</div>
                </Card>
                <Card className="text-center p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">150+</div>
                  <div className="text-sm text-muted-foreground">Live Tables</div>
                </Card>
                <Card className="text-center p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-muted-foreground">Providers</div>
                </Card>
              </div>

              {/* Provider Grid */}
              <div>
                <h3 className="font-semibold mb-4">Software Providers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {['NetEnt', 'Microgaming', 'Evolution', 'Pragmatic Play', 'Play\'n GO', 'Red Tiger', 'Yggdrasil', 'Quickspin', 'Big Time Gaming', 'Blueprint', 'ELK Studios', 'NoLimit City'].map((provider) => (
                    <div key={provider} className="flex items-center justify-center p-2 sm:p-3 border rounded-lg hover:shadow-sm transition-shadow min-h-[60px] sm:min-h-[70px]">
                      <span className="text-xs font-medium text-center leading-tight">{provider}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RTP Policy Callout */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      RTP Policy
                    </Badge>
                    <span className="font-medium">Maximum RTP</span>
                    <div className="text-sm text-muted-foreground">All games run at maximum theoretical RTP as certified by providers</div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Fairness & Security */}
            <section id="fairness-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Fairness & Security</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              {/* Testing Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold text-sm sm:text-base">eCOGRA Certified</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">RNG & RTP verified monthly</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold text-sm sm:text-base">GLI Tested</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Gaming systems compliance</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold text-sm sm:text-base">iTech Labs</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Random Number Generator certified</div>
                </Card>
              </div>

              {/* Security Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>256-bit SSL encryption for all transactions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>GDPR compliant data protection policies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Player funds held in segregated accounts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Two-factor authentication available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Responsible Gambling Tools */}
            <section id="responsible-gambling-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Responsible Gambling Tools</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Available Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto -mx-1">
                      <div className="inline-block min-w-full align-middle">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[100px]">Tool</th>
                              <th className="text-center py-3 px-1 sm:px-2 font-medium min-w-[80px]">Available?</th>
                              <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[90px] hidden sm:table-cell">Where to Set</th>
                              <th className="text-left py-3 px-1 sm:px-2 font-medium min-w-[100px] hidden md:table-cell">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-b">
                              <td className="py-3 px-1 sm:px-2 font-medium text-xs sm:text-sm">Deposit Limits</td>
                              <td className="py-3 px-1 sm:px-2 text-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                              </td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden sm:table-cell">Account Settings</td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden md:table-cell">Daily, weekly, monthly</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-1 sm:px-2 font-medium text-xs sm:text-sm">Loss Limits</td>
                              <td className="py-3 px-1 sm:px-2 text-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                              </td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden sm:table-cell">Account Settings</td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden md:table-cell">Net loss tracking</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-1 sm:px-2 font-medium text-xs sm:text-sm">Time-outs</td>
                              <td className="py-3 px-1 sm:px-2 text-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                              </td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden sm:table-cell">Responsible Gaming</td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden md:table-cell">24h to 6 months</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-1 sm:px-2 font-medium text-xs sm:text-sm">Self-exclude</td>
                              <td className="py-3 px-1 sm:px-2 text-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                              </td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden sm:table-cell">Contact Support</td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden md:table-cell">Permanent or timed</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-1 sm:px-2 font-medium text-xs sm:text-sm">Reality Checks</td>
                              <td className="py-3 px-1 sm:px-2 text-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                              </td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden sm:table-cell">Game Settings</td>
                              <td className="py-3 px-1 sm:px-2 text-xs sm:text-sm hidden md:table-cell">Pop-up reminders</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              {/* External Help Organizations */}
              <div>
                <h3 className="font-semibold mb-4">External Help Organizations</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">GamCare</div>
                        <div className="text-sm text-muted-foreground">UK support & counseling</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Gamblers Anonymous</div>
                        <div className="text-sm text-muted-foreground">International support groups</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* Support & KYC Experience */}
            <section id="support-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Support & KYC Experience</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              {/* Contact Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold text-sm sm:text-base">Live Chat</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">24/7 Available</div>
                  <div className="text-xs text-green-600 mt-1">Avg response: 30s</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold text-sm sm:text-base">Email</div>
                  <div className="text-xs sm:text-sm text-muted-foreground break-all">support@casino.com</div>
                  <div className="text-xs text-green-600 mt-1">Avg response: 4h</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold text-sm sm:text-base">Phone</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">+356 2778 1234</div>
                  <div className="text-xs text-muted-foreground mt-1">Mon-Fri 9-17 CET</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-semibold text-sm sm:text-base">FAQ</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Comprehensive guide</div>
                  <div className="text-xs text-blue-600 mt-1">200+ topics</div>
                </Card>
              </div>

              {/* KYC Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">KYC Verification Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative">
                    <div className="hidden sm:block absolute top-4 left-0 right-0 h-0.5 bg-muted"></div>
                    
                    {/* Mobile: Vertical Layout */}
                    <div className="sm:hidden space-y-4 w-full">
                      <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Requested</div>
                          <div className="text-xs text-muted-foreground">Immediate</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Submitted</div>
                          <div className="text-xs text-muted-foreground">Within 24h</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Approved</div>
                          <div className="text-xs text-muted-foreground">1-3 business days</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop: Horizontal Layout */}
                    <div className="hidden sm:flex items-center justify-between w-full relative">
                      <div className="flex flex-col items-center relative bg-background px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">Requested</div>
                        <div className="text-xs text-muted-foreground">Immediate</div>
                      </div>
                      <div className="flex flex-col items-center relative bg-background px-2">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center mb-2">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">Submitted</div>
                        <div className="text-xs text-muted-foreground">Within 24h</div>
                      </div>
                      <div className="flex flex-col items-center relative bg-background px-2">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mb-2">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">Approved</div>
                        <div className="text-xs text-muted-foreground">1-3 business days</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Country/State Restrictions */}
            <section id="restrictions-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Country/State Restrictions</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-amber-900">Geographic Restrictions Apply</div>
                      <div className="text-sm text-amber-700 mt-1">
                        This casino is not available in certain jurisdictions. Check local laws before playing.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="font-medium">View Restricted Countries</span>
                  <ChevronDown className="w-4 h-4 transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    {['United States', 'United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Australia', 'Canada', 'Israel', 'Turkey'].map((country) => (
                      <div key={country} className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>{country}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </section>


            {/* User Reviews & Ratings */}
            <section id="reviews-section" className="space-y-6">
              <h2 className="text-2xl font-bold">User Reviews & Ratings</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Rating Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Rating</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{scores.user}</div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(scores.user) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{userRatings.total} reviews</div>
                  </CardContent>
                </Card>

                {/* Rating Breakdown */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Rating Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(userRatings.breakdown).reverse().map(([rating, percentage]) => (
                        <div key={rating} className="flex items-center gap-4">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <div className="text-sm text-muted-foreground w-12 text-right">{percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">All Reviews</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">Payouts</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">Bonus Terms</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">Support</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">Games</Badge>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <ReviewCard key={review.id} review={review} showEntityName={false} />
                ))}
              </div>
              
              <div className="text-center">
                <Button variant="outline">View All Reviews</Button>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                      <span className="font-medium">{item.q}</span>
                      <ChevronDown className="w-4 h-4 transition-transform flex-shrink-0 ml-2" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t text-muted-foreground">
                      {item.a}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </section>

            {/* Verdict & Alternatives */}
            <section id="verdict-section" className="space-y-6">
              <h2 className="text-2xl font-bold">Verdict & Alternatives</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-lg font-semibold">Our Verdict</div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Excellent game selection with top-tier software providers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Fast withdrawal processing and multiple payment options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>High wagering requirements on bonus offers could be improved</span>
                      </li>
                    </ul>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full md:w-auto">
                        Compare Similar Casinos
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclosure */}
              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  <strong>Affiliate Disclosure:</strong> This review contains affiliate links. We may earn a commission 
                  when you sign up or make a deposit, at no additional cost to you.
                </p>
                <p>
                  <strong>Methodology:</strong> Our reviews are based on extensive testing, research, and analysis. 
                  Learn more about our <a href="#" className="text-primary hover:underline">review methodology</a>.
                </p>
              </div>
            </section>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="xl:sticky xl:top-8 space-y-4 sm:space-y-6">
              {/* At-a-glance Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded:</span>
                    <span className="font-medium">2018</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License:</span>
                    <span className="font-medium">MGA, UKGC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Deposit:</span>
                    <span className="font-medium">$20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Cashout:</span>
                    <span className="font-medium">$10,000/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Payout:</span>
                    <span className="font-medium">24-48h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Currencies:</span>
                    <span className="font-medium">USD, EUR, BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Languages:</span>
                    <span className="font-medium">15+</span>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Casinos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Casinos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          R
                        </div>
                        <div>
                          <div className="font-medium text-sm">Royal Casino</div>
                          <div className="text-xs text-muted-foreground">Similar bonuses</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.2</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          L
                        </div>
                        <div>
                          <div className="font-medium text-sm">Lucky Slots</div>
                          <div className="text-xs text-muted-foreground">Similar games</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          P
                        </div>
                        <div>
                          <div className="font-medium text-sm">Prime Gaming</div>
                          <div className="text-xs text-muted-foreground">Same license</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.1</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Similar Casinos
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href="#bonuses-section" className="block text-sm text-primary hover:underline py-1">
                    → Bonuses & Promotions
                  </a>
                  <a href="#payments-section" className="block text-sm text-primary hover:underline py-1">
                    → Payment Methods
                  </a>
                  <a href="#games-section" className="block text-sm text-primary hover:underline py-1">
                    → Games & Providers
                  </a>
                  <a href="#support-section" className="block text-sm text-primary hover:underline py-1">
                    → Customer Support
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OnlineCasinoReview;
