import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, Package, Hash, Verified, TrendingUp, Calendar, Smartphone, Laptop, Watch, Headphones } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
const AppleMysteryBoxes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const itemsPerPage = 12;
  const totalBoxes = 45;
  const totalPages = Math.ceil(totalBoxes / itemsPerPage);
  const stats = {
    totalBoxes: 45,
    avgPrice: 347.50,
    verifiedBoxes: 42,
    newThisWeek: 3
  };
  const categories = [{
    name: 'All Apple Boxes',
    count: 45,
    href: '/mystery-boxes/apple'
  }, {
    name: 'iPhone Collection',
    count: 15,
    href: '/mystery-boxes/apple?type=iphone'
  }, {
    name: 'MacBook Mystery',
    count: 8,
    href: '/mystery-boxes/apple?type=macbook'
  }, {
    name: 'Apple Watch Box',
    count: 10,
    href: '/mystery-boxes/apple?type=watch'
  }, {
    name: 'AirPods & Audio',
    count: 7,
    href: '/mystery-boxes/apple?type=audio'
  }, {
    name: 'iPad Collection',
    count: 5,
    href: '/mystery-boxes/apple?type=ipad'
  }, {
    name: 'Accessories Pack',
    count: 12,
    href: '/mystery-boxes/apple?type=accessories'
  }, {
    name: 'Vintage Apple',
    count: 6,
    href: '/mystery-boxes/apple?vintage=true'
  }];
  const productFilters = ['iPhone', 'MacBook', 'Apple Watch', 'AirPods', 'iPad', 'Accessories'];
  const conditionFilters = ['New', 'Refurbished', 'Vintage', 'Mixed'];
  const sortOptions = [{
    value: 'newest',
    label: 'Newest First'
  }, {
    value: 'price-low',
    label: 'Price: Low to High'
  }, {
    value: 'price-high',
    label: 'Price: High to Low'
  }, {
    value: 'popular',
    label: 'Most Popular'
  }, {
    value: 'value',
    label: 'Best Expected Value'
  }, {
    value: 'rarity',
    label: 'Rarest Items'
  }];

  // Sample Apple mystery boxes data
  const appleBoxes = Array.from({
    length: itemsPerPage
  }, (_, i) => ({
    id: `apple-box-${i + 1}`,
    name: `${['iPhone Pro Max', 'MacBook Air', 'Apple Watch Ultra', 'AirPods Pro', 'iPad Pro'][i % 5]} Mystery Box ${i + 1}`,
    image: '/img/boxes/apple-mystery-box.jpg',
    category: ['iPhone', 'MacBook', 'Apple Watch', 'AirPods', 'iPad'][i % 5],
    condition: ['New', 'Refurbished', 'Vintage'][i % 3],
    price: Math.round((Math.random() * 1500 + 50) * 100) / 100,
    expectedValue: Math.round((Math.random() * 2000 + 100) * 100) / 100,
    verified: Math.random() > 0.15,
    authenticity: Math.random() > 0.1,
    profitRate: Math.round((Math.random() * 80 + 20) * 10) / 10,
    popularity: Math.floor(Math.random() * 3000) + 200,
    operator: ['Apple Direct', 'Tech Vault', 'iBox Mystery', 'Premium Apple', 'Elite Tech'][i % 5],
    highlights: [{
      name: 'iPhone 15 Pro Max',
      rarity: 'Ultra Rare',
      value: '$1,199'
    }, {
      name: 'MacBook Pro M3',
      rarity: 'Rare',
      value: '$1,999'
    }, {
      name: 'Apple Watch Series 9',
      rarity: 'Common',
      value: '$399'
    }]
  }));
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'ultra rare':
        return 'text-gaming-gold';
      case 'rare':
        return 'text-primary';
      case 'uncommon':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'iphone':
        return <Smartphone className="w-4 h-4" />;
      case 'macbook':
        return <Laptop className="w-4 h-4" />;
      case 'apple watch':
        return <Watch className="w-4 h-4" />;
      case 'airpods':
        return <Headphones className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/mystery-boxes" className="text-muted-foreground hover:text-foreground">Mystery Boxes</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Apple Mystery Boxes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🍎</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Apple Mystery Boxes</h1>
              </div>
              
              <p className="text-xl text-muted-foreground mb-8">
                Discover amazing Apple products in our curated mystery boxes. From the latest iPhones to vintage collectibles.
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto lg:mx-0 mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search Apple mystery boxes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{stats.totalBoxes}</div>
                  <div className="text-sm text-muted-foreground">Apple Boxes</div>
                </div>
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">${stats.avgPrice}</div>
                  <div className="text-sm text-muted-foreground">Avg. Price</div>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Box */}
            <div>
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                      Staff Pick
                    </Badge>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    {/* Box Image */}
                    <div className="w-20 h-20 bg-white/50 dark:bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <img src="/img/boxes/apple-mystery-box.jpg" alt="iPhone 15 Pro Mystery Box" className="w-16 h-16 object-cover rounded" />
                    </div>
                    
                    {/* Box Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">iPhone 15 Pro Mystery Box</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Premium Apple mystery box with guaranteed iPhone 15 Pro and exclusive accessories.
                      </p>
                    </div>
                  </div>

                  {/* Jackpot Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Top Jackpot Items</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>iPhone 15 Pro Max 1TB</span>
                        <span className="font-medium text-gaming-gold">$1,599</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>AirPods Pro (2nd Gen)</span>
                        <span className="font-medium text-primary">$249</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Apple Watch Ultra 2</span>
                        <span className="font-medium text-accent">$799</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-xl font-bold">$899</div>
                      <div className="text-xs text-muted-foreground">Box Price</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-xl font-bold text-green-600">$1,299</div>
                      <div className="text-xs text-muted-foreground">Expected Value</div>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link to="/mystery-boxes/iphone-15-pro-mystery">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 space-y-6">
            {/* Apple Product Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Apple Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {productFilters.map(product => (
                    <Badge 
                      key={product} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted text-xs"
                    >
                      {product}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Price Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider value={priceRange} onValueChange={setPriceRange} max={2000} min={0} step={50} className="w-full" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Level Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Low', 'Medium', 'High', 'Extreme'].map(risk => (
                    <div key={risk} className="flex items-center space-x-2">
                      <Checkbox id={risk} />
                      <Label htmlFor={risk} className="text-sm cursor-pointer">
                        {risk}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Returns Rate Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Returns Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500"></div>
                    <Slider 
                      defaultValue={[25]} 
                      max={100} 
                      min={0} 
                      step={5} 
                      className="absolute top-0 w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>Low Risk</span>
                    <span>High Risk</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Apple Mystery Boxes</h2>
                <p className="text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalBoxes)} of {totalBoxes} boxes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex rounded-lg border">
                  <Button variant={view === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setView('grid')} className="rounded-r-none">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant={view === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setView('list')} className="rounded-l-none">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Apple Boxes Grid */}
            <div className={cn("gap-6 mb-8", view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4')}>
              {appleBoxes.map(box => <Card key={box.id} className={cn("group hover:shadow-lg transition-all duration-300", view === 'list' && "flex flex-row")}>
                  <div className={cn(view === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square')}>
                    <img src={box.image} alt={box.name} className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className={cn("p-4 flex-1", view === 'list' && "flex flex-col justify-between")}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(box.category)}
                          <span className="ml-1">{box.category}</span>
                        </Badge>
                        {box.verified && <Verified className="w-4 h-4 text-primary" />}
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {box.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        By {box.operator}
                      </p>
                      
                      {/* Highlights */}
                      <div className="space-y-1 mb-4">
                        {box.highlights.slice(0, 2).map((highlight, idx) => <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="truncate">{highlight.name}</span>
                            <span className={cn("font-medium", getRarityColor(highlight.rarity))}>
                              {highlight.value}
                            </span>
                          </div>)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold">${box.price}</div>
                          <div className="text-xs text-muted-foreground">Box Price</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            ${box.expectedValue} EV
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {box.profitRate}% profit rate
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link to={`/mystery-boxes/${box.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Package className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              {Array.from({
              length: Math.min(5, totalPages)
            }, (_, i) => {
              const page = i + 1;
              return <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>;
            })}
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>;
};
export default AppleMysteryBoxes;