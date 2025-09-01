import { useState } from 'react';
import { Star, TrendingUp, Shield, Clock, Users, Filter, Search, ExternalLink, AlertTriangle, CheckCircle, Award, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RatingBadge from '@/components/RatingBadge';
import TrustIndicator from '@/components/TrustIndicator';

const MysteryBoxReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterBy, setFilterBy] = useState('all');

  const mysteryBoxSites = [
    {
      id: 1,
      name: "MysteryVault",
      logo: "/api/placeholder/60/60",
      rating: 4.8,
      trustScore: 95,
      category: "Premium",
      minDeposit: "$10",
      maxPayout: "$50,000",
      verificationTime: "2-4 hours",
      payoutTime: "Instant",
      bonuses: ["100% First Deposit", "Daily Free Cases"],
      pros: ["Provably fair", "Instant withdrawals", "Premium skins available", "24/7 support"],
      cons: ["Higher minimum deposit", "Limited payment methods"],
      features: ["Live Chat", "Mobile App", "Crypto Payments", "VIP Program"],
      lastReviewed: "Jan 15, 2025",
      reviewedBy: "Sarah Chen",
      testDeposit: "$500",
      testPayout: "$627",
      payoutSuccess: true,
      description: "Premium mystery box platform with the highest-value skins and fastest payouts in the industry.",
      warningFlags: [],
      licenses: ["Curacao Gaming", "Malta Gaming Authority"]
    },
    {
      id: 2, 
      name: "UnboxKings",
      logo: "/api/placeholder/60/60",
      rating: 4.6,
      trustScore: 88,
      category: "Popular",
      minDeposit: "$5",
      maxPayout: "$25,000", 
      verificationTime: "1-2 hours",
      payoutTime: "< 30 min",
      bonuses: ["50% Welcome Bonus", "Weekly Rewards"],
      pros: ["Low minimum deposit", "Great skin variety", "Fast verification", "Active community"],
      cons: ["Slower support response", "Limited high-tier skins"],
      features: ["Live Unboxing", "Tournaments", "Referral Program", "Discord Bot"],
      lastReviewed: "Jan 12, 2025",
      reviewedBy: "Marcus Rodriguez",
      testDeposit: "$300",
      testPayout: "$341",
      payoutSuccess: true,
      description: "Community-favorite platform known for fair odds and engaging unboxing experience.",
      warningFlags: [],
      licenses: ["Curacao Gaming"]
    },
    {
      id: 3,
      name: "CryptoBoxes",
      logo: "/api/placeholder/60/60", 
      rating: 4.3,
      trustScore: 82,
      category: "Crypto-Focused",
      minDeposit: "$1",
      maxPayout: "$15,000",
      verificationTime: "Instant",
      payoutTime: "1-5 min",
      bonuses: ["Crypto Bonus", "Rain Events"],
      pros: ["Accepts all major cryptos", "No KYC required", "Lightning fast", "Anonymous"],
      cons: ["Lower maximum payouts", "Limited customer support", "No fiat options"],
      features: ["Crypto Only", "Anonymous Play", "Rain System", "Provably Fair"],
      lastReviewed: "Jan 10, 2025",
      reviewedBy: "Elena Petrov",
      testDeposit: "$200",
      testPayout: "$189",
      payoutSuccess: true,
      description: "Crypto-native platform offering complete anonymity and lightning-fast transactions.",
      warningFlags: [],
      licenses: ["Costa Rica"]
    },
    {
      id: 4,
      name: "RedFlagBoxes",
      logo: "/api/placeholder/60/60",
      rating: 2.1,
      trustScore: 35,
      category: "Avoid",
      minDeposit: "$20",
      maxPayout: "$5,000",
      verificationTime: "24+ hours",
      payoutTime: "3-7 days",
      bonuses: ["Misleading Bonuses"],
      pros: ["High bonus percentages"],
      cons: ["Delayed payouts", "Poor customer service", "Suspicious RNG", "Hidden terms"],
      features: ["Questionable Practices"],
      lastReviewed: "Jan 8, 2025",
      reviewedBy: "David Kim",
      testDeposit: "$100",
      testPayout: "Pending (7 days)",
      payoutSuccess: false,
      description: "AVOID: Multiple user complaints about delayed payments and unfair practices.",
      warningFlags: ["Delayed Payouts", "Poor RNG", "Hidden Terms", "No License"],
      licenses: []
    }
  ];

  const filteredSites = mysteryBoxSites
    .filter(site => {
      if (filterBy === 'all') return true;
      if (filterBy === 'recommended') return site.rating >= 4.0;
      if (filterBy === 'avoid') return site.rating < 3.0;
      return site.category.toLowerCase() === filterBy;
    })
    .filter(site => 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'trust': return b.trustScore - a.trustScore;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mystery Box Reviews
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              In-depth reviews of CS2 mystery box sites. Tested by experts, verified by real money deposits.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>All sites tested with real money</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Updated weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Community verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mystery box sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="trust">Trust Score</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="crypto-focused">Crypto-Focused</SelectItem>
              <SelectItem value="avoid">Sites to Avoid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing {filteredSites.length} of {mysteryBoxSites.length} mystery box sites
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-6">
          {filteredSites.map((site) => (
            <Card 
              key={site.id} 
              className={`hover:shadow-lg transition-all duration-300 ${
                site.rating < 3.0 ? 'border-l-4 border-l-destructive bg-destructive/5' : 
                site.rating >= 4.5 ? 'border-l-4 border-l-success bg-success/5' :
                'border-l-4 border-l-primary/30'
              }`}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Site Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={site.logo}
                        alt={`${site.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">{site.name}</h3>
                          <Badge variant={site.rating >= 4.0 ? "default" : site.rating >= 3.0 ? "secondary" : "destructive"}>
                            {site.category}
                          </Badge>
                          {site.warningFlags.length > 0 && (
                            <Badge variant="destructive" className="animate-pulse">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              WARNING
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <RatingBadge rating={site.rating} />
                          <TrustIndicator score={site.trustScore} />
                        </div>
                        <p className="text-muted-foreground mb-4">{site.description}</p>
                        
                        {/* Warning Flags */}
                        {site.warningFlags.length > 0 && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                              <span className="font-semibold text-destructive">Warning Flags</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {site.warningFlags.map((flag, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Min Deposit</div>
                            <div className="font-semibold">{site.minDeposit}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Max Payout</div>
                            <div className="font-semibold">{site.maxPayout}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Verification</div>
                            <div className="font-semibold">{site.verificationTime}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Payout Time</div>
                            <div className="font-semibold">{site.payoutTime}</div>
                          </div>
                        </div>

                        {/* Pros and Cons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-success">Pros</h4>
                            <ul className="space-y-1">
                              {site.pros.map((pro, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-destructive">Cons</h4>
                            <ul className="space-y-1">
                              {site.cons.map((con, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                  <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {site.features.map((feature, index) => (
                              <Badge key={index} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Results & Actions */}
                  <div className="space-y-4">
                    {/* Test Results */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Our Test Results
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Test Deposit:</span>
                          <span className="font-semibold">{site.testDeposit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Test Payout:</span>
                          <span className={`font-semibold ${site.payoutSuccess ? 'text-success' : 'text-destructive'}`}>
                            {site.testPayout}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant={site.payoutSuccess ? "default" : "destructive"}>
                            {site.payoutSuccess ? "Verified" : "Failed"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Reviewed by {site.reviewedBy} on {site.lastReviewed}
                        </div>
                      </div>
                    </Card>

                    {/* Bonuses */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Current Bonuses</h4>
                      <div className="space-y-2">
                        {site.bonuses.map((bonus, index) => (
                          <Badge key={index} variant="secondary" className="block text-center">
                            {bonus}
                          </Badge>
                        ))}
                      </div>
                    </Card>

                    {/* Licenses */}
                    {site.licenses.length > 0 && (
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">Licenses</h4>
                        <div className="space-y-1">
                          {site.licenses.map((license, index) => (
                            <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {license}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        className={`w-full ${site.rating < 3.0 ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                        disabled={site.rating < 3.0}
                      >
                        {site.rating < 3.0 ? 'Not Recommended' : 'Visit Site'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`/mystery-boxes/${site.id}`}>
                          Full Review
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Methodology Section */}
        <Card className="mt-12 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Our Review Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">What We Test</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Real money deposits and withdrawals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    RNG verification and provably fair systems
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Customer support response times
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Terms of service and hidden clauses
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Our Rating System</h4>
                <ul className="space-y-2 text-sm">
                  <li>⭐⭐⭐⭐⭐ Excellent (4.5+) - Highly recommended</li>
                  <li>⭐⭐⭐⭐ Good (4.0-4.4) - Recommended</li>
                  <li>⭐⭐⭐ Average (3.0-3.9) - Proceed with caution</li>
                  <li>⭐⭐ Poor (2.0-2.9) - Not recommended</li>
                  <li>⭐ Terrible (0-1.9) - Avoid at all costs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default MysteryBoxReviews;