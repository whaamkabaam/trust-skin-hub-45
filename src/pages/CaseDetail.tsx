import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, Verified, Eye, BarChart3, Calculator, ShoppingCart, ExternalLink, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RatingBadge from '@/components/RatingBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const CaseDetail = () => {
  const [calculatorPrice, setCalculatorPrice] = useState('2.49');
  const [calculatorQuantity, setCalculatorQuantity] = useState('1');

  const caseData = {
    id: 'revolution-case',
    name: 'Revolution Case',
    image: '/img/cases/revolution-case.jpg',
    game: 'CS2',
    minPrice: 2.49,
    currentPrice: 2.63,
    oddsDisclosed: 'Yes' as const,
    verified: true,
    releaseDate: '2023-02-15',
    stats: {
      openCount: 15420,
      avgReturn: 0.73,
      profitableOpens: 12.5
    },
    description: 'The Revolution Case contains community-created weapon skins from the Revolution Collection, featuring bold designs and premium finishes.',
  };

  const dropTable = [
    {
      rarity: 'Covert',
      probability: 0.64,
      color: 'text-destructive',
      items: [
        { name: 'AK-47 | Nightwish', price: { min: 125.50, avg: 150.25 }, wear: 'Factory New' },
        { name: 'M4A4 | Temukau', price: { min: 89.99, avg: 110.50 }, wear: 'Factory New' }
      ]
    },
    {
      rarity: 'Classified',
      probability: 3.2,
      color: 'text-gaming-blue',
      items: [
        { name: 'AWP | Duality', price: { min: 45.50, avg: 55.25 }, wear: 'Factory New' },
        { name: 'P250 | Visions', price: { min: 12.30, avg: 18.75 }, wear: 'Factory New' },
        { name: 'Sawed-Off | Analog Input', price: { min: 8.99, avg: 12.50 }, wear: 'Factory New' }
      ]
    },
    {
      rarity: 'Restricted',
      probability: 15.98,
      color: 'text-primary',
      items: [
        { name: 'Desert Eagle | Ocean Drive', price: { min: 5.25, avg: 8.50 }, wear: 'Factory New' },
        { name: 'M4A1-S | Emphorosaur-S', price: { min: 4.80, avg: 7.25 }, wear: 'Factory New' },
        { name: 'Galil AR | Destroyer', price: { min: 3.99, avg: 5.75 }, wear: 'Factory New' },
        { name: 'Glock-18 | Voltaic', price: { min: 2.50, avg: 4.25 }, wear: 'Factory New' },
        { name: 'P2000 | Wicked Sick', price: { min: 1.99, avg: 3.50 }, wear: 'Factory New' }
      ]
    },
    {
      rarity: 'Mil-Spec',
      probability: 79.92,
      color: 'text-accent',
      items: [
        { name: 'AK-47 | Legion of Anubis', price: { min: 1.25, avg: 2.10 }, wear: 'Factory New' },
        { name: 'MAC-10 | Sakkaku', price: { min: 0.85, avg: 1.50 }, wear: 'Factory New' },
        { name: 'USP-S | Black Lotus', price: { min: 0.65, avg: 1.25 }, wear: 'Factory New' }
      ]
    }
  ];

  const operators = [
    { name: 'Clash.gg', price: 2.49, rating: 4.3, verified: true, url: '#' },
    { name: 'Key-Drop', price: 2.65, rating: 4.0, verified: true, url: '#' },
    { name: 'Hellcase', price: 2.58, rating: 3.7, verified: true, url: '#' },
  ];

  const relatedCases = [
    { name: 'Recoil Case', price: 0.89, image: '/img/cases/recoil-case.jpg' },
    { name: 'Dreams & Nightmares Case', price: 0.45, image: '/img/cases/dreams-case.jpg' },
    { name: 'Fracture Case', price: 1.25, image: '/img/cases/fracture-case.jpg' }
  ];

  const priceHistory = [
    { date: '2024-01', price: 3.20 },
    { date: '2024-02', price: 2.95 },
    { date: '2024-03', price: 2.80 },
    { date: '2024-04', price: 2.65 },
    { date: '2024-05', price: 2.55 },
    { date: '2024-06', price: 2.63 },
  ];

  const calculateExpectedValue = () => {
    const price = parseFloat(calculatorPrice);
    const quantity = parseInt(calculatorQuantity);
    const expectedValue = price * caseData.stats.avgReturn * quantity;
    const totalCost = price * quantity;
    const profit = expectedValue - totalCost;
    
    return {
      totalCost: totalCost.toFixed(2),
      expectedValue: expectedValue.toFixed(2),
      profit: profit.toFixed(2),
      profitMargin: ((profit / totalCost) * 100).toFixed(1)
    };
  };

  const calculations = calculateExpectedValue();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/cases" className="text-muted-foreground hover:text-foreground">Cases</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{caseData.name}</span>
          </div>
        </div>
      </div>

      {/* Compact Hero Section */}
      <section className="bg-gradient-card border-b">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" className="mb-2" asChild>
            <Link to="/cases">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to cases
            </Link>
          </Button>

          {/* Single Row Layout */}
          <div className="grid lg:grid-cols-12 gap-4 items-center">
            {/* Case Info */}
            <div className="lg:col-span-5 flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-card rounded-lg shadow-card flex items-center justify-center flex-shrink-0">
                  <div className="text-2xl">📦</div>
                </div>
                {caseData.verified && (
                  <Badge className="absolute -top-1 -right-1 bg-success text-success-foreground text-xs">
                    <Verified className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold leading-tight">{caseData.name}</h1>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">{caseData.game}</Badge>
                  <Badge className="bg-success text-success-foreground text-xs">
                    Odds: {caseData.oddsDisclosed}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{caseData.description}</p>
              </div>
            </div>

            {/* Key Stats - Horizontal */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-lg font-bold text-primary">${caseData.currentPrice}</div>
                  <div className="text-xs text-muted-foreground">Price</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-lg font-bold">{(caseData.stats.avgReturn * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Return</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-sm font-bold text-success">{caseData.stats.profitableOpens}%</div>
                  <div className="text-xs text-muted-foreground">Profitable</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-sm font-bold">{(caseData.stats.openCount / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-muted-foreground">Opens</div>
                </div>
              </div>
            </div>

            {/* Similar Cases - Inline */}
            <div className="lg:col-span-3">
              <div className="text-xs text-muted-foreground mb-1">Similar Cases:</div>
              <div className="flex gap-2">
                {relatedCases.slice(0, 3).map((relatedCase, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted/30 rounded px-2 py-1 text-xs">
                    <span className="font-medium truncate">{relatedCase.name.split(' ')[0]}</span>
                    <span className="text-muted-foreground">${relatedCase.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - No Tabs, All Visible */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Drop Table */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Drop Table & Odds
            </h2>
            
            <div className="space-y-4">
              {dropTable.map((rarity) => (
                <Card key={rarity.rarity}>
                  <CardHeader className="pb-2">
                    <CardTitle className={cn("flex items-center justify-between text-lg", rarity.color)}>
                      <span>{rarity.rarity}</span>
                      <Badge variant="outline">{rarity.probability}% chance</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {rarity.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <TrendingUp className="w-3 h-3" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.wear}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">${item.price.avg}</div>
                            <div className="text-xs text-muted-foreground">
                              ${item.price.min} - ${(item.price.avg * 1.2).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Calculator & Operators */}
          <div className="space-y-6">
            {/* ROI Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="price">Case Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={calculatorPrice}
                      onChange={(e) => setCalculatorPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={calculatorQuantity}
                      onChange={(e) => setCalculatorQuantity(e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total cost</span>
                    <span className="font-medium">${calculations.totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected value</span>
                    <span className="font-medium">${calculations.expectedValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected profit</span>
                    <span className={cn("font-medium", 
                      parseFloat(calculations.profit) >= 0 ? "text-success" : "text-destructive"
                    )}>
                      ${calculations.profit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit margin</span>
                    <span className={cn("font-medium", 
                      parseFloat(calculations.profitMargin) >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {calculations.profitMargin}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Where to Open */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Where to Open
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {operators.map((operator, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {operator.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-1">
                          {operator.name}
                          {operator.verified && (
                            <Verified className="w-3 h-3 text-success" />
                          )}
                        </div>
                        <RatingBadge rating={operator.rating} size="sm" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">${operator.price}</div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Expected value</span>
                  <span className="font-medium">${(caseData.currentPrice * caseData.stats.avgReturn).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expected loss</span>
                  <span className="font-medium text-destructive">
                    -${(caseData.currentPrice * (1 - caseData.stats.avgReturn)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Break-even chance</span>
                  <span className="font-medium">{caseData.stats.profitableOpens}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Safety Warning */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Case opening involves chance. Never spend more than you can afford to lose.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CaseDetail;