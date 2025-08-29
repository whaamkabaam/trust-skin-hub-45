import { useState } from 'react';
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
            <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
            <span className="text-muted-foreground">/</span>
            <a href="/cases" className="text-muted-foreground hover:text-foreground">Cases</a>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{caseData.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-card border-b">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to cases
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="relative">
                  <img
                    src={caseData.image || '/img/cases/default-case.jpg'}
                    alt={caseData.name}
                    className="w-full md:w-80 aspect-[4/3] object-cover rounded-lg shadow-card"
                  />
                  {caseData.verified && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-success text-success-foreground">
                        <Verified className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">{caseData.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary">{caseData.game}</Badge>
                    <Badge className="bg-success text-success-foreground">
                      Odds: {caseData.oddsDisclosed}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ${caseData.currentPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Current price</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-muted-foreground">
                        {(caseData.stats.avgReturn * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg return</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {caseData.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Released {new Date(caseData.releaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{caseData.stats.openCount.toLocaleString()} opens</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{caseData.stats.openCount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total opens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">
                        {caseData.stats.profitableOpens}%
                      </div>
                      <div className="text-xs text-muted-foreground">Profitable</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Min price</span>
                      <span className="font-medium">${caseData.minPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current price</span>
                      <span className="font-medium">${caseData.currentPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected value</span>
                      <span className="font-medium">${(caseData.currentPrice * caseData.stats.avgReturn).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedCases.map((relatedCase, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={relatedCase.image}
                        alt={relatedCase.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{relatedCase.name}</div>
                        <div className="text-xs text-muted-foreground">${relatedCase.price}</div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Safety Note */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Case opening involves chance. Never spend more than you can afford to lose.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="drops">Drop Table</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
            <TabsTrigger value="calculator">ROI Calculator</TabsTrigger>
            <TabsTrigger value="operators">Where to Open</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Drop Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dropTable.map((rarity) => (
                      <div key={rarity.rarity} className="flex justify-between items-center">
                        <span className={cn("font-medium", rarity.color)}>{rarity.rarity}</span>
                        <span className="text-sm">{rarity.probability}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Value Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Case cost</span>
                      <span className="font-medium">${caseData.currentPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected value</span>
                      <span className="font-medium">${(caseData.currentPrice * caseData.stats.avgReturn).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected loss</span>
                      <span className="font-medium text-destructive">
                        -${(caseData.currentPrice * (1 - caseData.stats.avgReturn)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Community Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Opens today</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg per hour</span>
                      <span className="font-medium">52</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Peak hour</span>
                      <span className="font-medium">8:00 PM UTC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Drop Table Tab */}
          <TabsContent value="drops" className="space-y-6">
            <div className="space-y-6">
              {dropTable.map((rarity) => (
                <Card key={rarity.rarity}>
                  <CardHeader>
                    <CardTitle className={cn("flex items-center justify-between", rarity.color)}>
                      <span>{rarity.rarity}</span>
                      <Badge variant="outline">{rarity.probability}% chance</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {rarity.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.wear}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.price.avg}</div>
                            <div className="text-sm text-muted-foreground">
                              ${item.price.min} - ${item.price.avg * 1.2}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Price History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>6-Month Price History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {priceHistory.map((point, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(point.price / 4) * 100}%` }}
                      />
                      <div className="text-xs text-muted-foreground mt-2">{point.date}</div>
                      <div className="text-xs font-medium">${point.price}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Prices shown are daily averages across major operators
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROI Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Expected Value Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price">Case price ($)</Label>
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
                        min="1"
                        value={calculatorQuantity}
                        onChange={(e) => setCalculatorQuantity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-3">Results</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total cost:</span>
                          <span className="font-medium">${calculations.totalCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected value:</span>
                          <span className="font-medium">${calculations.expectedValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected profit:</span>
                          <span className={cn(
                            "font-medium",
                            parseFloat(calculations.profit) >= 0 ? "text-success" : "text-destructive"
                          )}>
                            ${calculations.profit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profit margin:</span>
                          <span className={cn(
                            "font-medium",
                            parseFloat(calculations.profitMargin) >= 0 ? "text-success" : "text-destructive"
                          )}>
                            {calculations.profitMargin}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        This calculation is based on historical averages and current market prices. 
                        Actual results may vary significantly.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operators Tab */}
          <TabsContent value="operators" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Where to open {caseData.name}</h3>
              <p className="text-muted-foreground">
                Compare prices and ratings across verified operators
              </p>
              
              <div className="grid gap-4">
                {operators.map((operator, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <span className="font-semibold">{operator.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{operator.name}</div>
                          <div className="flex items-center gap-2">
                            <RatingBadge rating={operator.rating} size="sm" />
                            {operator.verified && (
                              <Badge className="bg-success text-success-foreground text-xs">
                                <Verified className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">${operator.price}</div>
                          <div className="text-sm text-muted-foreground">per case</div>
                        </div>
                        <Button className="bg-gradient-trust">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Case
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Prices update every 15 minutes. Always verify current prices on the operator's website.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default CaseDetail;