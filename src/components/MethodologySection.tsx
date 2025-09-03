import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Database, Shield, Clock, TrendingUp, ArrowRight, Search, AlertTriangle } from 'lucide-react';

const MethodologySection = () => {
  const steps = [
    {
      step: "01",
      title: "Data Collection",
      icon: <Database className="w-6 h-6" />,
      description: "Automated scraping of odds, payout rates, and metadata from 87+ mystery box operators",
      details: [
        "24/7 monitoring of operator websites",
        "Real-time capture of advertised odds",
        "Historical data retention (2+ years)",
        "Cross-verification with multiple sources"
      ]
    },
    {
      step: "02", 
      title: "Statistical Analysis",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Advanced statistical modeling to identify anomalies and verify claimed payout rates",
      details: [
        "Chi-square tests for randomness",
        "Regression analysis on payout patterns",
        "Monte Carlo simulations",
        "Outlier detection algorithms"
      ]
    },
    {
      step: "03",
      title: "Verification Testing",
      icon: <Shield className="w-6 h-6" />,
      description: "Technical assessment of provably fair systems and random number generators",
      details: [
        "RNG seed verification",
        "Smart contract auditing", 
        "API endpoint testing",
        "Blockchain transaction analysis"
      ]
    },
    {
      step: "04",
      title: "Content Review",
      icon: <FileText className="w-6 h-6" />,
      description: "Expert editorial review and fact-checking before publication",
      details: [
        "Dual peer review process",
        "Source citation requirements",
        "Conflict of interest screening",
        "Regular accuracy audits"
      ]
    }
  ];

  const standards = [
    {
      title: "Data Transparency",
      description: "All data sources and collection methods fully disclosed",
      icon: <Search className="w-5 h-5" />
    },
    {
      title: "No Conflicts of Interest", 
      description: "Revenue streams never influence editorial decisions",
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: "Regular Updates",
      description: "Continuous monitoring and monthly comprehensive reviews",
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: "Community Feedback",
      description: "User reports integrated into ongoing assessments",
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Research Methodology</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We don't rely on marketing claims or operator self-reporting. Our systematic approach combines 
          automated data collection, statistical analysis, and expert review to provide objective assessments.
        </p>
      </div>

      {/* Methodology Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {steps.map((step, index) => (
          <Card key={index} className="text-center h-full">
            <CardHeader>
              <div className="mx-auto mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  {step.icon}
                </div>
                <Badge variant="outline" className="mb-3">{step.step}</Badge>
              </div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <ul className="text-xs space-y-1">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editorial Standards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Editorial Standards & Ethics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {standards.map((standard, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {standard.icon}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{standard.title}</h4>
                  <p className="text-sm text-muted-foreground">{standard.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Current Coverage & Statistics</h3>
            <p className="text-muted-foreground">Real-time overview of our monitoring efforts</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
            <div>
              <div className="text-2xl font-bold text-primary">87</div>
              <div className="text-sm text-muted-foreground">Operators Monitored</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Box Types Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">2.3M</div>
              <div className="text-sm text-muted-foreground">Data Points Collected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring Active</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Full Methodology PDF
            </Button>
            <Button>
              View Data Sources <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MethodologySection;