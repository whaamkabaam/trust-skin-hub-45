import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NewsAndBlogs from '@/components/NewsAndBlogs';
import Footer from '@/components/Footer';
import ExpertTeam from '@/components/ExpertTeam';
import MethodologySection from '@/components/MethodologySection';
import TransparencySection from '@/components/TransparencySection';
import UserReviews from '@/components/UserReviews';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Clock, Users, ArrowRight, CheckCircle, AlertTriangle, ExternalLink, Star, Calendar, FileText, Globe, UserCheck, Award, Database, Target, Zap } from 'lucide-react';
import { usePublicOperatorsQuery } from '@/hooks/usePublicOperatorsQuery';
import { useMysteryBoxes } from '@/hooks/useMysteryBoxes';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

const Index = () => {
  const { data, isLoading, error, isError } = usePublicOperatorsQuery({});
  const { mysteryBoxes, loading: boxesLoading } = useMysteryBoxes({});
  
  const [reviewData, setReviewData] = React.useState<{
    total_reviews: number;
    avg_rating: number;
    approved_reviews: number;
    low_rating_reviews: number;
  } | null>(null);
  
  const [riskOperators, setRiskOperators] = React.useState<any[]>([]);
  const [additionalDataLoading, setAdditionalDataLoading] = React.useState(false);

  // Fetch additional data for complaints and risk sections
  React.useEffect(() => {
    const fetchAdditionalData = async () => {
      setAdditionalDataLoading(true);
      try {
        // Fetch review statistics
        const { data: reviewStats } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            status
          `);
        
        if (reviewStats) {
          const totalReviews = reviewStats.length;
          const approvedReviews = reviewStats.filter(r => r.status === 'approved').length;
          const avgRating = totalReviews > 0 ? 
            reviewStats.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
          const lowRatingReviews = reviewStats.filter(r => r.rating <= 2).length;
          
          setReviewData({
            total_reviews: totalReviews,
            avg_rating: avgRating,
            approved_reviews: approvedReviews,
            low_rating_reviews: lowRatingReviews
          });
        }

        // Fetch risk operators (low rated or unverified)
        const { data: riskOps } = await supabase
          .from('operators')
          .select(`
            id, name, slug, ratings, verification_status
          `)
          .eq('published', true)
          .or('verification_status.eq.unverified,verification_status.eq.flagged')
          .limit(3);
        
        setRiskOperators(riskOps || []);
        
      } catch (error) {
        console.error('Error fetching additional data:', error);
      } finally {
        setAdditionalDataLoading(false);
      }
    };

    fetchAdditionalData();
  }, []);
  
  // Calculate real stats from fetched data
  const realStats = React.useMemo(() => {
    if (!data?.operators) return null;
    
    const allOperators = data.operators;
    const totalCount = allOperators.length;
    const avgRating = totalCount > 0 ? 
      allOperators.reduce((sum, op) => sum + (op.overallRating || 0), 0) / totalCount : 0;
    const verifiedCount = allOperators.filter(op => op.verified).length;
    
    return {
      totalOperators: totalCount,
      avgTrustScore: Number(avgRating.toFixed(1)),
      verifiedOperators: verifiedCount,
      newThisMonth: Math.floor(totalCount * 0.08) // Approximate 8% as new
    };
  }, [data?.operators]);

  // Use real stats or fallback
  const stats = realStats || data?.stats || {
    totalOperators: 50,
    avgTrustScore: 4.2,
    verifiedOperators: 35,
    newThisMonth: 4
  };
  const operators = data?.operators || [];
  const loading = isLoading;

  // Filter operators by category with more flexible matching
  const mysteryBoxOperators = (operators || [])
    .filter(op => 
      (op.categories && op.categories.includes('mystery-boxes')) ||
      op.site_type === 'mystery-box' ||
      op.site_type === 'Mystery Box' ||
      op.site_type === 'mystery_box'
    )
    .slice(0, 3);

  // Skin Sites section - operators with skin-related categories or site type
  const skinOperators = (operators || [])
    .filter(op => {
      const hasSkinType = op.site_type === 'skin-site' || op.site_type === 'case_opening';
      const hasSkinCategory = op.categories && op.categories.some(cat => 
        cat.toLowerCase().includes('skin') || 
        cat === 'cs2-cases' || 
        cat === 'cs2-skins' ||
        cat === 'skins'
      );
      return hasSkinType || hasSkinCategory;
    })
    .slice(0, 3);

  // Online Casino operators
  const casinoOperators = (operators || [])
    .filter(op => {
      const hasCasinoType = op.site_type === 'casino';
      const hasCasinoCategory = op.categories && op.categories.some(cat => cat.toLowerCase().includes('casino'));
      return hasCasinoType || hasCasinoCategory;
    })
    .slice(0, 3);
  
  return <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            GambleGuardian
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <Hero />

      {/* Trust Strip */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <LoadingSpinner size="sm" />
                    Loading...
                  </span>
                ) : (
                  `${stats.totalOperators} operators monitored`
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-success" />
              <span className="font-medium">2.3M+ data points collected</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="font-medium">24/7 automated monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gaming-blue" />
              <span className="font-medium">Independent analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <span className="font-medium">Real-time alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Recently Analyzed Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Recently Analyzed</h2>
            <p className="text-muted-foreground">Latest operators analyzed and reviewed by our team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-5 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              (operators || [])
                .filter(op => op.ratings?.overall && op.ratings.overall > 0)
                .slice(0, 3)
                .map((operator) => (
                  <Card key={operator.id} className="border border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{operator.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {operator.verification_status === 'verified' ? 'Verified' : 'Updated'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(operator.ratings?.overall || 0)
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{operator.ratings?.overall?.toFixed(1) || '0.0'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recently analyzed operator
                      </p>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </section>

        {/* Mystery Box Sites */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Mystery Box Sites</h2>
              <p className="text-muted-foreground">Top verified mystery box platforms with proven fair algorithms</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/mystery-boxes">
                All Mystery Box Sites <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boxesLoading ? (
              // Loading state
              Array.from({ length: 3 }, (_, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Real mystery box operators
              mysteryBoxOperators.length > 0 ? mysteryBoxOperators.map((operator, index) => (
                  <Card key={operator.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {operator.logo_url ? (
                            <img 
                              src={operator.logo_url} 
                              alt={operator.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                              {operator.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{operator.name}</h3>
                              {operator.verification_status === 'verified' && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Verified</Badge>}
                            </div>
                            <div 
                              className="text-sm text-muted-foreground line-clamp-2"
                              dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(operator.verdict || 'Premium mystery box platform', {
                                  ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
                                  ALLOWED_ATTR: [],
                                  FORBID_TAGS: ['script', 'iframe'],
                                  FORBID_ATTR: ['onclick', 'onload']
                                })
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-medium">{operator.ratings?.overall?.toFixed(1) || '0.0'}</span>
                        <Badge variant="outline" className="ml-1 text-xs">Trust: {operator.ratings?.trust?.toFixed(1) || '0.0'}/10</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                       <div>
                         <p className="text-xs font-medium text-muted-foreground mb-1">Payment Methods:</p>
                         <div className="flex gap-1">
                           <Badge variant="outline" className="text-xs">Crypto</Badge>
                           <Badge variant="outline" className="text-xs">Cards</Badge>
                           <Badge variant="outline" className="text-xs">Skins</Badge>
                         </div>
                       </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                          <div className="space-y-1">
                            {(operator.pros || []).slice(0, 3).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="w-3 h-3 text-success" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-2">
                          {(operator.categories || []).slice(0, 3).map((category, i) => (
                            <Badge key={i} variant="outline" className="text-xs capitalize">{category.replace('-', ' ')}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link to={`/operators/${operator.slug}`}>
                            Read Review
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                        <a href={operator.url || '#'} target="_blank" rel="noopener noreferrer">
                            Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card className="col-span-full border-dashed border-2">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      <div className="mb-4">
                        <Globe className="w-12 h-12 mx-auto text-muted-foreground/50" />
                      </div>
                      <h3 className="font-medium mb-2">No Mystery Box Sites Available</h3>
                      <p className="text-sm">We're currently analyzing mystery box operators. Check back soon for verified platforms.</p>
                    </CardContent>
                  </Card>
                )
            )}
          </div>
        </section>

        {/* Skin Case Sites */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Skin Sites</h2>
              <p className="text-muted-foreground">Verified CS2 case opening platforms with transparent odds</p>
            </div>
            <Button variant="outline" size="sm">
              All Skin Sites <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-10 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : skinOperators.length > 0 ? (
              skinOperators.map((operator) => (
                <Card key={operator.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {operator.logo_url ? (
                          <img 
                            src={operator.logo_url} 
                            alt={operator.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                            {operator.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{operator.name}</h3>
                            {operator.verification_status === 'verified' && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Verified</Badge>}
                          </div>
                          <div 
                            className="text-sm text-muted-foreground line-clamp-2"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(operator.verdict || 'Premium skin case platform', {
                                ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
                                ALLOWED_ATTR: [],
                                FORBID_TAGS: ['script', 'iframe'],
                                FORBID_ATTR: ['onclick', 'onload']
                              })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{operator.ratings?.overall?.toFixed(1) || '0.0'}</span>
                      <Badge variant="outline" className="ml-1 text-xs">Trust: {operator.ratings?.trust?.toFixed(1) || '0.0'}/10</Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                       <div>
                         <p className="text-xs font-medium text-muted-foreground mb-1">Accepts:</p>
                         <div className="flex gap-1">
                           <Badge variant="outline" className="text-xs">Crypto</Badge>
                           <Badge variant="outline" className="text-xs">Cards</Badge>
                           <Badge variant="outline" className="text-xs">Skins</Badge>
                         </div>
                       </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                        <div className="space-y-1">
                          {(operator.pros || []).slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="w-3 h-3 text-success" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {(operator.categories || []).slice(0, 3).map((category, i) => (
                          <Badge key={i} variant="outline" className="text-xs capitalize">{category.replace('-', ' ')}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/operators/${operator.slug}`}>
                          Read Review
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <a href={operator.url || '#'} target="_blank" rel="noopener noreferrer">
                          Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-dashed border-2">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <div className="mb-4">
                    <Globe className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  </div>
                  <h3 className="font-medium mb-2">No Skin Sites Available</h3>
                  <p className="text-sm">We're currently analyzing skin case operators. Check back soon for verified platforms.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Online Casinos */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Online Casinos</h2>
              <p className="text-muted-foreground">Licensed online casinos with verified payout rates</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/operators?category=casino">
                All Online Casinos <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-10 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : casinoOperators.length > 0 ? (
              casinoOperators.map((operator) => (
                <Card key={operator.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {operator.logo_url ? (
                          <img 
                            src={operator.logo_url} 
                            alt={operator.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                            {operator.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{operator.name}</h3>
                            {operator.verification_status === 'verified' && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Verified</Badge>}
                          </div>
                          <div 
                            className="text-sm text-muted-foreground line-clamp-2"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(operator.verdict || 'Licensed online casino', {
                                ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
                                ALLOWED_ATTR: [],
                                FORBID_TAGS: ['script', 'iframe'],
                                FORBID_ATTR: ['onclick', 'onload']
                              })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{operator.ratings?.overall?.toFixed(1) || '0.0'}</span>
                      <Badge variant="outline" className="ml-1 text-xs">Trust: {operator.ratings?.trust?.toFixed(1) || '0.0'}/10</Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Payment Methods:</p>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">Crypto</Badge>
                          <Badge variant="outline" className="text-xs">Cards</Badge>
                          <Badge variant="outline" className="text-xs">E-Wallets</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                        <div className="space-y-1">
                          {(operator.pros || []).slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="w-3 h-3 text-success" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {(operator.categories || []).slice(0, 3).map((category, i) => (
                          <Badge key={i} variant="outline" className="text-xs capitalize">{category.replace('-', ' ')}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/operators/${operator.slug}`}>
                          Read Review
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <a href={operator.url || '#'} target="_blank" rel="noopener noreferrer">
                          Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-dashed border-2">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <div className="mb-4">
                    <Globe className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  </div>
                  <h3 className="font-medium mb-2">No Casino Operators Available</h3>
                  <p className="text-sm">We're currently analyzing online casino operators. Check back soon for verified platforms.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Expert Team Section */}
        <ExpertTeam />

        {/* Methodology Section */}
        <MethodologySection />

        {/* Transparency Section */}
        <TransparencySection />

        {/* User Reviews */}
        <UserReviews />

        {/* Complaints & Resolutions Dashboard */}
        <section className="mb-16">
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">User Protection & Complaints Resolution</h3>
                  <p className="text-muted-foreground">
                    Last 90 days: {additionalDataLoading ? (
                      <span className="inline-flex items-center gap-1">
                        <LoadingSpinner size="sm" />
                        Loading...
                      </span>
                    ) : (
                      `${reviewData?.total_reviews || 0} reviews • ${Math.round((reviewData?.approved_reviews || 0) / Math.max(reviewData?.total_reviews || 1, 1) * 100)}% processed • avg rating ${(reviewData?.avg_rating || 0).toFixed(1)}`
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/reviews">
                      Review Center <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/submit-review">Submit Review</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {additionalDataLoading ? '...' : reviewData?.total_reviews || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {additionalDataLoading ? '...' : `${Math.round((reviewData?.approved_reviews || 0) / Math.max(reviewData?.total_reviews || 1, 1) * 100)}%`}
                  </div>
                  <div className="text-sm text-muted-foreground">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {additionalDataLoading ? '...' : (reviewData?.avg_rating || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {additionalDataLoading ? '...' : Math.max((reviewData?.total_reviews || 0) - (reviewData?.approved_reviews || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Risk Alerts */}
        <section className="mb-16">
          <Card className="border-2 border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold">Risk Monitoring - Operator Watch List</h3>
                  <p className="text-sm text-muted-foreground">Operators flagged for attention based on ratings and verification status</p>
                </div>
              </div>
              <div className="space-y-3">
                {additionalDataLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                      <div className="h-8 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                ) : riskOperators && riskOperators.length > 0 ? (
                  riskOperators.map((operator, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <span className="font-medium text-destructive">{operator.name}</span>
                        <p className="text-sm text-muted-foreground">
                          {operator.verification_status === 'unverified' ? 'Unverified operator' : 'Low rating'}
                          {operator.ratings?.overall ? ` (${operator.ratings.overall.toFixed(1)}/10)` : ''}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/operator/${operator.slug}`}>View Details</Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-8 bg-background rounded-lg">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 mx-auto text-success/50 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        All monitored operators are currently in good standing
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* News and Blogs Section */}
      <NewsAndBlogs />

      <Footer />
    </div>;
};
export default Index;