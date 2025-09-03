import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield, Clock, CreditCard, Globe, Users, TrendingUp, Star, ChevronDown, CheckCircle, XCircle, AlertTriangle, Copy, Gamepad2, DollarSign, HelpCircle, FileText, MessageCircle, Eye, Zap, Truck, Phone, Award, Info, Check, X } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState('');
  const [isNavVisible, setIsNavVisible] = useState(false);

  const operator = sampleOperators[0]; // Clash.gg example
  const reviews = sampleReviews.filter(r => r.entityId === operator.id);

  const sections = [
    { id: 'scorecard', title: 'Scorecard', anchor: 'scorecard-section' },
    { id: 'catalog', title: 'Case Catalog', anchor: 'catalog-section' },
    { id: 'fairness', title: 'Fairness & Security', anchor: 'fairness-section' },
    { id: 'payouts', title: 'Payouts & Cashout', anchor: 'payouts-section' },
    { id: 'bonuses', title: 'Bonuses & VIP', anchor: 'bonuses-section' },
    { id: 'payments', title: 'Payments & KYC', anchor: 'payments-section' },
    { id: 'tests', title: 'Our Tests', anchor: 'tests-section' },
    { id: 'reviews', title: 'User Reviews', anchor: 'reviews-section' },
    { id: 'verdict', title: 'Verdict', anchor: 'verdict-section' }
  ];

  // Scroll spy for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('-section', '');
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' }
    );

    const heroObserver = new IntersectionObserver(
      (entries) => {
        setIsNavVisible(!entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.anchor);
      if (element) observer.observe(element);
    });

    const heroElement = document.querySelector('.hero-section');
    if (heroElement) heroObserver.observe(heroElement);

    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, [sections]);

  const scores = {
    overall: 4.3,
    user: 3.7,
    fairness: 4.5,
    cashout: 4.1,
    authenticity: 4.7,
    payments: 4.0,
    support: 3.8
  };

  const gameModesData = [
    { name: 'Case Opening', available: true, scored: true },
    { name: 'Upgrader', available: true, scored: false },
    { name: 'Battles', available: false, scored: false },
    { name: 'Contracts', available: true, scored: false }
  ];

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

  const faqItems = [
    {
      q: `Is ${operator.name} legit?`,
      a: `Yes, ${operator.name} is a legitimate platform with proper security measures and verified payouts.`
    },
    {
      q: "How do payouts work?",
      a: "Payouts are processed within 24-48 hours via Steam trade or direct shipping for physical items."
    },
    {
      q: "What are the fees and limits?",
      a: "Deposit fees start at 0%, withdrawal fees vary by method. Minimum deposit is $10."
    }
  ];

  const screenshots = [
    { id: 1, url: "/placeholder.svg", alt: "Clash.gg mobile homepage" },
    { id: 2, url: "/placeholder.svg", alt: "Case opening interface" },
    { id: 3, url: "/placeholder.svg", alt: "User dashboard" },
    { id: 4, url: "/placeholder.svg", alt: "Payment methods" },
    { id: 5, url: "/placeholder.svg", alt: "Game lobby" },
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
            <span className="font-semibold text-sm">{operator.name}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-gaming-gold text-gaming-gold" />
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
      <section className="hero-section bg-gradient-hero border-b">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-6 mb-8">
              {/* Left - Title + Domain */}
              <div className="col-span-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center flex-shrink-0 border">
                    <span className="text-xl font-bold text-primary">{operator.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{operator.name}</h1>
                    <div className="text-sm text-muted-foreground mb-2">{operator.url?.replace('https://', '')}</div>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Last verified: Dec 2024
                    </Badge>
                    <div className="flex items-center gap-2 mt-2">
                      {operator.verified && (
                        <Badge variant="secondary" className="bg-success/10 text-success-foreground border-success/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/20">
                        <Info className="w-3 h-3 mr-1" />
                        Sponsored
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Score + Mini Bars */}
              <div className="col-span-4 flex flex-col items-center justify-center">
                <div className="bg-card rounded-2xl p-6 shadow-card border w-full text-center">
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {scores.overall}
                  </div>
                  <div className="text-muted-foreground mb-4">Overall Score</div>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Fairness', value: scores.fairness, icon: Shield },
                      { label: 'Cashout', value: scores.cashout, icon: DollarSign },
                      { label: 'Support', value: scores.support, icon: Phone }
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[2rem]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Primary CTA */}
              <div className="col-span-4">
                <Card className="bg-gradient-card border-primary/20 h-full">
                  <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                    <div className="mb-4">
                      <div className="text-2xl font-bold mb-1">Free $10 + 3 Cases</div>
                      <div className="text-sm text-muted-foreground">Welcome Bonus</div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-background/50 rounded-xl border border-dashed mb-4">
                      <code className="flex-1 text-center font-mono text-sm">{promoCode}</code>
                      <Button size="sm" variant="ghost" onClick={copyPromoCode}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button size="lg" className="w-full mb-3" asChild>
                      <a href={operator.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                      </a>
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      18+ only. Terms apply. Gamble responsibly.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Secondary Row - Mode Chips */}
            <div className="bg-card rounded-2xl p-4 shadow-subtle border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Available Game Modes</h3>
                <Badge variant="outline" className="text-xs">
                  <Info className="w-3 h-3 mr-1" />
                  Only Case Opening is scored
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                {gameModesData.map((mode) => (
                  <div 
                    key={mode.name}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      mode.available 
                        ? 'bg-success/5 border-success/20 text-success-foreground'
                        : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    {mode.available ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{mode.name}</span>
                    {mode.scored && (
                      <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                        Scored
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <Card className="mb-4 bg-card shadow-card rounded-2xl">
              <CardContent className="p-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-card rounded-2xl shadow-card mx-auto mb-4 flex items-center justify-center border">
                    <span className="text-xl font-bold text-primary">{operator.name.charAt(0)}</span>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{operator.name}</h1>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {operator.verified && (
                      <Badge variant="secondary" className="bg-success/10 text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="outline">{siteType}</Badge>
                  </div>
                  
                  {/* Score Display */}
                  <div className="bg-gradient-card p-4 rounded-xl border">
                    <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {scores.overall}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <a href={operator.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Site
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sticky Section Navigation */}
      <div className={`sticky top-16 md:top-0 z-30 bg-background/95 backdrop-blur-sm border-b transition-all duration-300 ${
        isNavVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap flex-shrink-0"
                onClick={() => {
                  document.getElementById(section.anchor)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {section.title}
              </Button>
            ))}
          </div>
          {/* Progress indicator */}
          <div className="w-full bg-muted h-0.5 mt-2">
            <div 
              className="bg-primary h-0.5 transition-all duration-300"
              style={{ 
                width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Scorecard Section */}
      <section id="scorecard-section" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Performance Scorecard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive analysis covers all critical aspects of {operator.name}'s service quality and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                label: 'Fairness & EV', 
                value: scores.fairness, 
                icon: Shield, 
                description: 'Provably fair algorithms and expected value analysis',
                color: 'text-trust-high'
              },
              { 
                label: 'Cashout & Liquidity', 
                value: scores.cashout, 
                icon: DollarSign, 
                description: 'Withdrawal speed and payment reliability',
                color: 'text-gaming-gold'
              },
              { 
                label: 'Authenticity', 
                value: scores.authenticity, 
                icon: Award, 
                description: 'Item verification and guarantee policies',
                color: 'text-gaming-blue'
              },
              { 
                label: 'Payment Methods', 
                value: scores.payments, 
                icon: CreditCard, 
                description: 'Deposit options and processing times',
                color: 'text-accent'
              },
              { 
                label: 'Support & KYC', 
                value: scores.support, 
                icon: Phone, 
                description: 'Customer service quality and verification process',
                color: 'text-secondary'
              },
              { 
                label: 'User Experience', 
                value: 4.2, 
                icon: Eye, 
                description: 'Platform usability and interface design',
                color: 'text-primary'
              }
            ].map(({ label, value, icon: Icon, description, color }) => (
              <Card key={label} className="bg-card border shadow-subtle rounded-2xl hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-muted/50 ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{label}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{description}</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-lg min-w-[3rem]">{value}/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Catalog Section */}
      <section id="catalog-section" className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Case Catalog Analysis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Detailed breakdown of available cases, their expected values, and tier distributions.
            </p>
          </div>

          <Card className="bg-card rounded-2xl shadow-card border overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Featured Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4">Case Name</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Expected Value</th>
                      <th className="text-left p-4">Tier Distribution</th>
                      <th className="text-left p-4">Valuation Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Karambit Case', price: '$50.00', ev: '$47.50', tier: 'High', source: 'Steam Market' },
                      { name: 'AK-47 Case', price: '$25.00', ev: '$23.75', tier: 'Medium', source: 'BUFF163' },
                      { name: 'Glove Case', price: '$100.00', ev: '$95.00', tier: 'Premium', source: 'CS.MONEY' }
                    ].map((item, i) => (
                      <tr key={i} className="border-t hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.price}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.ev}</span>
                            <div className="w-12 h-2 bg-muted rounded-full">
                              <div className="w-10 h-2 bg-primary rounded-full"></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={
                            item.tier === 'Premium' ? 'border-gaming-gold text-gaming-gold' :
                            item.tier === 'High' ? 'border-gaming-blue text-gaming-blue' :
                            'border-gaming-orange text-gaming-orange'
                          }>
                            {item.tier}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-xs">
                            {item.source}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fairness & Security Section */}
      <section id="fairness-section" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fairness & Security</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparency, provably fair mechanisms, and security measures to protect users.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Provably Fair Card */}
            <Card className="bg-card rounded-2xl shadow-card border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  Provably Fair System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-xl">
                  <label className="text-sm font-medium text-muted-foreground">Server Seed (Hashed)</label>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 p-2 bg-background rounded font-mono text-xs break-all">
                      a7b8c9d0e1f2...
                    </code>
                    <Button size="sm" variant="ghost">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client Seed</label>
                    <div className="mt-1 p-2 bg-muted/50 rounded text-sm font-mono">user123</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nonce</label>
                    <div className="mt-1 p-2 bg-muted/50 rounded text-sm font-mono">847</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">Rotation: Every 100 cases</span>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Verify Results
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Authenticity Card */}
            <Card className="bg-card rounded-2xl shadow-card border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gaming-blue" />
                  Item Authenticity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    'Authenticity guarantee on all items',
                    'Serial number & invoice proof',
                    'Warranty pass-through protection'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-warning-foreground">Value Inflation Risk</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Retail values may be inflated. See our methodology for item valuation.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Reviews Section */}
      <section id="reviews-section" className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">User Reviews & Ratings</h2>
            <p className="text-muted-foreground">
              Real feedback from {userRatings.total.toLocaleString()} verified users
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Rating Distribution */}
            <Card className="bg-card rounded-2xl shadow-card border">
              <CardHeader>
                <CardTitle className="text-center">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{scores.user}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(scores.user) ? 'fill-gaming-gold text-gaming-gold' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">{userRatings.total.toLocaleString()} reviews</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {Object.entries(userRatings.breakdown).reverse().map(([stars, percentage]) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm w-8">{stars}★</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm w-8 text-muted-foreground">{percentage}%</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View All Reviews
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.slice(0, 3).map((review, i) => (
                <Card key={i} className="bg-card rounded-2xl shadow-subtle border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Anonymous User</span>
                          <Badge variant="outline" className="text-xs bg-success/10 text-success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-gaming-gold text-gaming-gold' : 'text-muted-foreground'}`} />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">Dec 2024</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Great platform with fair odds and quick payouts. Highly recommend for case opening enthusiasts.
                        </p>
                        
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                            <CheckCircle className="w-4 h-4" />
                            Helpful (12)
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                            <MessageCircle className="w-4 h-4" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verdict Section */}
      <section id="verdict-section" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-card rounded-2xl shadow-elevated border max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Our Verdict</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-12 h-12 text-success mb-3" />
                  <h3 className="font-semibold mb-2">Reliable Platform</h3>
                  <p className="text-sm text-muted-foreground">Consistent payouts and fair gameplay</p>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-12 h-12 text-gaming-blue mb-3" />
                  <h3 className="font-semibold mb-2">Provably Fair</h3>
                  <p className="text-sm text-muted-foreground">Transparent verification system</p>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-12 h-12 text-gaming-gold mb-3" />
                  <h3 className="font-semibold mb-2">Great Value</h3>
                  <p className="text-sm text-muted-foreground">Competitive expected values</p>
                </div>
              </div>

              <div className="bg-card/50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-3">Summary</h3>
                <p className="text-muted-foreground">
                  {operator.name} offers a solid case opening experience with transparent odds, reliable payouts, 
                  and good customer support. While not perfect, it's a trustworthy choice for CS:GO case enthusiasts.
                </p>
              </div>

              <Button size="lg" asChild>
                <a href={operator.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Try {operator.name} Now
                </a>
              </Button>

              <div className="text-xs text-muted-foreground mt-4">
                Disclosure: This review may contain affiliate links. 
                <Link to="/methodology" className="underline ml-1">View our methodology</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OperatorReview;