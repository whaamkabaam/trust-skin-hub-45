import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield, Clock, CreditCard, Globe, Users, TrendingUp, Star, ChevronDown, CheckCircle, XCircle, AlertTriangle, Copy, Gamepad2, DollarSign, HelpCircle, FileText, MessageCircle } from 'lucide-react';
import BoxesCatalog from '@/components/BoxesCatalog';
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
import { usePublicOperator } from '@/hooks/usePublicOperator';
import { usePublicReviews } from '@/hooks/usePublicReviews';
import { usePublicOperatorExtensions } from '@/hooks/usePublicOperatorExtensions';
import { SEOHead } from '@/components/SEOHead';
import { ContentSectionRenderer } from '@/components/ContentSectionRenderer';

const OperatorReview = () => {
  const { id: slug } = useParams<{ id: string }>();
  const [tocOpen, setTocOpen] = useState(false);
  const [promoCodeCopied, setPromoCodeCopied] = useState(false);
  const [keyFactsOpen, setKeyFactsOpen] = useState(false);
  const [prosConsOpen, setProsConsOpen] = useState(false);
  
  const { operator, contentSections, seoMetadata, loading, error } = usePublicOperator(slug || '');
  const { bonuses, payments, features, security, faqs } = usePublicOperatorExtensions(slug || '');
  const { reviews } = usePublicReviews(operator?.id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p>Loading operator...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-destructive">{error || 'Operator not found'}</p>
          <Link to="/operators" className="text-accent hover:underline">← Back to operators</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const sections = [{
    id: 'what-is',
    title: `What is ${operator.name}?`,
    anchor: 'what-is-section'
  }, {
    id: 'catalog',
    title: 'Boxes & Cases Catalog',
    anchor: 'catalog'
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

  // Dynamic data with fallbacks
  const ratings = operator?.ratings || {};
  const scores = {
    overall: ratings.overall || 0,
    user: ratings.overall || 0, // Use same for now
    trust: ratings.trust || 0,
    fees: ratings.value || 0,
    ux: ratings.ux || 0,
    support: ratings.support || 0,
    speed: ratings.payments || 0
  };
  
  // Get first active bonus for promo code
  const activeBonus = bonuses?.find(b => b.is_active) || null;
  const promoCode = activeBonus?.value || "GET10FREE";
  
  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setPromoCodeCopied(true);
    setTimeout(() => setPromoCodeCopied(false), 2000);
  };
  
  const siteType = operator?.modes?.includes('Case Opening') ? 'Case Site' : 'Mystery Box';
  const userRatings = {
    total: reviews?.length || 0,
    breakdown: {
      5: 45, 4: 30, 3: 15, 2: 7, 1: 3 // Default breakdown
    }
  };

  // Use actual FAQs or fallback
  const faqItems = faqs?.length > 0 ? faqs.map(faq => ({
    q: faq.question,
    a: faq.answer
  })) : [{
    q: `Is ${operator?.name} legit?`,
    a: `Yes, ${operator?.name} is a legitimate platform with proper security measures and verified payouts.`
  }, {
    q: "How do payouts work?",
    a: "Payouts are processed within 24-48 hours via Steam trade or direct shipping for physical items."
  }, {
    q: "What are the fees and limits?",
    a: "Deposit fees start at 0%, withdrawal fees vary by method. Minimum deposit is $10."
  }];

  // SEO content with dynamic data
  const seoTitle = seoMetadata?.meta_title || `${operator?.name} Review - CS2 Trading Platform`;
  const seoDescription = seoMetadata?.meta_description || `In-depth review of ${operator?.name}. Find out about fees, security, features, and user experiences.`;
  const structuredData = seoMetadata?.schema_data || {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: operator?.name,
      url: operator?.url
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: scores.overall,
      bestRating: 5
    },
    author: {
      '@type': 'Organization',
      name: 'CS2 Trading Reviews'
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        ogTitle={seoTitle}
        ogDescription={seoDescription}
        structuredData={structuredData}
      />
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
            <span className="font-semibold text-sm">{operator?.name}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{scores.overall.toFixed(1)}</span>
            </div>
          </div>
          <Button size="sm" asChild>
            <a href={operator?.url} target="_blank" rel="noopener noreferrer">
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
            <span className="font-medium">{operator?.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-muted/30 border-b">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 border">
                  {operator?.logo ? (
                    <img src={operator.logo} alt={`${operator.name} logo`} className="w-12 h-12 object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-primary">{operator?.name?.charAt(0)}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold">{operator?.name}</h1>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {siteType}
                    </Badge>
                    {operator?.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified ✓
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-8 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Our Rating:</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(scores.overall) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                        <span className="font-bold text-lg">{scores.overall.toFixed(1)}/5</span>
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
                        <span className="font-bold">{scores.user.toFixed(1)}/5</span>
                        <span className="text-muted-foreground">({userRatings.total})</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Facts */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                    <div>
                      <span className="text-muted-foreground">Launched:</span>
                      <span className="ml-2 font-medium">{operator?.launch_year || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payments:</span>
                      <div className="flex gap-1 mt-1">
                        {payments?.filter(p => p.method_type === 'deposit').slice(0, 3).map((payment, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{payment.payment_method}</Badge>
                        )) || (
                          <>
                            <Badge variant="outline" className="text-xs">Visa</Badge>
                            <Badge variant="outline" className="text-xs">BTC</Badge>
                            <Badge variant="outline" className="text-xs">ETH</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">KYC:</span>
                      <span className="ml-2 font-medium">{operator?.kycRequired ? 'Required' : 'Not Required'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Offer Card */}
            <div className="w-80 flex-shrink-0">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-center text-sm font-medium text-muted-foreground">Best Offer</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{activeBonus?.title || 'Free $10 + 3 Cases'}</div>
                    <div className="text-sm text-muted-foreground">
                      {activeBonus?.description || 'Welcome Bonus'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-background rounded border border-dashed">
                    <code className="flex-1 text-center font-mono">{promoCode}</code>
                    <Button size="sm" variant="ghost" onClick={copyPromoCode}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button className="w-full" asChild>
                    <a href={operator?.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* LEFT - Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* What is Section */}
            <div id="what-is-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">What is {operator?.name}?</h2>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {operator?.verdict ? (
                      <div dangerouslySetInnerHTML={{ __html: operator.verdict }} />
                    ) : (
                      `${operator?.name} is a popular CS2 trading platform that offers case opening, skin trading, and various gaming modes for Counter-Strike 2 enthusiasts.`
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payments Section */}
            <div id="payments-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Payments</h2>
              </div>
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
                      {payments?.filter(p => p.method_type === 'deposit').map((payment, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <span className="text-sm">{payment.payment_method}</span>
                          <Badge className="bg-blue-100 text-blue-800 border-0">
                            ${payment.minimum_amount || 0} - ${payment.maximum_amount || 'No limit'}
                          </Badge>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                            <span className="text-sm">Credit/Debit Cards (Visa, Mastercard)</span>
                            <Badge className="bg-blue-100 text-blue-800 border-0">$10 - $5,000</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                            <span className="text-sm">Bitcoin (BTC)</span>
                            <Badge className="bg-orange-100 text-orange-800 border-0">$25 - $10,000</Badge>
                          </div>
                        </>
                      )}
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
                      {payments?.filter(p => p.method_type === 'withdrawal').map((payment, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <div>
                            <span className="text-sm font-medium">{payment.payment_method}</span>
                            <p className="text-xs text-muted-foreground">{payment.processing_time || 'Processing time varies'}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-0">
                            {payment.fee_percentage ? `${payment.fee_percentage}%` : 
                             payment.fee_fixed ? `$${payment.fee_fixed}` : '0%'} fee
                          </Badge>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                            <div>
                              <span className="text-sm font-medium">Skins</span>
                              <p className="text-xs text-muted-foreground">{(operator as any)?.withdrawal_time_skins || 'Instant - 24 hours'}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-0">0% fee</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                            <div>
                              <span className="text-sm font-medium">Cryptocurrency</span>
                              <p className="text-xs text-muted-foreground">{(operator as any)?.withdrawal_time_crypto || '1-6 hours'}</p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-0">1-3% fee</Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bonuses Section */}
            <div id="bonuses-promos-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Bonuses & Promos</h2>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {bonuses?.filter(b => b.is_active).slice(0, 4).map((bonus, i) => (
                    <Card key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">🎁</span>
                          </div>
                          <h4 className="font-semibold text-green-800">{bonus.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{bonus.description || bonus.value}</p>
                      </CardContent>
                    </Card>
                  )) || (
                    <>
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 hover:shadow-lg transition-all duration-200">
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
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 hover:shadow-lg transition-all duration-200">
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
                    </>
                  )}
                </div>

                {bonuses?.filter(b => b.is_active).length > 0 && (
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50">
                    <CardContent className="p-6 space-y-6">
                      {bonuses.filter(b => b.is_active).map((bonus, i) => (
                        <div key={i}>
                          <h3 className="text-lg font-semibold mb-3">{bonus.title}</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {bonus.description || `Value: ${bonus.value}`}
                          </p>
                          {bonus.terms && (
                            <div className="text-sm text-muted-foreground bg-background/50 p-3 rounded">
                              <strong>Terms:</strong> {bonus.terms}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) || (
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Bonus Information</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {operator?.bonus_terms || `${operator?.name} offers various promotional bonuses and rewards for active users. Contact their support team for current bonus information.`}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div id="fairness-security-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Fairness & Security</h2>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="font-semibold text-green-800">Provably Fair</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {security?.provably_fair ? 'Cryptographic verification for all outcomes' : 'Traditional RNG system'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🔒</span>
                        </div>
                        <h4 className="font-semibold text-blue-800">SSL Security</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {security?.ssl_enabled ? `${security.ssl_provider || 'SSL'} encryption` : 'Basic security'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {security && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50">
                    <CardContent className="p-6 space-y-6">
                      {security.provably_fair && security.provably_fair_description && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            Provably Fair System
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {security.provably_fair_description}
                          </p>
                        </div>
                      )}
                      
                      {security.license_info && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Licensing & Regulation</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {security.license_info}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) || (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Security & Compliance</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {operator?.fairness_info || `${operator?.name} implements industry-standard security measures to protect user data and ensure fair gaming practices.`}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {faqItems.map((item, i) => (
                  <Collapsible key={i}>
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
                  </Collapsible>
                ))}
              </div>
            </div>

            {contentSections && contentSections.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Additional Information</h2>
                </div>
                <ContentSectionRenderer sections={contentSections} />
              </div>
            )}

          </div>

          {/* RIGHT - Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8 space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground text-sm">More About {operator?.name}</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/operators/${operator?.id}/promo-code`}>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Promo Code
                    </Link>
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>On this page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {sections.map((section) => (
                    <a key={section.id} href={`#${section.anchor}`} className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors">
                      • {section.title}
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </section>

      {/* Mobile Bottom CTA */}
      <div className="sticky bottom-0 z-40 bg-background/95 backdrop-blur-sm border-t p-4 md:hidden">
        <div className="flex gap-2">
          <Button className="flex-1" asChild>
            <a href={operator?.url} target="_blank" rel="noopener noreferrer">
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
    </div>
  );
};

export default OperatorReview;