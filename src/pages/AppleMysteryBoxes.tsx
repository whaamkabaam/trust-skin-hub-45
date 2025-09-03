import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, Package, Hash, Verified, TrendingUp, Calendar, Smartphone, Laptop, Watch, Headphones, ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppleHero from '@/components/AppleHero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
const AppleMysteryBoxes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [riskFilters, setRiskFilters] = useState<string[]>([]);
  const itemsPerPage = 12;
  const totalBoxes = 45;
  const totalPages = Math.ceil(totalBoxes / itemsPerPage);
  const stats = {
    totalBoxes: 45,
    avgPrice: 347.50,
    verifiedBoxes: 42,
    newThisWeek: 3
  };

  const sites = [
    { value: 'all', label: 'All Sites' },
    { value: 'apple-direct', label: 'Apple Direct' },
    { value: 'tech-vault', label: 'Tech Vault' },
    { value: 'ibox-mystery', label: 'iBox Mystery' },
    { value: 'premium-apple', label: 'Premium Apple' },
    { value: 'elite-tech', label: 'Elite Tech' },
    { value: 'apple-outlet', label: 'Apple Outlet' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'iphone', label: 'iPhone Collection' },
    { value: 'macbook', label: 'MacBook Mystery' },
    { value: 'apple-watch', label: 'Apple Watch Box' },
    { value: 'airpods', label: 'AirPods & Audio' },
    { value: 'ipad', label: 'iPad Collection' },
    { value: 'accessories', label: 'Accessories Pack' },
    { value: 'vintage', label: 'Vintage Apple' }
  ];

  const priceOptions = [
    { value: 'under-100', label: 'Under $100' },
    { value: '100-300', label: '$100 - $300' },
    { value: '300-500', label: '$300 - $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: 'over-1000', label: 'Over $1000' }
  ];

  const riskOptions = [
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' },
    { value: 'extreme', label: 'Extreme Risk' }
  ];

  const handlePriceToggle = (price: string) => {
    setPriceFilters(prev => 
      prev.includes(price) 
        ? prev.filter(p => p !== price)
        : [...prev, price]
    );
  };

  const handleRiskToggle = (risk: string) => {
    setRiskFilters(prev => 
      prev.includes(risk) 
        ? prev.filter(r => r !== risk)
        : [...prev, risk]
    );
  };

  const clearAllFilters = () => {
    setSelectedSite('all');
    setSelectedCategory('all');
    setPriceFilters([]);
    setRiskFilters([]);
  };

  const activeFilterCount = 
    (selectedSite !== 'all' ? 1 : 0) + 
    (selectedCategory !== 'all' ? 1 : 0) + 
    priceFilters.length + 
    riskFilters.length;

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
      <AppleHero />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Horizontal Filters */}
        <div className="mb-8">
          {/* Mobile Filters Toggle */}
          <div className="md:hidden mb-6">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters & Categories
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter Apple mystery boxes by your preferences
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Mobile Site Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Site</Label>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site.value} value={site.value}>
                            {site.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mobile Category Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mobile Price Toggles */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                    <div className="space-y-2">
                      {priceOptions.map((price) => (
                        <div key={price.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-price-${price.value}`}
                            checked={priceFilters.includes(price.value)}
                            onCheckedChange={() => handlePriceToggle(price.value)}
                          />
                          <Label htmlFor={`mobile-price-${price.value}`} className="text-sm">
                            {price.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Risk Toggles */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Risk Level</Label>
                    <div className="space-y-2">
                      {riskOptions.map((risk) => (
                        <div key={risk.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-risk-${risk.value}`}
                            checked={riskFilters.includes(risk.value)}
                            onCheckedChange={() => handleRiskToggle(risk.value)}
                          />
                          <Label htmlFor={`mobile-risk-${risk.value}`} className="text-sm">
                            {risk.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Horizontal Filters */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                  
                  {/* Site Dropdown */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">By Site</Label>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Sites" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site.value} value={site.value}>
                            {site.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">By Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Toggles */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">By Price</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {priceOptions.map((price) => (
                        <div key={price.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`price-${price.value}`} 
                            className="h-3 w-3"
                            checked={priceFilters.includes(price.value)}
                            onCheckedChange={() => handlePriceToggle(price.value)}
                          />
                          <Label htmlFor={`price-${price.value}`} className="text-xs">
                            {price.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Toggles */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">By Risk</Label>
                    <div className="space-y-2">
                      {riskOptions.map((risk) => (
                        <div key={risk.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`risk-${risk.value}`} 
                            className="h-3 w-3"
                            checked={riskFilters.includes(risk.value)}
                            onCheckedChange={() => handleRiskToggle(risk.value)}
                          />
                          <Label htmlFor={`risk-${risk.value}`} className="text-xs">
                            {risk.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Active filters: <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Popular Apple Items */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Popular Apple Items & Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
                {[
                  'iPhone 15 Pro Max', 'MacBook Pro M3', 'Apple Watch Ultra 2', 'AirPods Pro 2', 
                  'iPad Pro M2', 'Mac Studio', 'Studio Display', 'Magic Keyboard', 
                  'Apple Pencil', 'MagSafe'
                ].map((item) => (
                  <Link
                    key={item}
                    to={`/mystery-boxes/apple?tag=${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group"
                  >
                    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 h-full">
                      <CardContent className="p-3 text-center">
                        <div className="space-y-2">
                          <div className="h-8 w-8 mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Hash className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium text-xs group-hover:text-primary transition-colors leading-tight">
                            {item}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Apple Mystery Boxes'}
              </h2>
              <p className="text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalBoxes)} of {totalBoxes} boxes
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          <div className={cn(
            "gap-6",
            view === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
              : "flex flex-col space-y-4"
          )}>
            {appleBoxes.map((box) => (
              <Card key={box.id} className={cn(
                "group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1",
                view === 'list' && "flex-row"
              )}>
                <div className={cn(
                  "relative overflow-hidden",
                  view === 'list' ? "w-32 flex-shrink-0" : "aspect-square"
                )}>
                  <img 
                    src={box.image} 
                    alt={box.name} 
                    className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-200" 
                  />
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
                      {box.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="truncate">{highlight.name}</span>
                          <span className={cn("font-medium", getRarityColor(highlight.rarity))}>
                            {highlight.value}
                          </span>
                        </div>
                      ))}
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
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button 
                  key={page} 
                  variant={currentPage === page ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default AppleMysteryBoxes;