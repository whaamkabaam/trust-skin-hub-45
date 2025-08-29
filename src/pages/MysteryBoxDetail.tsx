import { Link } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';
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

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Title and Operator */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{boxData.name}</h1>
          <div className="flex items-center gap-3">
            <img 
              src={boxData.operator.logo} 
              alt={boxData.operator.name} 
              className="w-8 h-8 rounded"
            />
            <span className="font-semibold">{boxData.operator.name}</span>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Read Review
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Image */}
          <div>
            <img 
              src={boxData.image} 
              alt={boxData.name}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Right Side - Stats */}
          <div className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">${boxData.price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Mystery Box Price</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{boxData.expectedValue}% (EV)</div>
                  <div className="text-sm text-muted-foreground">Expected Value</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">{boxData.volatility}%</div>
                  <div className="text-sm text-muted-foreground">Volatility</div>
                </CardContent>
              </Card>
            </div>

            {/* All Tags */}
            <div>
              <h4 className="font-semibold mb-3">All Tags</h4>
              <div className="flex flex-wrap gap-2">
                {boxData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-destructive">{boxData.floorRate}%</div>
                  <div className="text-sm text-muted-foreground">Floor Rate</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-bold text-destructive">{boxData.lossChance}%</div>
                  <div className="text-sm text-muted-foreground">Loss Chance</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* All Items Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">All Items (by Drop Rate & Value)</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-center">Drop Rate</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{item.dropRate}%</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${item.value.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Jackpot Items Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Jackpot Items</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{jackpotItems.dropOdds}%</div>
                <div className="text-sm text-muted-foreground">Jackpot Items Drop Odds</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{jackpotItems.evShare}%</div>
                <div className="text-sm text-muted-foreground">Jackpot Items EV Share</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{jackpotItems.oddsEvRatio}x</div>
                <div className="text-sm text-muted-foreground">Odds/EV Ratio</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Jackpot Items Value Range: ${jackpotItems.valueRange.min.toFixed(2)} - ${jackpotItems.valueRange.max.toFixed(2)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxDetail;