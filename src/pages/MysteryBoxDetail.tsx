import { Link } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MysteryBoxDetail = () => {
  const boxData = {
    id: 'reduce-reuse-recycle',
    name: 'Reduce Reuse Recycle',
    image: 'https://img.clash.gg/standard/37b1802370605b917d28cefb82e68d3a.png',
    price: 0.10,
    expectedValue: 84.9,
    volatility: 241.0,
    floorRate: 10.0,
    lossChance: 86.9,
    tags: ['Parody', 'Novelty', 'Junk', 'Misc', 'Budget'],
    operator: {
      name: 'Cases.GG',
      logo: 'https://wordpress-1472941-5579290.cloudwaysapps.com/hub/images/ccc8c7f7-53cc-41ac-8e6d-0fe13f968fd3.png'
    }
  };

  const allItems = [
    { name: 'Glass Jar with a Lid', dropRate: 0.5, value: 2.15 },
    { name: 'Plastic Hanger', dropRate: 0.75, value: 1.45 },
    { name: 'Stunning Trump Win LA Times Newspaper', dropRate: 1, value: 0.99 },
    { name: 'Empty Pizza Box', dropRate: 1.1, value: 0.80 },
    { name: 'Cardboard Box', dropRate: 1.3, value: 0.60 },
    { name: 'Tin Can', dropRate: 1.3, value: 0.40 },
    { name: 'Empty Yogurt Containers', dropRate: 1.8, value: 0.22 },
    { name: 'Empty Egg Carton', dropRate: 1.8, value: 0.20 },
    { name: 'Plastic Utensils', dropRate: 1.8, value: 0.19 },
    { name: 'Plastic Water Bottle', dropRate: 2, value: 0.10 },
    { name: 'Aluminum Can Tab', dropRate: 3, value: 0.07 },
    { name: 'Empty Toilet Paper Roll', dropRate: 5, value: 0.06 },
    { name: 'Plastic Grocery Bag', dropRate: 5, value: 0.05 },
    { name: 'Plastic Bottle Cap', dropRate: 9.9, value: 0.03 },
    { name: 'Wine Cork', dropRate: 12, value: 0.02 },
    { name: 'Sock with a Hole', dropRate: 12, value: 0.02 },
    { name: 'Paper Clip', dropRate: 20, value: 0.01 },
    { name: 'Aquafina Water Bottle Label', dropRate: 20, value: 0.01 }
  ];

  const jackpotItems = {
    dropOdds: 2.3,
    evShare: 31.5,
    oddsEvRatio: 0.071,
    valueRange: { min: 0.99, max: 2.15 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back to Hub */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/mystery-boxes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Link>
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="w-4 h-4" />
          <span>Hub</span>
          <span>/</span>
          <span className="text-foreground">{boxData.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-4">{boxData.name}</h1>
        
        {/* Operator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img 
            src={boxData.operator.logo} 
            alt={boxData.operator.name} 
            className="w-8 h-8 rounded"
          />
          <span className="font-semibold text-purple-600">{boxData.operator.name}</span>
          <ExternalLink className="w-4 h-4" />
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-2" />
            Read Review
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Image and Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mystery Box Image */}
            <div className="flex justify-center">
              <img 
                src={boxData.image} 
                alt={boxData.name}
                className="w-80 h-auto rounded-lg"
              />
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">${boxData.price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Mystery Box Price</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{boxData.expectedValue}% (EV)</div>
                  <div className="text-sm text-muted-foreground">Expected Value</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{boxData.volatility}%</div>
                  <div className="text-sm text-muted-foreground">Volatility</div>
                  <div className="text-xs text-muted-foreground mt-1">Measure of risk and unpredictability</div>
                </CardContent>
              </Card>
            </div>

            {/* All Tags */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">All Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Parody</Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Novelty</Badge>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">Junk</Badge>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">Misc</Badge>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Budget</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{boxData.floorRate}%</div>
                  <div className="text-sm text-muted-foreground">Floor Rate</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{boxData.lossChance}%</div>
                  <div className="text-sm text-muted-foreground">Loss Chance</div>
                </CardContent>
              </Card>
            </div>

            {/* All Items Table */}
            <div>
              <h3 className="text-xl font-bold mb-4">All Items (by Drop Rate & Value)</h3>
              <div className="space-y-2">
                {allItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-purple-600">
                        {item.dropRate}%
                      </Badge>
                      <span className="font-bold text-green-600">
                        ${item.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Jackpot Items */}
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-purple-800 dark:text-purple-200">Jackpot Items</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{jackpotItems.dropOdds}%</div>
                    <div className="text-xs text-muted-foreground">Jackpot Items Drop Odds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{jackpotItems.evShare}%</div>
                    <div className="text-xs text-muted-foreground">Jackpot Items EV Share</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{jackpotItems.oddsEvRatio}x</div>
                    <div className="text-xs text-muted-foreground">Odds/EV Ratio</div>
                  </div>
                </div>
                
                <div className="text-xs text-center text-muted-foreground mb-4">
                  Jackpot Items Value Range: ${jackpotItems.valueRange.min.toFixed(2)} - ${jackpotItems.valueRange.max.toFixed(2)}
                </div>

                {/* Top Jackpot Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-200 rounded flex items-center justify-center">
                        <span className="text-xs">📦</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Glass Jar with a Lid</div>
                        <div className="text-xs text-purple-600">Drop Rate: 0.5%</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">$2.15</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-200 rounded flex items-center justify-center">
                        <span className="text-xs">🪝</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Plastic Hanger</div>
                        <div className="text-xs text-purple-600">Drop Rate: 0.75%</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">$1.45</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-200 rounded flex items-center justify-center">
                        <span className="text-xs">📰</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Stunning Trump Win LA Times Newspaper</div>
                        <div className="text-xs text-purple-600">Drop Rate: 1%</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">$0.99</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Items */}
            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-orange-200 rounded flex items-center justify-center">
                    <span className="text-xs">⚠️</span>
                  </div>
                  <h3 className="font-bold text-orange-800 dark:text-orange-200">Common Items</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600">52.0%</div>
                    <div className="text-xs text-muted-foreground">Common Items Drop Odds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600">6.4%</div>
                    <div className="text-xs text-muted-foreground">Common Items EV Share</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600">8.1x</div>
                    <div className="text-xs text-muted-foreground">Odds/EV Ratio</div>
                  </div>
                </div>
                
                <div className="text-xs text-center text-muted-foreground mb-4">
                  Common Items Value Range: $0.01 - $0.02
                </div>

                {/* Common Items List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-200 rounded flex items-center justify-center">
                        <span className="text-xs">📎</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Paper Clip</div>
                        <div className="text-xs text-orange-600">Drop Rate: 20%</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">$0.01</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-200 rounded flex items-center justify-center">
                        <span className="text-xs">🏷️</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Aquafina Water Bottle Label</div>
                        <div className="text-xs text-orange-600">Drop Rate: 20%</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">$0.01</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-amber-200 rounded flex items-center justify-center">
                        <span className="text-xs">🍷</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Wine Cork</div>
                        <div className="text-xs text-orange-600">Drop Rate: 12%</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">$0.02</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxDetail;