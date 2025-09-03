import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, AlertTriangle, Clock, Shield, ExternalLink, CheckCircle } from 'lucide-react';

const TransparencySection = () => {
  const disclosures = [
    {
      title: "Revenue Model",
      icon: <DollarSign className="w-6 h-6" />,
      description: "We earn commission when users click affiliate links, but this never influences our ratings or editorial content.",
      details: [
        "Affiliate commissions clearly disclosed on every page",
        "Editorial and commercial teams operate independently", 
        "Ratings determined by data analysis, not partnership status",
        "We decline partnerships that compromise editorial integrity"
      ]
    },
    {
      title: "Editorial Independence",
      icon: <Shield className="w-6 h-6" />,
      description: "Our content team makes editorial decisions based solely on research findings and user benefit.",
      details: [
        "No advertiser input on editorial content",
        "Negative reviews published despite partnerships",
        "Clear separation between ads and editorial content",
        "Regular editorial independence audits"
      ]
    },
    {
      title: "Data Collection Ethics",
      icon: <FileText className="w-6 h-6" />,
      description: "All data collection follows ethical guidelines and respects operator terms of service.",
      details: [
        "Only public-facing data collected",
        "No account creation or impersonation",
        "Respect for rate limits and server resources",
        "Regular legal compliance reviews"
      ]
    },
    {
      title: "Correction Policy",
      icon: <AlertTriangle className="w-6 h-6" />,
      description: "When we make mistakes, we fix them quickly and transparently.",
      details: [
        "Public corrections log maintained",
        "Email notifications to affected users",
        "Root cause analysis for systematic errors",
        "Process improvements implemented"
      ]
    }
  ];

  const partnerships = [
    { name: "Stake.com", type: "Affiliate", disclosure: "Earns commission on user deposits" },
    { name: "CSGORoll", type: "Affiliate", disclosure: "Earns commission on user deposits" },
    { name: "Rollbit", type: "Data Partnership", disclosure: "Provides API access for real-time odds" },
    { name: "BC.Game", type: "Affiliate", disclosure: "Earns commission on user deposits" },
    { name: "DaddySkins", type: "No Partnership", disclosure: "Independent monitoring only" }
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Transparency & Business Ethics</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We believe transparency builds trust. Here's exactly how we operate, 
          what influences our decisions, and how we make money.
        </p>
      </div>

      {/* Disclosure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {disclosures.map((disclosure, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {disclosure.icon}
                </div>
                {disclosure.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{disclosure.description}</p>
              <ul className="space-y-2">
                {disclosure.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partnership Disclosure */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Partnerships & Affiliations</CardTitle>
          <p className="text-muted-foreground">
            Complete list of our business relationships and how they affect our coverage
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Operator</th>
                  <th className="text-left py-3 font-semibold">Relationship</th>
                  <th className="text-left py-3 font-semibold">Disclosure</th>
                </tr>
              </thead>
              <tbody>
                {partnerships.map((partner, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium">{partner.name}</td>
                    <td className="py-3">
                      <Badge 
                        variant={partner.type === 'No Partnership' ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {partner.type}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{partner.disclosure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Policy Links */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Legal & Compliance</h3>
            <p className="text-muted-foreground">Access our complete policies and legal documentation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Editorial Guidelines
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Terms of Service
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          </div>

          <div className="flex justify-center mt-6">
            <Button>
              <Clock className="w-4 h-4 mr-2" />
              View Corrections Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TransparencySection;