import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield, Clock, CreditCard, Globe, Users, TrendingUp, Star, ChevronDown, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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
import { sampleOperators, sampleReviews } from '@/lib/sample-data';

const OperatorReview = () => {
  const [tocOpen, setTocOpen] = useState(false);
  const operator = sampleOperators[0]; // Clash.gg example
  const reviews = sampleReviews.filter(r => r.entityId === operator.id);

  const sections = [
    { id: 'trust', title: 'Is it legit? Trust & reputation', anchor: 'trust-section' },
    { id: 'services', title: 'Skins & services', anchor: 'services-section' },
    { id: 'fees', title: 'Fees & commissions', anchor: 'fees-section' },
    { id: 'payments', title: 'Payments', anchor: 'payments-section' },
    { id: 'withdrawals', title: 'Withdrawals', anchor: 'withdrawals-section' },
    { id: 'kyc', title: 'KYC & verification', anchor: 'kyc-section' },
    { id: 'bonuses', title: 'Bonuses & VIP program', anchor: 'bonuses-section' },
    { id: 'ux', title: 'UX & mobile experience', anchor: 'ux-section' },
    { id: 'support', title: 'Customer support', anchor: 'support-section' },
    { id: 'community', title: 'Community & reputation', anchor: 'community-section' },
    { id: 'conclusion', title: 'Final verdict', anchor: 'conclusion-section' },
  ];

  const scores = {
    overall: 4.3,
    trust: 4.2,
    fees: 4.0,
    ux: 4.5,
    support: 3.8,
    speed: 4.6
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/operators" className="text-muted-foreground hover:text-foreground">Operators</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{operator.name} Review</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-subtle border-b">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link to="/operators">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to operators
            </Link>
          </Button>

          {/* Main Hero Content */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: Logo & Main Info */}
            <div className="lg:col-span-3">
              <div className="flex items-start gap-6 mb-8">
                {/* Large Logo */}
                <div className="w-20 h-20 bg-white rounded-xl shadow-elevated flex items-center justify-center flex-shrink-0 border">
                  <span className="text-2xl font-bold text-primary">{operator.name.charAt(0)}</span>
                </div>
                
                {/* Title & Rating */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{operator.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{operator.verdict}</p>
                  
                  {/* Rating & Badges */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg border">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-gaming-gold text-gaming-gold" />
                        <span className="text-2xl font-bold">{operator.overallRating}</span>
                        <span className="text-muted-foreground">/5.0</span>
                      </div>
                    </div>
                    <TrustIndicator score={operator.trustScore} size="md" />
                    {operator.verified && (
                      <Badge className="bg-success text-success-foreground px-3 py-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Main CTA */}
                  <div className="flex gap-4">
                    <Button size="lg" className="bg-gradient-primary text-lg px-8 py-3 h-auto">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Visit {operator.name}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pros/USPs */}
                <Card className="border-success/20 bg-success/5">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-success flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Key Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {operator.pros.slice(0, 4).map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Important Info */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Quick Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Payout Speed</span>
                      <Badge variant="outline" className="font-semibold">{operator.payoutSpeed}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">KYC Required</span>
                      <Badge variant={operator.kycRequired ? "destructive" : "secondary"} 
                             className={!operator.kycRequired ? "bg-success/10 text-success border-success/20" : ""}>
                        {operator.kycRequired ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-2">Payment Methods</span>
                      <div className="flex gap-2 flex-wrap">
                        {operator.paymentMethods.map((method) => (
                          <Badge key={method} variant="secondary" className="capitalize">
                            {method === 'skins' && '🎯'} 
                            {method === 'crypto' && '₿'} 
                            {method === 'cards' && '💳'} 
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trust Score Highlight */}
              <Card className="text-center p-6 bg-gradient-card">
                <div className="text-4xl font-bold text-primary mb-2">{operator.trustScore}</div>
                <div className="text-muted-foreground mb-4">Trust Score</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Security</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transparency</span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community</span>
                    <span className="font-medium">Trusted</span>
                  </div>
                </div>
              </Card>

              {/* Fee Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Fee Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-2xl font-bold text-success">{operator.fees.deposit}%</div>
                      <div className="text-xs text-muted-foreground">Deposit</div>
                    </div>
                    <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                      <div className="text-2xl font-bold text-warning">{operator.fees.withdrawal}%</div>
                      <div className="text-xs text-muted-foreground">Withdrawal</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {operator.feeLevel} Fees Overall
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">On this page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.anchor}`}
                      className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                    >
                      {index + 1}. {section.title}
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Trust Section */}
            <div id="trust-section">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-success" />
                Is {operator.name} legit? Trust & reputation
              </h2>
              
              <div className="prose prose-gray max-w-none space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {operator.name} has built a solid reputation in the CS2 trading community with 
                  transparent operations and consistent payouts. Our analysis shows strong security 
                  practices and positive user feedback.
                </p>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Trust Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Security measures</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-24" />
                          <span className="text-sm font-medium">4.2/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Financial transparency</span>
                        <div className="flex items-center gap-2">
                          <Progress value={80} className="w-24" />
                          <span className="text-sm font-medium">4.0/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Community reputation</span>
                        <div className="flex items-center gap-2">
                          <Progress value={90} className="w-24" />
                          <span className="text-sm font-medium">4.5/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Regulatory compliance</span>
                        <div className="flex items-center gap-2">
                          <Progress value={75} className="w-24" />
                          <span className="text-sm font-medium">3.8/5</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                  <h4 className="font-semibold text-success mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Security highlights
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• SSL encryption for all transactions</li>
                    <li>• Two-factor authentication available</li>
                    <li>• Regular security audits</li>
                    <li>• Cold storage for user funds</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fees Section */}
            <div id="fees-section">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-primary" />
                Fees & commissions
              </h2>
              
              <div className="prose prose-gray max-w-none space-y-6">
                <p className="text-lg text-muted-foreground">
                  {operator.name} maintains competitive fee structure with transparent pricing. 
                  No hidden costs or surprise charges.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle>Fee Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-success">{operator.fees.deposit}%</div>
                          <div className="text-sm text-muted-foreground">Deposit</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-warning">{operator.fees.withdrawal}%</div>
                          <div className="text-sm text-muted-foreground">Withdrawal</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-accent">{operator.fees.trading}%</div>
                          <div className="text-sm text-muted-foreground">Trading</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <strong>Note:</strong> Fees may vary based on payment method and transaction amount. 
                        Volume discounts available for high-frequency traders.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Final Scores */}
            <div id="conclusion-section">
              <h2 className="text-3xl font-bold mb-6">Final verdict</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Overall scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Overall rating</span>
                        <RatingBadge rating={scores.overall} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trust & security</span>
                        <RatingBadge rating={scores.trust} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Fees & value</span>
                        <RatingBadge rating={scores.fees} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>User experience</span>
                        <RatingBadge rating={scores.ux} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Customer support</span>
                        <RatingBadge rating={scores.support} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payout speed</span>
                        <RatingBadge rating={scores.speed} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 p-6 bg-gradient-card rounded-lg border">
                <h3 className="font-semibold mb-3">Our recommendation</h3>
                <p className="text-muted-foreground mb-4">
                  {operator.name} offers a solid balance of security, speed, and competitive fees. 
                  While there are areas for improvement in customer support, the platform provides 
                  reliable service for CS2 skin trading with transparent operations.
                </p>
                <Button size="lg" className="bg-gradient-trust">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Visit {operator.name}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Community Reviews */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Community reviews</h2>
            <Button variant="outline">Write a review</Button>
          </div>
          
          <div className="grid gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OperatorReview;
