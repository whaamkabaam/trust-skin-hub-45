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
import { useMedia } from '@/hooks/useMedia';
import { SEOHead } from '@/components/SEOHead';
import { ContentSectionRenderer } from '@/components/ContentSectionRenderer';
import StarRating from '@/components/StarRating';
import { 
  formatSupportChannel, 
  formatFeatureName, 
  formatGamingMode, 
  formatGameName, 
  formatCategoryName, 
  formatPaymentMethod,
  formatWithdrawalTime
} from '@/lib/formatters';

const OperatorReview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tocOpen, setTocOpen] = useState(false);
  const [promoCodeCopied, setPromoCodeCopied] = useState(false);
  const [keyFactsOpen, setKeyFactsOpen] = useState(false);
  const [prosConsOpen, setProsConsOpen] = useState(false);
  
  const { operator, contentSections, seoMetadata, paymentMethods: payments, loading, error } = usePublicOperator(slug || '');
  const { bonuses, features, security, faqs } = usePublicOperatorExtensions(slug || '');
  const { reviews } = usePublicReviews(operator?.id || '');
  const { assets: mediaAssets } = useMedia(operator?.id);

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
  const promoCode = operator?.promo_code || activeBonus?.value || "GET10FREE";
  
  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setPromoCodeCopied(true);
    setTimeout(() => setPromoCodeCopied(false), 2000);
  };
  
  const siteType = operator?.site_type || (operator?.modes?.includes('Case Opening') ? 'Case Site' : 'Mystery Box');
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
    <div className="min-h-screen bg-background overflow-x-hidden">
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
        <div className="container mx-auto px-4 py-6 md:py-8 relative">
          {/* Hero Background Image - Less Obstructive */}
          {operator?.hero_image_url && (
            <div 
              className="absolute inset-0 opacity-10 rounded-lg" 
              style={{
                backgroundImage: `url(${operator.hero_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          {/* Desktop Layout */}
          <div className="hidden md:block relative z-10">
            <div className="flex items-start gap-6 mb-8">
              {/* Left - Site Info */}
              <div className="flex-1">
                <div className="flex items-start gap-6">
                  {/* Site Logo */}
                  <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 border">
                    {operator?.logo_url ? (
                      <img src={operator.logo_url} alt={`${operator.name} logo`} className="w-12 h-12 object-contain" />
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
                      {(operator?.verified || operator?.verification_status === 'verified') && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {operator?.verification_status === 'verified' ? 'Verified ✓' : 'Verified ✓'}
                        </Badge>
                      )}
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
                          {payments?.slice(0, 3).map((pm, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {pm.payment_method?.name || 'Payment Method'}
                            </Badge>
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
                      <div>
                        <span className="text-muted-foreground">Crypto Payout:</span>
                        <span className="ml-2 font-medium">{formatWithdrawalTime(operator?.withdrawal_time_crypto) || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fiat Payout:</span>
                        <span className="ml-2 font-medium">{formatWithdrawalTime(operator?.withdrawal_time_fiat) || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Skins Payout:</span>
                        <span className="ml-2 font-medium">{formatWithdrawalTime(operator?.withdrawal_time_skins) || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Provably Fair:</span>
                        <span className="ml-2 font-medium text-green-600">{security?.provably_fair ? 'Yes' : 'No'}</span>
                      </div>
                    </div>

                {/* Support Channels */}
                {operator?.support_channels && operator.support_channels.length > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    <div>
                      <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Support Channels</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {operator.support_channels.map((channel, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                            {formatSupportChannel(channel)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Operator Features */}
                {features && features.length > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    <div>
                      <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Platform Features</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                         {features.filter(f => f.is_highlighted).map((feature) => (
                           <Badge key={feature.id} variant="secondary" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
                             ⭐ {formatFeatureName(feature.feature_name)}
                           </Badge>
                         ))}
                         {features.filter(f => !f.is_highlighted).map((feature) => (
                           <Badge key={feature.id} variant="outline" className="text-xs">
                             {formatFeatureName(feature.feature_name)}
                           </Badge>
                         ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Features */}
                {(operator?.otherFeatures || operator?.gamingModes || operator?.games || operator?.categories) && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {operator?.otherFeatures && (
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Other Features</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {operator.otherFeatures.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {formatFeatureName(feature)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {operator?.gamingModes && (
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Gaming Modes</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {operator.gamingModes.map((mode) => (
                              <Badge key={mode} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                                {formatGamingMode(mode)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {operator?.games && (
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Games</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {operator.games.map((game) => (
                              <Badge key={game} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                {formatGameName(game)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {operator?.categories && (
                        <div>
                          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">Categories</span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {operator.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                                {formatCategoryName(category)}
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
                    {operator?.logo_url ? (
                      <img src={operator.logo_url} alt={`${operator.name} logo`} className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="text-lg font-bold text-primary">{operator?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-xl font-bold">{operator?.name}</h1>
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                        {siteType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <StarRating rating={scores.overall} size="sm" />
                      <span className="font-bold text-sm">{scores.overall.toFixed(1)}/10</span>
                      <span className="text-muted-foreground text-sm">({userRatings.total})</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Key Facts - Collapsible */}
                <Collapsible open={keyFactsOpen} onOpenChange={setKeyFactsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <span className="font-medium">Key Facts</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${keyFactsOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Launched:</span>
                        <span className="font-medium">{operator?.launch_year || 'N/A'}</span>
                      </div>
                      {payments && payments.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Payments:</span>
                          <div className="flex gap-1 mt-1">
                            {payments.filter(p => p.method_type === 'deposit').slice(0, 3).map((payment, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{formatPaymentMethod(payment.payment_method)}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">KYC:</span>
                        <span className="font-medium">{operator?.kycRequired ? 'Required' : 'Not Required'}</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Mobile Best Offer */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-4">
              <CardContent className="p-4 space-y-3">
                {activeBonus ? (
                  <>
                    <div className="text-center">
                      <div className="text-lg font-bold">{activeBonus.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {activeBonus.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background rounded border border-dashed">
                      <code className="flex-1 text-center font-mono text-sm">{promoCode}</code>
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
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>No active bonuses available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rating Breakdown Section */}
      <section className="bg-muted/30 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-2">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-lg">{scores.trust.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Trust</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-2">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-lg">{scores.fees.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Value</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-2">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-lg">{(ratings.payments || 0).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Payments</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-2">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-lg">{(ratings.offering || 0).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Offering</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-lg">{scores.ux.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">UX</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-2">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-lg">{scores.support.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* LEFT - Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Pros & Cons Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Pros Card */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {operator?.pros?.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800 dark:text-green-200">{pro}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800 dark:text-green-200">Fast and secure transactions</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800 dark:text-green-200">Wide variety of cases and skins</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800 dark:text-green-200">User-friendly interface</span>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Cons Card */}
              <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-300">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {operator?.cons?.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800 dark:text-red-200">{con}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-red-800 dark:text-red-200">Limited customer support hours</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-red-800 dark:text-red-200">Higher fees on certain payment methods</span>
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* What is Section */}
            <div id="what-is-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">What is {operator?.name}?</h2>
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="text-muted-foreground leading-relaxed">
                    {operator?.verdict ? (
                      <div dangerouslySetInnerHTML={{ __html: operator.verdict }} />
                    ) : (
                      `${operator?.name} is a popular CS2 trading platform that offers case opening, skin trading, and various gaming modes for Counter-Strike 2 enthusiasts.`
                    )}
                  </div>
                  
                  {/* Company Background */}
                  {operator?.company_background && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3">Company Background</h3>
                      <div className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: operator.company_background }} />
                    </div>
                  )}

                  {/* Supported Countries */}
                  {operator?.supported_countries && operator.supported_countries.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3">Supported Countries</h3>
                      <div className="flex flex-wrap gap-2">
                        {operator.supported_countries.slice(0, 10).map((country, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{country}</Badge>
                        ))}
                        {operator.supported_countries.length > 10 && (
                          <Badge variant="secondary" className="text-xs">+{operator.supported_countries.length - 10} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Content Sections - Main Platform Information */}
            {contentSections && contentSections.length > 0 && (
              <ContentSectionRenderer 
                sections={contentSections} 
                className="space-y-8"
              />
            )}

            {/* Screenshots Carousel */}
            {mediaAssets && mediaAssets.length > 0 && (
              <div id="screenshots-section" className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Screenshots</h2>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {mediaAssets.filter(asset => asset.type === 'screenshot').map((asset, index) => (
                          <CarouselItem key={asset.id} className="md:basis-1/2 lg:basis-1/2">
                            <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                              <img
                                src={asset.url}
                                alt={asset.alt_text || `${operator?.name} screenshot ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            {asset.caption && (
                              <p className="text-sm text-muted-foreground mt-2 text-center">{asset.caption}</p>
                            )}
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Games & Modes Section */}
            <div id="games-modes-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Games & Modes</h2>
              </div>
              
              {/* Features from Database */}
              {features && features.length > 0 && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      Platform Features
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {features.map((feature) => (
                        <div key={feature.id} className={`p-4 rounded-lg border ${feature.is_highlighted ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-background border-border'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {feature.is_highlighted && <span className="text-yellow-600">⭐</span>}
                            <h4 className="font-semibold">{feature.feature_name}</h4>
                            <Badge variant="outline" className="text-xs">{feature.feature_type}</Badge>
                          </div>
                          {feature.description && (
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gaming Modes & Games */}
              {(operator?.gamingModes || operator?.games) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {operator?.gamingModes && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">Gaming Modes</h3>
                        <div className="space-y-2">
                          {operator.gamingModes.map((mode, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                              <span className="text-blue-600">🎮</span>
                              <span className="text-sm font-medium">{formatGamingMode(mode)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {operator?.games && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-300">Supported Games</h3>
                        <div className="space-y-2">
                          {operator.games.map((game, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                              <span className="text-green-600">🎯</span>
                              <span className="text-sm font-medium">{formatGameName(game)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Fallback when no features/games are available */}
              {(!features || features.length === 0) && !operator?.gamingModes && !operator?.games && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Game modes and features information will be displayed here when available.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                      {payments && payments.length > 0 ? (
                        payments
                          .filter(pm => pm.method_type === 'deposit' || pm.method_type === 'both')
                          .map((pm, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                              <div className="flex items-center gap-2">
                                {pm.payment_method?.logo_url && (
                                  <img 
                                    src={pm.payment_method.logo_url} 
                                    alt={pm.payment_method.name} 
                                    className="w-6 h-6 object-contain"
                                  />
                                )}
                                <div>
                                  <span className="text-sm font-medium">{pm.payment_method?.name || 'Payment Method'}</span>
                                  {(pm.minimum_amount || pm.maximum_amount) && (
                                    <p className="text-xs text-muted-foreground">
                                      {pm.minimum_amount && `Min: $${pm.minimum_amount}`}
                                      {pm.minimum_amount && pm.maximum_amount && ' • '}
                                      {pm.maximum_amount && `Max: $${pm.maximum_amount}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-blue-100 text-blue-800 border-0">
                                  Available
                                </Badge>
                                {(pm.fee_percentage > 0 || pm.fee_fixed > 0) && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {pm.fee_percentage > 0 && `${pm.fee_percentage}% fee`}
                                    {pm.fee_percentage > 0 && pm.fee_fixed > 0 && ' + '}
                                    {pm.fee_fixed > 0 && `$${pm.fee_fixed}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
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
                      Withdrawal Methods & Timeframes
                    </h4>
                    <div className="space-y-2">
                      {payments && payments.length > 0 ? (
                        payments
                          .filter(pm => pm.method_type === 'withdrawal' || pm.method_type === 'both')
                          .map((pm, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                              <div className="flex items-center gap-2">
                                {pm.payment_method?.logo_url && (
                                  <img 
                                    src={pm.payment_method.logo_url} 
                                    alt={pm.payment_method.name} 
                                    className="w-6 h-6 object-contain"
                                  />
                                )}
                                <div>
                                  <span className="text-sm font-medium">{pm.payment_method?.name || 'Payment Method'}</span>
                                  <p className="text-xs text-muted-foreground">{pm.processing_time || 'Processing time varies'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800 border-0">Available</Badge>
                                {(pm.fee_percentage > 0 || pm.fee_fixed > 0) ? (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {pm.fee_percentage > 0 && `${pm.fee_percentage}% fee`}
                                    {pm.fee_percentage > 0 && pm.fee_fixed > 0 && ' + '}
                                    {pm.fee_fixed > 0 && `$${pm.fee_fixed}`}
                                  </p>
                                ) : (
                                  <p className="text-xs text-green-600 mt-1">No fees</p>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <>
                          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                            <div>
                              <span className="text-sm font-medium">Skins</span>
                              <p className="text-xs text-muted-foreground">{operator?.withdrawal_time_skins || 'Instant - 24 hours'}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-0">0% fee</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                            <div>
                              <span className="text-sm font-medium">Cryptocurrency</span>
                              <p className="text-xs text-muted-foreground">{operator?.withdrawal_time_crypto || '1-6 hours'}</p>
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
                         {bonus.description ? (
                           <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: bonus.description }} />
                         ) : bonus.value ? (
                           <p className="text-sm text-muted-foreground">{bonus.value}</p>
                         ) : null}
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
                          {bonus.description ? (
                            <div className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: bonus.description }} />
                          ) : bonus.value ? (
                            <p className="text-muted-foreground leading-relaxed mb-4">Value: {bonus.value}</p>
                          ) : null}
                          {bonus.terms && (
                            <div className="text-sm text-muted-foreground bg-background/50 p-3 rounded">
                              <strong>Terms:</strong> <span dangerouslySetInnerHTML={{ __html: bonus.terms }} />
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
                      <div className="text-muted-foreground leading-relaxed">
                        {operator?.bonus_terms ? (
                          <div dangerouslySetInnerHTML={{ __html: operator.bonus_terms }} />
                        ) : (
                          `${operator?.name} offers various promotional bonuses and rewards for active users. Contact their support team for current bonus information.`
                        )}
                      </div>
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
                          <div className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: security.provably_fair_description }} />
                        </div>
                      )}
                      
                      {security.license_info && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Licensing & Regulation</h3>
                          <div className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: security.license_info }} />
                        </div>
                      )}

                      {security.compliance_certifications && security.compliance_certifications.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Compliance Certifications</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {security.compliance_certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">{cert}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {security.data_protection_info && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
                          <div className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: security.data_protection_info }} />
                        </div>
                      )}

                      {security.responsible_gaming_info && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Responsible Gaming</h3>
                          <div className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: security.responsible_gaming_info }} />
                        </div>
                      )}

                      {security.complaints_platform && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Complaints Platform</h3>
                          <div className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: security.complaints_platform }} />
                        </div>
                      )}

                      {security.audit_info && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Audit Information</h3>
                          <div className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: security.audit_info }} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) || (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Security & Compliance</h3>
                      <div className="text-muted-foreground leading-relaxed">
                        {operator?.fairness_info ? (
                          <div dangerouslySetInnerHTML={{ __html: operator.fairness_info }} />
                        ) : (
                          `${operator?.name} implements industry-standard security measures to protect user data and ensure fair gaming practices.`
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* UX & Support Section */}
            <div id="ux-support-section" className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">UX & Support</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Support Channels */}
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-indigo-600" />
                      Support Channels
                    </h3>
                    {operator?.support_channels && operator.support_channels.length > 0 ? (
                      <div className="space-y-3">
                        {operator.support_channels.map((channel, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">💬</span>
                            </div>
                            <span className="font-medium">{channel}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">💬</span>
                          </div>
                          <span className="font-medium">Live Chat</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">📧</span>
                          </div>
                          <span className="font-medium">Email Support</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* User Experience Features */}
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-600" />
                      User Experience
                    </h3>
                     <div className="space-y-3">
                       <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                         <span className="text-sm">Support Channels</span>
                         <div className="flex flex-wrap gap-1">
                           {operator?.support_channels?.map((channel, i) => (
                             <Badge key={i} variant="outline" className="text-xs">{channel}</Badge>
                           )) || (
                             <Badge variant="outline" className="text-xs">24/7 Live Chat</Badge>
                           )}
                         </div>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                         <span className="text-sm">UX Rating</span>
                         <div className="flex items-center gap-2">
                           <div className="flex">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-4 h-4 ${i < Math.floor(scores.ux) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                             ))}
                           </div>
                           <span className="font-semibold">{scores.ux.toFixed(1)}/5</span>
                         </div>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                         <span className="text-sm">Support Rating</span>
                         <div className="flex items-center gap-2">
                           <div className="flex">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-4 h-4 ${i < Math.floor(scores.support) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                             ))}
                           </div>
                           <span className="font-semibold">{scores.support.toFixed(1)}/5</span>
                         </div>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
                         <span className="text-sm">Mobile Friendly</span>
                         <Badge className="bg-green-100 text-green-800">Yes</Badge>
                       </div>
                     </div>
                  </CardContent>
                </Card>
              </div>

              {/* Community Links */}
              {operator?.community_links && Object.keys(operator.community_links).length > 0 && (
                <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-200/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-violet-600" />
                      Community & Social
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(operator.community_links).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 rounded-lg hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
                        >
                          <span className="capitalize">{platform}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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


          </div>

          {/* RIGHT - Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{scores.overall.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trust Score</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {operator?.trustScore}/10
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Launched</span>
                    <span className="font-medium">{operator?.launch_year || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">KYC Required</span>
                    <Badge variant={operator?.kycRequired ? "destructive" : "outline"}>
                      {operator?.kycRequired ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Deposits</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {payments?.filter(p => p.method_type === 'deposit' || p.method_type === 'both').slice(0, 4).map((payment, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                             {payment.payment_method?.name || 'Unknown'}
                          </Badge>
                        )) || (
                          <>
                            <Badge variant="secondary" className="text-xs">Visa</Badge>
                            <Badge variant="secondary" className="text-xs">BTC</Badge>
                            <Badge variant="secondary" className="text-xs">ETH</Badge>
                            <Badge variant="secondary" className="text-xs">Skins</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Withdrawals</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {payments?.filter(p => p.method_type === 'withdrawal' || p.method_type === 'both').slice(0, 4).map((payment, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                             {payment.payment_method?.name || 'Unknown'}
                          </Badge>
                        )) || (
                          <>
                            <Badge variant="outline" className="text-xs">Skins</Badge>
                            <Badge variant="outline" className="text-xs">BTC</Badge>
                            <Badge variant="outline" className="text-xs">ETH</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Sites */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">CS</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">CSGORoll</div>
                        <div className="text-xs text-muted-foreground">Case Opening</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">4.2</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600">ST</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Stake</div>
                        <div className="text-xs text-muted-foreground">Multi-game</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">4.1</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">RB</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Rollbit</div>
                        <div className="text-xs text-muted-foreground">Casino & Skins</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">4.0</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Table of Contents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">On this page</CardTitle>
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