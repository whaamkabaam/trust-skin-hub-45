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
        <div className="container mx-auto px-4 py-3">
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
      <section className="bg-gradient-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link to="/operators">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to operators
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-card flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">{operator.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">{operator.name} Review</h1>
                  <p className="text-xl text-muted-foreground mb-4">{operator.verdict}</p>
                  <div className="flex items-center gap-4">
                    <RatingBadge rating={operator.overallRating} size="lg" showText />
                    <TrustIndicator score={operator.trustScore} size="md" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mb-8">
                <Button size="lg" className="bg-gradient-trust">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Visit {operator.name}
                </Button>
                <Button variant="outline" size="lg">
                  Read Trust Section
                </Button>
              </div>

              {/* Summary */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Why we recommend {operator.name}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-success mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {operator.pros.map((pro, i) => (
                          <li key={i} className="text-muted-foreground">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-destructive mb-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        Areas for improvement
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {operator.cons.map((con, i) => (
                          <li key={i} className="text-muted-foreground">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Table of Contents */}
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

              {/* Fast Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fast Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Deposit fees</span>
                    <span className="text-sm font-medium">{operator.fees.deposit}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Withdrawal fees</span>
                    <span className="text-sm font-medium">{operator.fees.withdrawal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trading fees</span>
                    <span className="text-sm font-medium">{operator.fees.trading}%</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Min deposit</span>
                    <span className="text-sm font-medium">$5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payout speed</span>
                    <span className="text-sm font-medium">{operator.payoutSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">KYC required</span>
                    <span className="text-sm font-medium">
                      {operator.kycRequired ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Payment methods</span>
                    <div className="flex gap-1 flex-wrap">
                      {operator.paymentMethods.map((method) => (
                        <Badge key={method} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Available modes</span>
                    <div className="flex gap-1 flex-wrap">
                      {operator.modes.map((mode) => (
                        <Badge key={mode} variant="outline" className="text-xs">
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compare Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compare with</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sampleOperators.slice(1, 3).map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold">{comp.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{comp.name}</div>
                          <RatingBadge rating={comp.overallRating} size="sm" />
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Compare</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            
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

            {/* More sections would continue here... */}

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

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* Quick CTA */}
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold mb-2">Ready to trade?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start trading CS2 skins securely
                  </p>
                  <Button className="w-full bg-gradient-trust">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit {operator.name}
                  </Button>
                </CardContent>
              </Card>

              {/* Related Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sampleOperators.slice(1, 3).map((related) => (
                    <div key={related.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">{related.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{related.name}</div>
                        <RatingBadge rating={related.overallRating} size="sm" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
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