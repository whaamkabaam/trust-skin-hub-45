import { useState } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Verified, Eye, BarChart3, Calculator, ShoppingCart, ExternalLink, Info, Package, Truck, RotateCcw, Hash } from 'lucide-react';
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

const MysteryBoxDetail = () => {
  const [calculatorPrice, setCalculatorPrice] = useState('49.99');
  const [calculatorQuantity, setCalculatorQuantity] = useState('1');

  const boxData = {
    id: 'premium-knife-box',
    name: 'Premium Knife Collection',
    image: '/img/boxes/premium-knife.jpg',
    game: 'CS2',
    type: 'digital',
    category: 'Knives',
    minPrice: 49.99,
    currentPrice: 52.99,
    oddsDisclosed: 'Yes' as const,
    verified: true,
    provablyFair: true,
    releaseDate: '2024-01-15',
    stats: {
      openCount: 3240,
      avgReturn: 1.15,
      profitableOpens: 35.2
    },
    description: 'Premium mystery box containing high-value CS2 knives with verified odds and provably fair system. Each box guarantees at least one knife skin.',
    operator: 'Premium Skins'
  };

  const dropTable = [
    {
      rarity: 'Legendary',
      probability: 5.0,
      color: 'text-gaming-gold',
      items: [
        { name: 'Karambit | Fade', price: { min: 750.00, avg: 850.25 }, wear: 'Factory New' },
        { name: 'M9 Bayonet | Crimson Web', price: { min: 680.99, avg: 750.50 }, wear: 'Minimal Wear' },
        { name: 'Butterfly Knife | Tiger Tooth', price: { min: 520.50, avg: 580.25 }, wear: 'Factory New' }
      ]
    },
    {
      rarity: 'Epic',
      probability: 15.0,
      color: 'text-primary',
      items: [
        { name: 'Bayonet | Doppler', price: { min: 245.50, avg: 285.25 }, wear: 'Factory New' },
        { name: 'Huntsman Knife | Slaughter', price: { min: 180.30, avg: 220.75 }, wear: 'Field-Tested' },
        { name: 'Flip Knife | Case Hardened', price: { min: 150.99, avg: 180.50 }, wear: 'Well-Worn' },
        { name: 'Gut Knife | Marble Fade', price: { min: 120.25, avg: 145.75 }, wear: 'Factory New' }
      ]
    },
    {
      rarity: 'Rare',
      probability: 30.0,
      color: 'text-accent',
      items: [
        { name: 'Falchion Knife | Damascus Steel', price: { min: 85.50, avg: 105.25 }, wear: 'Factory New' },
        { name: 'Shadow Daggers | Fade', price: { min: 75.80, avg: 95.25 }, wear: 'Minimal Wear' },
        { name: 'Bowie Knife | Night', price: { min: 65.99, avg: 85.75 }, wear: 'Field-Tested' },
        { name: 'Survival Knife | Forest DDPAT', price: { min: 55.25, avg: 70.50 }, wear: 'Battle-Scarred' }
      ]
    },
    {
      rarity: 'Common',
      probability: 50.0,
      color: 'text-muted-foreground',
      items: [
        { name: 'Navaja Knife | Vanilla', price: { min: 45.25, avg: 55.10 }, wear: 'Factory New' },
        { name: 'Stiletto Knife | Urban Masked', price: { min: 40.85, avg: 50.50 }, wear: 'Minimal Wear' },
        { name: 'Ursus Knife | Safari Mesh', price: { min: 35.65, avg: 45.25 }, wear: 'Field-Tested' }
      ]
    }
  ];

  const operators = [
    { name: 'Premium Skins', price: 49.99, rating: 4.4, verified: true, url: '#', featured: true },
    { name: 'Skin Bay', price: 52.99, rating: 4.1, verified: true, url: '#' },
    { name: 'Case King', price: 54.99, rating: 3.9, verified: false, url: '#' },
  ];

  const fairnessData = {
    algorithm: 'SHA-256',
    serverSeed: 'e3b0c44298fc1c149afbf4c8996fb924',
    clientSeed: 'user_generated_seed_12345',
    nonce: 1,
    explanation: 'Our provably fair system ensures each opening is cryptographically verifiable. The outcome is determined by combining server seed, client seed, and nonce.'
  };

  const calculateExpectedValue = () => {
    const price = parseFloat(calculatorPrice);
    const quantity = parseInt(calculatorQuantity);
    const expectedValue = price * boxData.stats.avgReturn * quantity;
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
            <a href="/mystery-boxes" className="text-muted-foreground hover:text-foreground">Mystery Boxes</a>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{boxData.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-card border-b">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to mystery boxes
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="relative">
                  <img
                    src={boxData.image || '/img/boxes/default-box.jpg'}
                    alt={boxData.name}
                    className="w-full md:w-80 aspect-square object-cover rounded-lg shadow-card"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{boxData.game}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 space-y-2">
                    {boxData.verified && (
                      <Badge className="bg-success text-success-foreground block">
                        <Verified className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {boxData.provablyFair && (
                      <Badge className="bg-gaming-blue text-white block">
                        <Hash className="w-3 h-3 mr-1" />
                        Provably Fair
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">{boxData.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{boxData.category}</Badge>
                    <Badge variant="outline">{boxData.type}</Badge>
                    <Badge className="bg-success text-success-foreground">
                      Odds: {boxData.oddsDisclosed}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ${boxData.currentPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Current price</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">
                        {(boxData.stats.avgReturn * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg return</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gaming-gold">
                        {boxData.stats.profitableOpens}%
                      </div>
                      <div className="text-sm text-muted-foreground">Profitable</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {boxData.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Released {new Date(boxData.releaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{boxData.stats.openCount.toLocaleString()} opens</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>By {boxData.operator}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Open */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Quick Open
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      ${boxData.currentPrice}
                    </div>
                    <div className="text-sm text-muted-foreground">per box</div>
                  </div>
                  <Button className="w-full bg-gradient-trust" size="lg">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Open Now
                  </Button>
                  <div className="text-xs text-center text-muted-foreground">
                    Guaranteed knife in every box
                  </div>
                </CardContent>
              </Card>

              {/* Key Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{boxData.stats.openCount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total opens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">
                        {boxData.stats.profitableOpens}%
                      </div>
                      <div className="text-xs text-muted-foreground">Profitable</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Expected value</span>
                      <span className="font-medium">${(boxData.currentPrice * boxData.stats.avgReturn).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>House edge</span>
                      <span className="font-medium">{((1 - boxData.stats.avgReturn) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min possible value</span>
                      <span className="font-medium">$35.65</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max possible value</span>
                      <span className="font-medium">$850.25</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {boxData.type === 'physical' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping & Returns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium">Free worldwide</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery time</span>
                      <span className="font-medium">7-14 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Returns</span>
                      <span className="font-medium">30 days</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Safety Note */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Mystery boxes involve chance. Results are cryptographically verifiable through our provably fair system.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="drops">Contents</TabsTrigger>
            <TabsTrigger value="fairness">Fairness</TabsTrigger>
            <TabsTrigger value="calculator">ROI Calculator</TabsTrigger>
            <TabsTrigger value="operators">Where to Buy</TabsTrigger>
            <TabsTrigger value="recent">Recent Wins</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Rarity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dropTable.map((rarity) => (
                      <div key={rarity.rarity}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={cn("font-medium text-sm", rarity.color)}>{rarity.rarity}</span>
                          <span className="text-sm">{rarity.probability}%</span>
                        </div>
                        <Progress value={rarity.probability} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Value Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Box cost</span>
                      <span className="font-medium">${boxData.currentPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected value</span>
                      <span className="font-medium">${(boxData.currentPrice * boxData.stats.avgReturn).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected profit</span>
                      <span className={cn(
                        "font-medium",
                        boxData.stats.avgReturn >= 1 ? "text-success" : "text-destructive"
                      )}>
                        ${(boxData.currentPrice * (boxData.stats.avgReturn - 1)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profit probability</span>
                      <span className="font-medium">{boxData.stats.profitableOpens}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Activity Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Opens today</span>
                      <span className="font-medium">847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg per hour</span>
                      <span className="font-medium">35</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Legendary drops today</span>
                      <span className="font-medium text-gaming-gold">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Biggest win today</span>
                      <span className="font-medium text-success">$750.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contents Tab */}
          <TabsContent value="drops" className="space-y-6">
            <div className="space-y-6">
              {dropTable.map((rarity) => (
                <Card key={rarity.rarity}>
                  <CardHeader>
                    <CardTitle className={cn("flex items-center justify-between", rarity.color)}>
                      <span>{rarity.rarity} Knives</span>
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
                            <div className="font-medium">${item.price.avg.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              ${item.price.min.toFixed(2)} - ${(item.price.avg * 1.2).toFixed(2)}
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

          {/* Fairness Tab */}
          <TabsContent value="fairness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Provably Fair System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">How it works</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fairnessData.explanation}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Algorithm:</span>
                        <span className="font-mono">{fairnessData.algorithm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Server Seed:</span>
                        <span className="font-mono text-xs">{fairnessData.serverSeed.substring(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client Seed:</span>
                        <span className="font-mono text-xs">{fairnessData.clientSeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nonce:</span>
                        <span className="font-mono">{fairnessData.nonce}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Verification Steps</h4>
                    <ol className="space-y-2 text-sm list-decimal list-inside">
                      <li className="text-muted-foreground">Generate your client seed before opening</li>
                      <li className="text-muted-foreground">Server commits to encrypted server seed</li>
                      <li className="text-muted-foreground">Result calculated using SHA-256</li>
                      <li className="text-muted-foreground">Server seed revealed for verification</li>
                      <li className="text-muted-foreground">Verify result using our verification tool</li>
                    </ol>
                    <Button variant="outline" className="w-full mt-4">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Verify Previous Results
                    </Button>
                  </div>
                </div>
                
                <Alert>
                  <Hash className="h-4 w-4" />
                  <AlertDescription>
                    All results are cryptographically verifiable. You can independently verify 
                    any opening using the provided seeds and our verification tool.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price">Box price ($)</Label>
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
                      <h4 className="font-medium mb-3">Expected Results</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total investment:</span>
                          <span className="font-medium">${calculations.totalCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected return:</span>
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
                          <span>ROI:</span>
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
                        Calculations based on current market prices and historical data. 
                        Individual results may vary significantly.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Where to Buy Tab */}
          <TabsContent value="operators" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Where to buy {boxData.name}</h3>
              <p className="text-muted-foreground">
                Compare prices across verified operators
              </p>
              
              <div className="grid gap-4">
                {operators.map((operator, index) => (
                  <Card key={index} className={operator.featured ? "ring-2 ring-primary" : ""}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <span className="font-semibold">{operator.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{operator.name}</span>
                            {operator.featured && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
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
                          <div className="text-sm text-muted-foreground">per box</div>
                        </div>
                        <Button className="bg-gradient-trust">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buy Box
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Recent Wins Tab */}
          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Recent Big Wins</h3>
              <p className="text-muted-foreground">
                Latest legendary and epic drops from {boxData.name}
              </p>
              
              <div className="grid gap-4">
                {[
                  { user: "Player***23", item: "Karambit | Fade", value: 750.00, time: "2 minutes ago", rarity: "Legendary" },
                  { user: "Skin***Hunt", item: "Butterfly Knife | Tiger Tooth", value: 580.25, time: "8 minutes ago", rarity: "Legendary" },
                  { user: "CS***Pro", item: "Bayonet | Doppler", value: 285.25, time: "15 minutes ago", rarity: "Epic" },
                  { user: "Trade***King", item: "M9 Bayonet | Crimson Web", value: 750.50, time: "23 minutes ago", rarity: "Legendary" },
                  { user: "Knife***Lord", item: "Huntsman Knife | Slaughter", value: 220.75, time: "35 minutes ago", rarity: "Epic" },
                ].map((win, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <span className="font-semibold text-sm">{win.user.substring(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{win.user}</div>
                          <div className="text-sm text-muted-foreground">{win.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{win.item}</div>
                          <Badge className={cn(
                            "text-xs",
                            win.rarity === "Legendary" ? "bg-gaming-gold text-white" : "bg-primary text-primary-foreground"
                          )}>
                            {win.rarity}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-success">${win.value}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxDetail;