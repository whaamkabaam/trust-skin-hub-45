import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield, FileText, TrendingUp, Clock, ExternalLink } from 'lucide-react';

const VerificationDashboard = () => {
  const operators = [
    {
      name: "Stake.com",
      logo: "/img/operators/stake.png",
      overallRating: "A+",
      status: "verified",
      checks: {
        provablyFair: { status: "pass", details: "RNG verified via blockchain" },
        payoutRates: { status: "pass", details: "95.2% verified payout rate" },
        licensing: { status: "pass", details: "Curacao eGaming licensed" },
        userFeedback: { status: "pass", details: "4.6/5 user rating (2,847 reviews)" },
        financialStability: { status: "pass", details: "Public financials, $2B+ volume" }
      },
      lastUpdated: "2 hours ago",
      riskLevel: "Low"
    },
    {
      name: "CSGORoll", 
      logo: "/img/operators/csgoroll.png",
      overallRating: "A",
      status: "verified",
      checks: {
        provablyFair: { status: "pass", details: "Custom RNG implementation verified" },
        payoutRates: { status: "pass", details: "94.8% verified payout rate" },
        licensing: { status: "pass", details: "Curacao eGaming licensed" },
        userFeedback: { status: "warning", details: "4.2/5 user rating (1,523 reviews)" },
        financialStability: { status: "pass", details: "Consistent payouts, established 2016" }
      },
      lastUpdated: "4 hours ago", 
      riskLevel: "Low"
    },
    {
      name: "Rollbit",
      logo: "/img/operators/rollbit.jpg",
      overallRating: "B+",
      status: "caution",
      checks: {
        provablyFair: { status: "pass", details: "Third-party RNG verification" },
        payoutRates: { status: "warning", details: "92.1% payout rate (below average)" },
        licensing: { status: "pass", details: "Curacao eGaming licensed" },
        userFeedback: { status: "warning", details: "3.8/5 user rating (892 reviews)" },
        financialStability: { status: "pass", details: "Adequate reserves, newer operator" }
      },
      lastUpdated: "6 hours ago",
      riskLevel: "Medium"
    },
    {
      name: "BC.Game",
      logo: "/img/operators/bc-game.png", 
      overallRating: "B",
      status: "verified",
      checks: {
        provablyFair: { status: "pass", details: "Blockchain-based verification" },
        payoutRates: { status: "pass", details: "93.7% verified payout rate" },
        licensing: { status: "warning", details: "License details unclear" },
        userFeedback: { status: "pass", details: "4.1/5 user rating (1,247 reviews)" },
        financialStability: { status: "pass", details: "Strong crypto backing" }
      },
      lastUpdated: "3 hours ago",
      riskLevel: "Low-Medium"
    },
    {
      name: "DaddySkins",
      logo: "/img/operators/daddyskins.png",
      overallRating: "C+", 
      status: "warning",
      checks: {
        provablyFair: { status: "fail", details: "No provably fair system detected" },
        payoutRates: { status: "warning", details: "89.3% payout rate (significantly below average)" },
        licensing: { status: "warning", details: "No clear licensing information" },
        userFeedback: { status: "warning", details: "3.2/5 user rating (456 reviews)" },
        financialStability: { status: "warning", details: "Limited financial transparency" }
      },
      lastUpdated: "1 hour ago",
      riskLevel: "High"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-success';
      case 'warning': return 'text-warning';
      case 'fail': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'fail': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Live Operator Verification Dashboard</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Real-time monitoring of operator trustworthiness across key metrics. 
          Our automated systems check these factors every few hours.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">3</div>
            <div className="text-sm text-muted-foreground">Fully Verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">1</div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">1</div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">92.8%</div>
            <div className="text-sm text-muted-foreground">Avg Payout Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Operator Cards */}
      <div className="space-y-6">
        {operators.map((operator, index) => (
          <Card key={index} className={`border-l-4 ${
            operator.status === 'verified' ? 'border-l-success' :
            operator.status === 'caution' ? 'border-l-warning' : 'border-l-destructive'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <img src={operator.logo} alt={operator.name} className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {operator.name}
                      <Badge variant={
                        operator.status === 'verified' ? 'default' :
                        operator.status === 'caution' ? 'secondary' : 'outline'
                      }>
                        {operator.overallRating}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Risk Level: {operator.riskLevel}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated {operator.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Full Report
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(operator.checks).map(([check, data]) => (
                  <div key={check} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(data.status)}>
                        {getStatusIcon(data.status)}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {check.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{data.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Methodology Link */}
      <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">How We Verify Operators</h3>
          <p className="text-muted-foreground mb-4">
            Our verification process combines automated monitoring, statistical analysis, and community feedback
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Verification Criteria
            </Button>
            <Button>
              <Shield className="w-4 h-4 mr-2" />
              Report an Issue
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default VerificationDashboard;