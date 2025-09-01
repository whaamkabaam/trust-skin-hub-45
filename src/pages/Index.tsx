import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Clock, Users, ArrowRight, CheckCircle, AlertTriangle, ExternalLink, Star, Calendar, FileText, Globe, UserCheck, Award } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Trust Strip */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">87 operators reviewed</Badge>
            </span>
            <span className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">92% payouts verified</Badge>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last audit: Today 14:20 UTC
            </span>
            <span className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Methodology v2.3</Badge>
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Updated daily
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Gaming Hubs Section */}
        

        {/* Recently Tested Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Recently Tested</h2>
            <p className="text-muted-foreground">Hands-on tested by humans. We deposit, play, and cash out—then publish the results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(test => <Card key={test} className="border-l-4 border-l-success">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg"></div>
                      <div>
                        <h4 className="font-semibold">Operator {test}</h4>
                        <p className="text-sm text-muted-foreground">Tested by Sarah Chen</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Passed
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1 mb-3">
                    <p>Deposit: $500 • Withdraw: $527</p>
                    <p className="font-medium text-success">Cashout 27m</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Dec 15, 2024</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Full audit log <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>

        {/* Analyst Team Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Our Analyst Team</h2>
            <p className="text-muted-foreground">Meet the experts behind our reviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
            name: "Sarah Chen",
            role: "Senior Gaming Analyst",
            years: "8 years",
            credentials: "CPA, Former Valve Engineer"
          }, {
            name: "Marcus Rodriguez",
            role: "Crypto & Security Expert",
            years: "6 years",
            credentials: "CISSP, Blockchain Developer"
          }, {
            name: "Elena Petrov",
            role: "Community Manager",
            years: "5 years",
            credentials: "CS:GO Semi-Pro, 10k+ Hours"
          }, {
            name: "David Kim",
            role: "Data Analyst",
            years: "4 years",
            credentials: "PhD Statistics, MIT"
          }].map((analyst, index) => <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                  <h4 className="font-semibold mb-1">{analyst.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{analyst.role}</p>
                  <div className="text-xs space-y-1 mb-3">
                    <p><Award className="inline w-3 h-3 mr-1" />{analyst.years} experience</p>
                    <p className="text-muted-foreground">{analyst.credentials}</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Globe className="w-3 h-3 mr-1" />LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Steam</Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>

        {/* Methodology Snapshot */}
        <section className="mb-16">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Our Testing Methodology</h3>
                  <p className="text-sm text-muted-foreground">Transparent, rigorous, unbiased</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Seed verification & provably fair testing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Real money deposits and withdrawals
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Standardized test basket across all operators
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Strict conflict-of-interest policies
                  </li>
                </ul>
              </div>
              <Button variant="outline" className="w-full md:w-auto">
                See How We Rate <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Transparency & Disclosures */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Transparency & Disclosures</h2>
            <p className="text-muted-foreground">Affiliate links never influence ratings. Here's how we keep it clean →</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h4 className="font-medium mb-2">Affiliate Disclosure</h4>
                <p className="text-sm text-muted-foreground mb-3">Full transparency on our business model</p>
                <Button variant="ghost" size="sm">Read Policy</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-warning" />
                <h4 className="font-medium mb-2">Corrections Policy</h4>
                <p className="text-sm text-muted-foreground mb-3">How we handle errors and updates</p>
                <Button variant="ghost" size="sm">View Process</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-accent" />
                <h4 className="font-medium mb-2">Changelog</h4>
                <p className="text-sm text-muted-foreground mb-3">What changed this week</p>
                <Button variant="ghost" size="sm">See Updates</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Globe className="w-8 h-8 mx-auto mb-3 text-gaming-blue" />
                <h4 className="font-medium mb-2">Data Sources</h4>
                <p className="text-sm text-muted-foreground mb-3">Where our information comes from</p>
                <Button variant="ghost" size="sm">View Sources</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Operator Verification Scoreboard */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Operator Verification Scoreboard</h2>
            <p className="text-muted-foreground">Transparency at a glance - click any badge to see our criteria</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {['Stake.com', 'CSGORoll', 'DaddySkins', 'Rollbit', 'BC.Game'].map((operator, index) => <div key={index} className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <div className="w-8 h-8 bg-muted rounded"></div>
                    <span className="font-medium">{operator}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={index < 3 ? "default" : "secondary"} className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />KYC OK
                    </Badge>
                    <Badge variant={index < 4 ? "default" : "secondary"} className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />Provably Fair
                    </Badge>
                    <Badge variant={index < 2 ? "default" : "secondary"} className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />Payouts Verified
                    </Badge>
                    <Badge variant={index < 3 ? "default" : "secondary"} className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />Odds Published
                    </Badge>
                    <Badge variant={index < 4 ? "default" : "secondary"} className="text-xs">
                      <UserCheck className="w-3 h-3 mr-1" />Ownership Known
                    </Badge>
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Complaints & Resolutions Dashboard */}
        <section className="mb-16">
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Complaints & Resolutions Dashboard</h3>
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
                  <h3 className="text-lg font-semibold">Sites We Do Not Recommend</h3>
                  <p className="text-sm text-muted-foreground">Operators with active warnings or de-listings</p>
                </div>
              </div>
              <div className="space-y-3">
                {[{
                name: "SuspiciousSite.com",
                reason: "Non-payment reports (14 days)"
              }, {
                name: "RiggedOdds.net",
                reason: "Manipulated RNG detected"
              }, {
                name: "FakeOperator.gg",
                reason: "ToS violations, license issues"
              }].map((site, index) => <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div>
                      <span className="font-medium text-destructive">{site.name}</span>
                      <p className="text-sm text-muted-foreground">{site.reason}</p>
                    </div>
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Community Reviews */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Real Users Say...</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-lg font-semibold">4.6/5</span>
              <span className="text-muted-foreground">(2,847 reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[{
            user: "CryptoTrader_Mike",
            rating: 5,
            text: "Fast payouts, transparent odds. Been using for 6 months no issues.",
            verified: true
          }, {
            user: "SkinCollector23",
            rating: 4,
            text: "Good selection of operators. Love the detailed breakdowns.",
            verified: false
          }, {
            user: "ProGamer_Sarah",
            rating: 5,
            text: "Saved me from a scam site. Their warnings are spot on.",
            verified: true
          }].map((review, index) => <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full"></div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{review.user}</span>
                          {review.verified && <CheckCircle className="w-3 h-3 text-success" />}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>)}
          </div>
          <div className="text-center">
            <Button variant="outline" className="mr-4">Leave a Review</Button>
            <Button variant="ghost" size="sm">Moderation Guidelines</Button>
          </div>
        </section>

        {/* Responsible Gaming */}
        <section className="mb-16">
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Responsible Gaming & Age Verification</h3>
                <p className="text-sm text-muted-foreground">Gaming should be fun and safe. Resources for responsible play.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="font-medium mb-2">🇺🇸 USA</h4>
                  <p className="text-sm text-muted-foreground mb-2">National Problem Gaming Helpline</p>
                  <p className="text-sm font-mono">1-800-522-4700</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🇬🇧 UK</h4>
                  <p className="text-sm text-muted-foreground mb-2">GamCare</p>
                  <p className="text-sm font-mono">0808 8020 133</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🇪🇺 EU</h4>
                  <p className="text-sm text-muted-foreground mb-2">BeGambleAware</p>
                  <p className="text-sm font-mono">begambleaware.org</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">Must be 18+ to participate. Gambling can be addictive, please play responsibly.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Press & Citations */}
        <section className="mb-16">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-4">As Referenced By</h3>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {['TechCrunch', 'Forbes', 'CoinDesk', 'Polygon', 'Kotaku'].map((outlet, index) => <div key={index} className="text-muted-foreground font-medium text-sm">
                  {outlet}
                </div>)}
            </div>
          </div>
        </section>

        {/* Trust & Transparency Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Trust Unpacked.gg?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our analysis combines rigorous testing, community feedback, 
              and transparent methodology to help you make informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Security First</h3>
                <p className="text-sm text-muted-foreground">
                  Every operator undergoes comprehensive security and legitimacy checks.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Data Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Real user reviews, payout testing, and fee analysis inform our ratings.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Always Current</h3>
                <p className="text-sm text-muted-foreground">
                  Daily updates ensure our recommendations reflect latest changes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gaming-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-gaming-blue" />
                </div>
                <h3 className="font-semibold mb-2">Community Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Built by traders, for traders, with transparent editorial policies.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;