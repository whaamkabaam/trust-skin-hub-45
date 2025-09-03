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
const OperatorReview = () => {
  const [tocOpen, setTocOpen] = useState(false);
  const [promoCodeCopied, setPromoCodeCopied] = useState(false);
  const [keyFactsOpen, setKeyFactsOpen] = useState(false);
  const [prosConsOpen, setProsConsOpen] = useState(false);
  const operator = sampleOperators[0]; // Clash.gg example
  const reviews = sampleReviews.filter(r => r.entityId === operator.id);
  const sections = [{
    id: 'what-is',
    title: `What is ${operator.name}?`,
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
  const promoCode = "XYZ123";
  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setPromoCodeCopied(true);
    setTimeout(() => setPromoCodeCopied(false), 2000);
  };
  const siteType = operator.modes.includes('Case Opening') ? 'Case Site' : 'Mystery Box';
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
    q: `Is ${operator.name} legit?`,
    a: `Yes, ${operator.name} is a legitimate platform with proper security measures and verified payouts.`
  }, {
    q: "How do payouts work?",
    a: "Payouts are processed within 24-48 hours via Steam trade or direct shipping for physical items."
  }, {
    q: "What are the fees and limits?",
    a: "Deposit fees start at 0%, withdrawal fees vary by method. Minimum deposit is $10."
  }];

  const screenshots = [
    { id: 1, url: "/placeholder.svg", alt: "Clash.gg mobile homepage" },
    { id: 2, url: "/placeholder.svg", alt: "Case opening interface" },
    { id: 3, url: "/placeholder.svg", alt: "User dashboard" },
    { id: 4, url: "/placeholder.svg", alt: "Payment methods" },
    { id: 5, url: "/placeholder.svg", alt: "Game lobby" },
    { id: 6, url: "/placeholder.svg", alt: "Withdrawal interface" }
  ];
  return <div className="min-h-screen bg-background">
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
                    <span className="text-xl font-bold text-primary">{operator.name.charAt(0)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-3xl font-bold">{operator.name}</h1>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {siteType}
                      </Badge>
                      {operator.verified && <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified ✓
                        </Badge>}
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-8 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Our Rating:</span>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(scores.overall) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />)}
                          </div>
                          <span className="font-bold text-lg">{scores.overall}/5</span>
                        </div>
                      </div>
                      <div className="h-6 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">User Rating:</span>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(scores.user) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />)}
                          </div>
                          <span className="font-bold">{scores.user}/5</span>
                          <span className="text-muted-foreground">({userRatings.total})</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Facts */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                      <div>
                        <span className="text-muted-foreground">Launched:</span>
                        <span className="ml-2 font-medium">2020</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payments:</span>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">Visa</Badge>
                          <Badge variant="outline" className="text-xs">BTC</Badge>
                          <Badge variant="outline" className="text-xs">ETH</Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">KYC:</span>
                        <span className="ml-2 font-medium">{operator.kycRequired ? 'Required' : 'Not Required'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payout:</span>
                        <div className="flex gap-1 mt-1">
                          {siteType === 'Case Site' ? (
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                              Skins
                            </Badge>
                          ) : (
                            <>
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                                Physical
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                                Skins
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Provably Fair:</span>
                        <span className="ml-2 font-medium text-green-600">Yes</span>
                      </div>
                    </div>

                    {/* Optional Features - Better organized */}
                    {(operator.otherFeatures || operator.gamingModes || operator.games || operator.categories) && (
                      <div className="space-y-3 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {operator.otherFeatures && (
                            <div>
                              <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Other Features</span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {operator.otherFeatures.map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs hover-scale">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {operator.gamingModes && (
                            <div>
                              <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Gaming Modes</span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {operator.gamingModes.map((mode) => (
                                  <Badge key={mode} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 hover-scale">
                                    {mode}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {operator.games && (
                            <div>
                              <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Games</span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {operator.games.map((game) => (
                                  <Badge key={game} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 hover-scale">
                                    {game}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {operator.categories && (
                            <div>
                              <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Categories</span>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {operator.categories.map((category) => (
                                  <Badge key={category} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 hover-scale">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right - Best Offer */}
              <div className="w-80 flex-shrink-0">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-sm font-medium text-muted-foreground">Best Offer</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">Free $10 + 3 Cases</div>
                      <div className="text-sm text-muted-foreground">Welcome Bonus</div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background rounded border border-dashed">
                      <code className="flex-1 text-center font-mono">{promoCode}</code>
                      <Button size="sm" variant="ghost" onClick={copyPromoCode}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button className="w-full" asChild>
                      <a href={operator.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Rate Operator CTA */}
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 mt-4">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div className="flex justify-center mb-2">
                        <Star className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Rate this Operator</h3>
                      <p className="text-xs text-muted-foreground mt-1">Share your experience</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700 dark:hover:bg-emerald-900/70">
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
                    <span className="text-lg font-bold text-primary">{operator.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-xl font-bold">{operator.name}</h1>
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                        {siteType}
                      </Badge>
                      {operator.verified && <Badge className="text-xs bg-green-100 text-green-800">✓</Badge>}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">Our Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{scores.overall}</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-muted-foreground">User</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{scores.user}</span>
                          <span className="text-muted-foreground">({userRatings.total})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <Button className="flex-1" asChild>
                    <a href={operator.url} target="_blank" rel="noopener noreferrer">
                      Visit Site
                    </a>
                  </Button>
                  <Button variant="outline" onClick={copyPromoCode} className="flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    {promoCodeCopied ? "Copied!" : "Copy Code"}
                  </Button>
                </div>

                <Collapsible open={keyFactsOpen} onOpenChange={setKeyFactsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                    Key Facts
                    <ChevronDown className={`w-4 h-4 transition-transform ${keyFactsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 mt-3">
                    <div className="space-y-2 text-sm">
                      <div>• Launched 2020</div>
                      <div>• Payments: Visa, BTC, ETH</div>
                      <div className="flex items-center gap-1">
                        <span>• Payout:</span>
                        {siteType === 'Case Site' ? (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                            Skins
                          </Badge>
                        ) : (
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                              Physical
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                              Skins
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div>• Provably Fair: Yes</div>
                      <div>• KYC: {operator.kycRequired ? 'Required' : 'Not Required'}</div>
                    </div>
                    
                    {/* Optional Features - Mobile */}
                    {(operator.otherFeatures || operator.gamingModes || operator.games || operator.categories) && (
                      <div className="space-y-3 border-t pt-3 mt-3">
                        {operator.otherFeatures && (
                          <div>
                            <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide block mb-2">Other Features</span>
                            <div className="flex flex-wrap gap-1">
                              {operator.otherFeatures.map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {operator.gamingModes && (
                          <div>
                            <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide block mb-2">Gaming Modes</span>
                            <div className="flex flex-wrap gap-1">
                              {operator.gamingModes.map((mode) => (
                                <Badge key={mode} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                                  {mode}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {operator.games && (
                          <div>
                            <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide block mb-2">Games</span>
                            <div className="flex flex-wrap gap-1">
                              {operator.games.map((game) => (
                                <Badge key={game} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                  {game}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {operator.categories && (
                          <div>
                            <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide block mb-2">Categories</span>
                            <div className="flex flex-wrap gap-1">
                              {operator.categories.map((category) => (
                                <Badge key={category} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            <Collapsible open={prosConsOpen} onOpenChange={setProsConsOpen}>
              <Card className="mb-4">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-left">
                  <span className="font-medium">Pros & Cons</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${prosConsOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">PROS</h4>
                        <ul className="text-sm space-y-1">
                          {operator.pros.slice(0, 3).map((pro, i) => <li key={i} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">+</span>
                              <span>{pro}</span>
                            </li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">CONS</h4>
                        <ul className="text-sm space-y-1">
                          {operator.cons.slice(0, 3).map((con, i) => <li key={i} className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">–</span>
                              <span>{con}</span>
                            </li>)}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Mobile TOC */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {sections.map(section => <Button key={section.id} variant="outline" size="sm" className="whitespace-nowrap text-xs" asChild>
                  <a href={`#${section.anchor}`}>
                    {section.title.replace(/^(What|Games|Prizes|Bonuses)/g, match => match.slice(0, match.includes('&') ? match.indexOf('&') : 6))}
                  </a>
                </Button>)}
            </div>
          </div>

          {/* Category Ratings - Bottom of Hero */}
          <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
            <h3 className="text-center font-semibold mb-4 text-foreground">Rating Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 justify-center max-w-4xl mx-auto">
              <div className="flex justify-center">
                <Badge className="w-full flex flex-col items-center justify-center py-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 min-h-[60px] hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xs opacity-90 mb-1">Trust:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="font-bold text-sm">4.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge className="w-full flex flex-col items-center justify-center py-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 min-h-[60px] hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xs opacity-90 mb-1">Value:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="font-bold text-sm">4.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge className="w-full flex flex-col items-center justify-center py-3 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 min-h-[60px] hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xs opacity-90 mb-1">Payments:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="font-bold text-sm">3.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge className="w-full flex flex-col items-center justify-center py-3 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 min-h-[60px] hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xs opacity-90 mb-1">Offering:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="font-bold text-sm">4.0/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge className="w-full flex flex-col items-center justify-center py-3 bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-0 min-h-[60px] hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xs opacity-90 mb-1">UX & Tools:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="font-bold text-sm">4.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge className="w-full flex flex-col items-center justify-center py-3 bg-gradient-to-br from-rose-500 to-pink-600 text-white border-0 min-h-[60px] hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xs opacity-90 mb-1">Support:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white text-white" />
                    <span className="font-bold text-sm">3.5/5</span>
                  </div>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Body */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* LEFT - Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Desktop Pros & Cons */}
            <div className="hidden md:block">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-emerald-700 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      PROS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {operator.pros.map((pro, i) => <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-600 font-bold mt-0.5 w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center text-xs">+</span>
                          <span>{pro}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-700 flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      CONS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {operator.cons.map((con, i) => <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-red-600 font-bold mt-0.5 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">–</span>
                          <span>{con}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* What is [Site]? */}
            <div id="what-is-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">What is {operator.name}?</h2>
              </div>
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200/50">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Platform Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {operator.name} is a {siteType.toLowerCase()} that launched in 2020, establishing itself as one of the prominent platforms in the CS:GO and gaming skin ecosystem. The platform specializes in providing users with an exciting and transparent way to acquire rare gaming items through various game modes including case openings, battles, and upgrades.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      What sets {operator.name} apart from many competitors is their commitment to provably fair gaming mechanics, ensuring that every case opening and game result can be verified by users. The platform operates under proper licensing and maintains a strong reputation within the gaming community, with over 100,000 active users worldwide.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Core Features & Functionality</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The platform offers a comprehensive suite of gaming modes beyond traditional case opening. Users can engage in competitive case battles against other players, participate in jackpot games with community pools, and use the upgrade system to trade lower-value items for potentially higher-value ones. The user interface is designed with both desktop and mobile users in mind, ensuring a seamless experience across all devices.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Security and user protection are prioritized through multiple layers of verification and encryption. The platform implements industry-standard security measures including SSL encryption, secure payment processing, and regular security audits. Additionally, responsible gaming features are built into the platform to help users maintain healthy gaming habits.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Target Audience & Community</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {operator.name} caters to a diverse range of users, from casual gamers looking for entertainment to serious skin traders seeking high-value items. The platform maintains an active community through Discord servers, social media channels, and in-platform chat features. Regular promotions, tournaments, and community events help foster engagement and provide additional value to users beyond the core gaming experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Screenshots Gallery */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Screenshots</h2>
              </div>
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200/50">
                <CardContent className="p-6">
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {screenshots.map((screenshot, index) => (
                        <CarouselItem key={screenshot.id} className="pl-2 md:pl-4 basis-3/4 md:basis-1/3">
                          <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer border-2 border-transparent hover:border-pink-300">
                            <img 
                              src={screenshot.url} 
                              alt={screenshot.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            </div>

            {/* Games & Modes */}
            <div id="games-modes-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Games & Modes</h2>
              </div>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Solo Unbox', 'Battles', 'Upgrade', 'Jackpot', 'Wheel'].map((mode, index) => {
                    const colors = [
                      'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
                      'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
                      'bg-gradient-to-r from-purple-500 to-pink-600 text-white',
                      'bg-gradient-to-r from-orange-500 to-red-600 text-white',
                      'bg-gradient-to-r from-cyan-500 to-teal-600 text-white'
                    ];
                    return <Badge key={mode} className={`px-3 py-2 border-0 ${colors[index]} hover:scale-105 transition-transform cursor-pointer`}>
                        {mode}
                      </Badge>
                  })}
                </div>

                {/* Game Mode Cards */}
                <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/20 dark:to-blue-900/20 border-blue-200/50">
                  <CardContent className="p-6">
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-xs font-bold">1</span>
                        </div>
                        <div><strong className="text-foreground">Solo Unbox:</strong> Open cases individually with guaranteed drops</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-emerald-600 text-xs font-bold">2</span>
                        </div>
                        <div><strong className="text-foreground">Battles:</strong> Compete against other players in case opening duels</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 text-xs font-bold">3</span>
                        </div>
                        <div><strong className="text-foreground">Upgrade:</strong> Trade lower-value skins for higher-value ones</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs font-bold">4</span>
                        </div>
                        <div><strong className="text-foreground">Jackpot:</strong> Pool-based games with rotating prizes</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-cyan-600 text-xs font-bold">5</span>
                        </div>
                        <div><strong className="text-foreground">Wheel:</strong> Spin-to-win games with various multipliers</div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Detailed Content */}
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Game Variety & Features</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Competitive Gaming & Community</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Prizes & Payouts */}
            <div id="prizes-payouts-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Prizes & Payouts</h2>
              </div>
              <div className="space-y-4">
                {siteType === 'Case Site' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Gamepad2 className="w-5 h-5 text-yellow-600" />
                          Prize Structure
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {operator.name} offers an extensive catalog of CS:GO and other gaming skins with values ranging from a few cents to several thousand dollars. The platform features over 500 different cases, each containing curated collections of items from various price tiers.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                            Dragon Lore AWPs
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                            Karambit Doppler Knives
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                            Exclusive Limited Skins
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <ExternalLink className="w-5 h-5 text-green-600" />
                          Withdrawal Process
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Won skins are immediately added to your account inventory and can be withdrawn through multiple methods. The primary withdrawal option is Steam trading.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-800 dark:text-green-300">
                            <strong>Steam Trade:</strong> Direct delivery via trade bots within minutes
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-800 dark:text-blue-300">
                            <strong>Marketplace:</strong> Sell for credits or crypto
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                          Value Guarantee
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          The prize pool is constantly updated to reflect current market values, ensuring that users receive items worth their actual trading value.
                        </p>
                        <div className="space-y-3">
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            Real-time Market Pricing
                          </Badge>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            Quality Assurance
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Trade History
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          A comprehensive trade history system allows users to track all transactions and maintain detailed records of their wins and withdrawals.
                        </p>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">100%</div>
                          <div className="text-sm text-muted-foreground">Transparent Records</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Gamepad2 className="w-5 h-5 text-amber-600" />
                          Physical Prizes
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Impressive selection of physical prizes spanning multiple categories including cutting-edge electronics, gaming peripherals, and collectibles.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Gaming Laptops & GPUs
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Premium Peripherals
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Limited Collectibles
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Gift Cards
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-green-600" />
                          Global Shipping
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Reliable logistics providers ensure fast and secure delivery worldwide. Most items are shipped within 2-3 business days.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-800 dark:text-green-300">
                            <strong>50+ Countries:</strong> International delivery available
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-800 dark:text-blue-300">
                            <strong>7-14 Days:</strong> Fast delivery times
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-indigo-600" />
                          Prize Values
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Prize values range from $10 gift cards to high-end electronics worth thousands of dollars with regular inventory updates.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div>
                            <div className="text-xl font-bold text-indigo-600">$10+</div>
                            <div className="text-xs text-muted-foreground">Minimum Value</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-indigo-600">$5000+</div>
                            <div className="text-xs text-muted-foreground">Premium Items</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 hover-scale">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-orange-600" />
                          Credit Conversion
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Convert physical prizes to platform credits at fair market rates for continued playing or saving for high-value boxes.
                        </p>
                        <div className="text-center">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            Flexible Options Available
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Payments */}
            <div id="payments-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Payments</h2>
              </div>
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">💳</span>
                        </div>
                        Deposit Methods & Limits
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <span className="text-sm">Credit/Debit Cards (Visa, Mastercard)</span>
                          <Badge className="bg-blue-100 text-blue-800 border-0">$10 - $5,000</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <span className="text-sm">Bitcoin (BTC)</span>
                          <Badge className="bg-orange-100 text-orange-800 border-0">$25 - $10,000</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <span className="text-sm">Ethereum (ETH)</span>
                          <Badge className="bg-purple-100 text-purple-800 border-0">$25 - $10,000</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <span className="text-sm">Skins</span>
                          <Badge className="bg-green-100 text-green-800 border-0">Variable</Badge>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">⏱️</span>
                        </div>
                        Withdrawal Timeframes & Fees
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <div>
                            <span className="text-sm font-medium">Skins</span>
                            <p className="text-xs text-muted-foreground">Instant - 24 hours</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-0">0% fee</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <div>
                            <span className="text-sm font-medium">Cryptocurrency</span>
                            <p className="text-xs text-muted-foreground">1-6 hours</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 border-0">1-3% fee</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <div>
                            <span className="text-sm font-medium">Physical items</span>
                            <p className="text-xs text-muted-foreground">7-14 days shipping</p>
                          </div>
                          <Badge className="bg-red-100 text-red-800 border-0">$5-15 fee</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bonuses & Promos */}
            <div id="bonuses-promos-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Bonuses & Promos</h2>
              </div>
              <div className="space-y-6">
                {/* Bonus Cards Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🎁</span>
                        </div>
                        <h4 className="font-semibold text-green-800">Welcome Bonus</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Free $10 credit + 3 free cases</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">💰</span>
                        </div>
                        <h4 className="font-semibold text-blue-800">Rakeback</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Up to 15% daily rakeback on losses</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">📅</span>
                        </div>
                        <h4 className="font-semibold text-purple-800">Daily/Weekly</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Daily free case + weekly challenges</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">👥</span>
                        </div>
                        <h4 className="font-semibold text-orange-800">Referral</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">5% of friend's deposits for life</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Content */}
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Welcome Package & First Deposit Bonuses</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Loyalty Programs & VIP Benefits</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Omnis voluptas assumenda est, omnis dolor repellendus.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Promotional Events & Seasonal Offers</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Fairness & Security */}
            <div id="fairness-security-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Fairness & Security</h2>
              </div>
              <div className="space-y-6">
                {/* Security Cards Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="font-semibold text-green-800">Provably Fair</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Cryptographic verification for all outcomes</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🔒</span>
                        </div>
                        <h4 className="font-semibold text-blue-800">SSL Security</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">256-bit encryption for all transactions</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">📜</span>
                        </div>
                        <h4 className="font-semibold text-purple-800">Licensed</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Regulated under Curacao gaming license</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🛡️</span>
                        </div>
                        <h4 className="font-semibold text-orange-800">Anti-Fraud</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Advanced fraud detection systems</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🔐</span>
                        </div>
                        <h4 className="font-semibold text-teal-800">Data Protection</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">GDPR compliant data handling</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200/50 hover:shadow-lg transition-all duration-200 hover-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">⚖️</span>
                        </div>
                        <h4 className="font-semibold text-rose-800">Responsible Gaming</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Tools to promote safe gaming habits</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Content */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        Provably Fair Gaming & Transparency
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Security Measures & Data Protection</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Licensing & Regulatory Compliance</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* UX & Support */}
            <div id="ux-support-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">UX & Support</h2>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Performance & Mobile</h4>
                      <p className="text-sm text-muted-foreground">
                        Fast loading times, responsive design works well on mobile devices. iOS and Android apps available.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Support Channels</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 24/7 Live Chat (English, Spanish, Russian)</li>
                        <li>• Email: support@{operator.name.toLowerCase()}.com</li>
                        <li>• Comprehensive FAQ section</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Community</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Discord: 50K+ active members</li>
                        <li>• Twitter: @{operator.name}Official</li>
                        <li>• Reddit: r/{operator.name}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Verdict */}
            <div id="verdict-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Verdict</h2>
              </div>
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-200/50">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Overall Assessment</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Pros & Cons Summary</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <div className="text-3xl font-bold text-primary mb-2">{scores.overall}/5.0</div>
                      <div className="text-muted-foreground">Final Score</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* User Reviews & Ratings */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">User Reviews & Ratings</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start gap-6 flex-1">
                      {/* Overall Rating Display */}
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{scores.user}</div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${i < Math.floor(scores.user) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Based on {userRatings.total} reviews
                        </div>
                      </div>
                      
                      {/* Rating Breakdown with Progress Bars */}
                      <div className="flex-1 min-w-0 w-full md:max-w-md">
                        <div className="space-y-3">
                          {[5, 4, 3, 2, 1].map((starCount) => {
                            const percentage = userRatings.breakdown[starCount] || 0;
                            return (
                              <div key={starCount} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                  <span className="text-sm font-medium">{starCount}</span>
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out"
                                    style={{ 
                                      width: `${percentage}%`,
                                      minWidth: percentage > 0 ? '4px' : '0px'
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-10 text-right">
                                  {percentage}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Write Review Button */}
                    <Button variant="outline" className="shrink-0">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-4 border-t pt-6">
                    {reviews.slice(0, 3).map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                    
                    {reviews.length > 3 && (
                      <div className="text-center pt-4">
                        <Button variant="outline">
                          View All {reviews.length} Reviews
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              {faqItems.map((item, i) => <Collapsible key={i}>
                  <Card>
                    <CollapsibleTrigger className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <span className="font-medium">{item.q}</span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4">
                        <p className="text-muted-foreground">{item.a}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>)}
            </div>

            {/* Site Comparisons */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Site Comparisons</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-hellcase">
                    Clash.gg VS Hellcase
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-csgoluck">
                    Clash.gg VS CSGOLuck
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-farmskins">
                    Clash.gg VS Farmskins
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-csgoroll">
                    Clash.gg VS CSGORoll
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-skinclub">
                    Clash.gg VS SkinClub
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-skinport">
                    Clash.gg VS Skinport
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-daddyskins">
                    Clash.gg VS DaddySkins
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/compare/clash-vs-key-drop">
                    Clash.gg VS Key-Drop
                  </Link>
                </Button>
              </div>
            </div>

            {/* Legal & Responsible Play */}
            <div className="bg-muted/30 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                Legal & Responsible Gaming
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  This review is for informational purposes only. Gambling and skin trading involve risk of loss. 
                  Only gamble what you can afford to lose. If you have a gambling problem, seek help.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="text-primary hover:underline">GamCare.org.uk</a>
                  <a href="#" className="text-primary hover:underline">BeGambleAware.org</a>
                  <a href="#" className="text-primary hover:underline">GamblingTherapy.org</a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Sticky Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8 space-y-6">
              
              {/* More About Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground text-sm">More About {operator.name}</h3>
                <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={`/operators/${operator.id}/promo-code`}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Promo Code
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={`/operators/${operator.id}/cases`}>
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Cases or Boxes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={`/operators/${operator.id}/alternatives`}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Alternatives
                  </Link>
                </Button>
                </div>
              </div>
              
              {/* Quick Facts Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{siteType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Launched:</span>
                    <span className="font-medium">2020</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provably Fair:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KYC:</span>
                    <span className="font-medium">{operator.kycRequired ? 'Required' : 'Not Required'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Deposit:</span>
                    <span className="font-medium">$10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payout:</span>
                    <span className="font-medium">{siteType === 'Case Site' ? 'Steam Skins' : 'Ship Items | Steam Skins'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Visa</Badge>
                    <Badge variant="outline">MC</Badge>
                    <Badge variant="outline">Amex</Badge>
                    <Badge variant="outline">BTC</Badge>
                    <Badge variant="outline">ETH</Badge>
                    <Badge variant="outline">Skrill</Badge>
                  </div>
                </CardContent>
              </Card>


              {/* Trust & Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Trust & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SSL:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-muted-foreground">Recent Big Wins</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>AK-47 Redline</span>
                        <span className="font-medium">$127</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Knife Doppler</span>
                        <span className="font-medium">$890</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AWP Dragon Lore</span>
                        <span className="font-medium">$3,240</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Notice */}
              <Card className="border-warning/20 bg-warning/5">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-warning font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    Safety Notice
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 18+ only</li>
                    <li>• Gambling involves risk of loss</li>
                    <li>• <a href="#" className="text-primary hover:underline">Problem gambling help</a></li>
                  </ul>
                </CardContent>
              </Card>

              {/* TOC */}
              <Card>
                <CardHeader>
                  <CardTitle>On this page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {sections.map((section, index) => <a key={section.id} href={`#${section.anchor}`} className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors">
                      • {section.title}
                    </a>)}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom CTA */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t p-4 md:hidden">
        <div className="flex gap-2">
          <Button className="flex-1" asChild>
            <a href={operator.url} target="_blank" rel="noopener noreferrer">
              Visit Site
            </a>
          </Button>
          <Button variant="outline" onClick={copyPromoCode}>
            <Copy className="w-4 h-4" />
            {promoCodeCopied ? "Copied!" : "Code"}
          </Button>
          <Badge variant="outline" className="flex items-center px-3">
            18+
          </Badge>
        </div>
      </div>

      <Footer />
    </div>;
};
export default OperatorReview;