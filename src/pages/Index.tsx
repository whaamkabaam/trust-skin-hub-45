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

const Index = () => {
  const { data, isLoading, error, isError } = usePublicOperatorsQuery({});
  const { mysteryBoxes, loading: boxesLoading } = useMysteryBoxes({});
  
  // Fallback stats for better UX and SEO
  const defaultStats = { 
    totalOperators: 50, 
    avgTrustScore: 4.2, 
    verifiedOperators: 48, 
    newThisMonth: 5 
  };
  
  const stats = data?.stats || defaultStats;
  const operators = data?.operators || [];
  const loading = isLoading;
  
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
            <p className="text-muted-foreground">Latest data scraping and statistical analysis results from our monitoring systems.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { operator: "Stake.com", status: "pass", analysis: "Payout verification", result: "95.2% verified rate", time: "2 hours ago" },
              { operator: "CSGORoll", status: "warning", analysis: "Odds discrepancy", result: "2.1% variance detected", time: "4 hours ago" },
              { operator: "BC.Game", status: "pass", analysis: "RNG analysis", result: "Provably fair confirmed", time: "6 hours ago" }
            ].map((test, index) => <Card key={index} className={`border-l-4 ${test.status === 'pass' ? 'border-l-success' : 'border-l-warning'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg"></div>
                      <div>
                        <h4 className="font-semibold">{test.operator}</h4>
                        <p className="text-sm text-muted-foreground">{test.analysis}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={test.status === 'pass' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                      {test.status === 'pass' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                      {test.status === 'pass' ? 'Verified' : 'Flagged'}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1 mb-3">
                    <p className="font-medium">{test.result}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{test.time}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      View Analysis <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
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
              operators
                .filter(op => op.categories.includes('mystery-boxes'))
                .slice(0, 3)
                .map((operator, index) => (
                  <Card key={operator.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {operator.logo ? (
                            <img 
                              src={operator.logo} 
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
                              {operator.verified && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Verified</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{operator.verdict || 'Premium case opening platform'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-medium">{operator.overallRating}</span>
                        <Badge variant="outline" className="ml-1 text-xs">Trust: {operator.trustScore}/10</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Payment Methods:</p>
                          <div className="flex gap-1">
                            {operator.paymentMethods.slice(0, 3).map((method, i) => (
                              <span key={i} className="text-lg">💳</span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                          <div className="space-y-1">
                            {operator.pros.slice(0, 3).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="w-3 h-3 text-success" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-2">
                          {operator.categories.slice(0, 3).map((category, i) => (
                            <Badge key={i} variant="outline" className="text-xs capitalize">{category.replace('-', ' ')}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link to={`/operator/${operator.slug}`}>
                            Read Review
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <a href={operator.url} target="_blank" rel="noopener noreferrer">
                            Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
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
            {[
              {
                name: "Hellcase",
                description: "Premium CS2 case opening site with verified drops",
                rating: 4.5,
                reviews: 1542,
                verified: true,
                features: ["Provably Fair", "Instant Payouts", "24/7 Support"],
                games: ["Battles", "Upgrader", "Roulette", "Crash"],
                paymentMethods: ["💳", "🅱️", "💰"]
              },
              {
                name: "CSGORoll",
                description: "Premium CS2 case opening site with verified drops",
                rating: 4.5,
                reviews: 652,
                verified: true,
                features: ["Provably Fair", "Instant Payouts", "24/7 Support"],
                games: ["Battles", "Upgrader", "Roulette", "Crash"],
                paymentMethods: ["💳", "🅱️", "💰"]
              },
              {
                name: "CSGOEmpire",
                description: "Premium CS2 case opening site with verified drops",
                rating: 4.5,
                reviews: 832,
                verified: true,
                features: ["Provably Fair", "Instant Payouts", "24/7 Support"],
                games: ["Battles", "Upgrader", "Roulette", "Crash"],
                paymentMethods: ["💳", "🅱️", "💰"]
              }
            ].map((site, index) => (
              <Card key={index} className="border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                        {site.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{site.name}</h3>
                          {site.verified && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Verified</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{site.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{site.rating}</span>
                    <Badge variant="outline" className="ml-1 text-xs">{site.reviews}</Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Accepts:</p>
                      <div className="flex gap-1">
                        {site.paymentMethods.map((method, i) => (
                          <span key={i} className="text-lg">{method}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                      <div className="space-y-1">
                        {site.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-success" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {site.games.map((game, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{game}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Read Review
                    </Button>
                    <Button size="sm" className="flex-1">
                      Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Online Casinos */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Online Casinos</h2>
              <p className="text-muted-foreground">Licensed online casinos with verified payout rates</p>
            </div>
            <Button variant="outline" size="sm">
              All Online Casinos <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Stake Casino",
                description: "Premium CS2 case opening site with verified drops",
                rating: 4.5,
                reviews: 3000,
                verified: true,
                features: ["Provably Fair", "Instant Payouts", "24/7 Support"],
                games: ["Slots", "Blackjack", "Roulette", "Crash", "Plinko"],
                paymentMethods: ["💳", "🅱️", "💰"],
                liveGames: true
              },
              {
                name: "Stake Casino",
                description: "Premium CS2 case opening site with verified drops",
                rating: 4.5,
                reviews: 3000,
                verified: true,
                features: ["Provably Fair", "Instant Payouts", "24/7 Support"],
                games: ["Slots", "Blackjack", "Roulette", "Crash", "Plinko"],
                paymentMethods: ["💳", "🅱️", "💰"],
                liveGames: true
              },
              {
                name: "Stake Casino",
                description: "Premium CS2 case opening site with verified drops",
                rating: 4.5,
                reviews: 3000,
                verified: true,
                features: ["Provably Fair", "Instant Payouts", "24/7 Support"],
                games: ["Slots", "Blackjack", "Roulette", "Crash", "Plinko"],
                paymentMethods: ["💳", "🅱️", "💰"],
                liveGames: true
              }
            ].map((site, index) => (
              <Card key={index} className="border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                        {site.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{site.name}</h3>
                          {site.verified && <Badge variant="secondary" className="bg-success/10 text-success text-xs">Verified</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{site.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{site.rating}</span>
                    <Badge variant="outline" className="ml-1 text-xs">{site.reviews}+</Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Accepts:</p>
                      <div className="flex gap-1">
                        {site.paymentMethods.map((method, i) => (
                          <span key={i} className="text-lg">{method}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                      <div className="space-y-1">
                        {site.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-success" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {site.games.map((game, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{game}</Badge>
                      ))}
                      {site.liveGames && <Badge variant="secondary" className="text-xs">Live Games</Badge>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Read Review
                    </Button>
                    <Button size="sm" className="flex-1">
                      Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  <p className="text-muted-foreground">Last 90 days: 126 complaints • 83% resolved • avg response 1.1 days</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Complaint Center <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                  <Button size="sm">Submit Report</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">126</div>
                  <div className="text-sm text-muted-foreground">Total Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">83%</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1.1</div>
                  <div className="text-sm text-muted-foreground">Avg Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">21</div>
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
                  <h3 className="text-lg font-semibold">High-Risk Operators - Avoid These Sites</h3>
                  <p className="text-sm text-muted-foreground">Sites with active warnings based on our analysis and user reports</p>
                </div>
              </div>
              <div className="space-y-3">
                {[{
                name: "SuspiciousSite.com",
                reason: "Multiple non-payment reports (14 days), statistical anomalies detected"
              }, {
                name: "RiggedOdds.net", 
                reason: "RNG manipulation detected, advertised odds don't match actual payouts"
              }, {
                name: "FakeOperator.gg",
                reason: "No valid license, ToS violations, disappeared after complaints"
              }].map((site, index) => <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div>
                      <span className="font-medium text-destructive">{site.name}</span>
                      <p className="text-sm text-muted-foreground">{site.reason}</p>
                    </div>
                    <Button variant="ghost" size="sm">Full Report</Button>
                  </div>)}
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