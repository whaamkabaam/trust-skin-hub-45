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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Clock, Users, ArrowRight, CheckCircle, AlertTriangle, ExternalLink, Star, Calendar, FileText, Globe, UserCheck, Award, Database, Target, Zap } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Trust Strip */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="font-medium">87 operators monitored</span>
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