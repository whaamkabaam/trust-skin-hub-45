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
                    <div className="grid grid-cols-2 gap-4 text-sm">
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
                        <span className="ml-2 font-medium">{siteType === 'Case Site' ? 'Skins' : 'Physical | Skins'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Provably Fair:</span>
                        <span className="ml-2 font-medium text-green-600">Yes</span>
                      </div>
                      <div>
                        <Badge variant="outline" className="px-3 py-2">
                          18+ / Play Responsibly
                        </Badge>
                      </div>
                    </div>
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
                  <Badge variant="outline" className="flex items-center px-2">
                    18+
                  </Badge>
                </div>

                <Collapsible open={keyFactsOpen} onOpenChange={setKeyFactsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                    Key Facts
                    <ChevronDown className={`w-4 h-4 transition-transform ${keyFactsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-3 text-sm">
                    <div>• Launched 2020</div>
                    <div>• Payments: Visa, BTC, ETH</div>
                    <div>• Payout: {siteType === 'Case Site' ? 'Skins' : 'Physical | Skins'}</div>
                    <div>• Provably Fair: Yes</div>
                    <div>• KYC: {operator.kycRequired ? 'Required' : 'Not Required'}</div>
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
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 justify-center max-w-4xl mx-auto">
              <div className="flex justify-center">
                <Badge variant="secondary" className="w-full flex flex-col items-center justify-center py-3 bg-muted border min-h-[60px]">
                  <span className="text-xs text-muted-foreground mb-1">Trust:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">4.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge variant="secondary" className="w-full flex flex-col items-center justify-center py-3 bg-muted border min-h-[60px]">
                  <span className="text-xs text-muted-foreground mb-1">Value:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">4.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge variant="secondary" className="w-full flex flex-col items-center justify-center py-3 bg-muted border min-h-[60px]">
                  <span className="text-xs text-muted-foreground mb-1">Payments:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">3.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge variant="secondary" className="w-full flex flex-col items-center justify-center py-3 bg-muted border min-h-[60px]">
                  <span className="text-xs text-muted-foreground mb-1">Offering:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">4.0/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge variant="secondary" className="w-full flex flex-col items-center justify-center py-3 bg-muted border min-h-[60px]">
                  <span className="text-xs text-muted-foreground mb-1">UX & Tools:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">4.5/5</span>
                  </div>
                </Badge>
              </div>
              <div className="flex justify-center">
                <Badge variant="secondary" className="w-full flex flex-col items-center justify-center py-3 bg-muted border min-h-[60px]">
                  <span className="text-xs text-muted-foreground mb-1">Support:</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
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
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-700 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      PROS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {operator.pros.map((pro, i) => <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600 font-bold mt-0.5">+</span>
                          <span>{pro}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-700 flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      CONS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {operator.cons.map((con, i) => <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-red-600 font-bold mt-0.5">–</span>
                          <span>{con}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* What is [Site]? */}
            <div id="what-is-section">
              <h2 className="text-2xl font-bold mb-4">What is {operator.name}?</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  {operator.name} is a popular {siteType.toLowerCase()} platform that offers various gaming modes 
                  including case openings, skin upgrades, and jackpot games. Launched in 2020, it has built a strong 
                  reputation for fair gameplay and reliable payouts.
                </p>
              </div>
            </div>

            {/* Games & Modes */}
            <div id="games-modes-section">
              <h2 className="text-2xl font-bold mb-4">Games & Modes</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Solo Unbox', 'Battles', 'Upgrade', 'Jackpot', 'Wheel'].map(mode => <Badge key={mode} variant="outline" className="px-3 py-1">
                      {mode}
                    </Badge>)}
                </div>
                <div className="prose prose-gray max-w-none">
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Solo Unbox:</strong> Open cases individually with guaranteed drops</li>
                    <li><strong>Battles:</strong> Compete against other players in case opening duels</li>
                    <li><strong>Upgrade:</strong> Trade lower-value skins for higher-value ones</li>
                    <li><strong>Jackpot:</strong> Pool-based games with rotating prizes</li>
                    <li><strong>Wheel:</strong> Spin-to-win games with various multipliers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prizes & Payouts */}
            <div id="prizes-payouts-section">
              <h2 className="text-2xl font-bold mb-4">Prizes & Payouts</h2>
              <div className="space-y-4">
                {siteType === 'Case Site' ? <Card>
                    <CardHeader>
                      <CardTitle>Case Site Payouts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>• <strong>Skins Inventory:</strong> All won skins go to your account inventory</div>
                      <div>• <strong>Steam Trade Flow:</strong> Withdraw skins directly to Steam via trade bot</div>
                      <div>• <strong>P2P/Market Cashout:</strong> Sell skins on integrated marketplace</div>
                    </CardContent>
                  </Card> : <Card>
                    <CardHeader>
                      <CardTitle>Mystery Box Payouts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>• <strong>Prize Types:</strong> Electronics, gaming gear, collectibles, gift cards</div>
                      <div>• <strong>Ship/Claim Flow:</strong> Physical items shipped worldwide within 7-14 days</div>
                      <div>• <strong>Swap for Credits:</strong> Convert physical prizes to platform credits</div>
                    </CardContent>
                  </Card>}
              </div>
            </div>

            {/* Payments */}
            <div id="payments-section">
              <h2 className="text-2xl font-bold mb-4">Payments</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Deposit Methods & Limits</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Credit/Debit Cards (Visa, Mastercard): $10 - $5,000</li>
                        <li>• Bitcoin (BTC): $25 - $10,000</li>
                        <li>• Ethereum (ETH): $25 - $10,000</li>
                        <li>• Skins: Variable based on market value</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Withdrawal Timeframes & Fees</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Skins: Instant - 24 hours, 0% fee</li>
                        <li>• Cryptocurrency: 1-6 hours, 1-3% fee</li>
                        <li>• Physical items: 7-14 days shipping, $5-15 fee</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bonuses & Promos */}
            <div id="bonuses-promos-section">
              <h2 className="text-2xl font-bold mb-4">Bonuses & Promos</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Welcome Bonus</h4>
                      <p className="text-sm text-muted-foreground">Free $10 credit + 3 free cases</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Rakeback</h4>
                      <p className="text-sm text-muted-foreground">Up to 15% daily rakeback on losses</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Daily/Weekly</h4>
                      <p className="text-sm text-muted-foreground">Daily free case + weekly challenges</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Referral</h4>
                      <p className="text-sm text-muted-foreground">5% of friend's deposits for life</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Fairness & Security */}
            <div id="fairness-security-section">
              <h2 className="text-2xl font-bold mb-4">Fairness & Security</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-600" />
                        Provably Fair System
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        All games use cryptographic hashing to ensure fairness. Players can verify each outcome 
                        using the provided seeds and algorithms. Drop rates are transparently displayed.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Drop Rates Transparency</h4>
                      <p className="text-sm text-muted-foreground">
                        All case and game odds are clearly displayed. Rare item chances range from 0.1% to 15% 
                        depending on the case type.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">KYC/AML & Licensing</h4>
                      <p className="text-sm text-muted-foreground">
                        {operator.kycRequired ? 'KYC verification required for withdrawals over $1,000.' : 'No KYC required for most transactions.'} 
                        Platform operates under Curacao gaming license #8048/JAZ.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* UX & Support */}
            <div id="ux-support-section">
              <h2 className="text-2xl font-bold mb-4">UX & Support</h2>
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
              <h2 className="text-2xl font-bold mb-4">Verdict</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Excellent game variety with fair odds and transparent operations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Fast payouts and multiple withdrawal options including skins and crypto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Strong community presence and responsive customer support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mobile-friendly platform with intuitive user interface</span>
                    </li>
                  </ul>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Who it's for / not for</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-green-600 font-medium">✓ Good for:</span>
                        <span className="text-blue-800"> Casual gamers, skin traders, bonus hunters</span>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">✗ Not for:</span>
                        <span className="text-blue-800"> High-stakes players, users wanting anonymity</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">{scores.overall}/5.0</div>
                    <div className="text-muted-foreground">Final Score</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Reviews & Ratings */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">User Reviews & Ratings</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{scores.user}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(scores.user) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />)}
                        </div>
                        <div className="text-sm text-muted-foreground">({userRatings.total})</div>
                      </div>
                      <div className="space-y-2 flex-1">
                        {Object.entries(userRatings.breakdown).reverse().map(([stars, percentage]) => <div key={stars} className="flex items-center gap-2 text-sm">
                            <span className="w-8">{stars}★</span>
                            <Progress value={percentage} className="flex-1" />
                            <span className="w-10 text-muted-foreground">{percentage}%</span>
                          </div>)}
                      </div>
                    </div>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map(review => <ReviewCard key={review.id} review={review} />)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
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

            {/* Related Sites / Comparisons */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Related Sites</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sampleOperators.slice(1, 3).map(relatedOp => <Card key={relatedOp.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded border flex items-center justify-center">
                          <span className="font-bold text-sm">{relatedOp.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{relatedOp.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{relatedOp.overallRating}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to={`/operators/${relatedOp.id}/review`}>
                          Compare Review
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>)}
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