import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, Package, Hash, Verified, TrendingUp, Calendar, ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MysteryBoxHero from '@/components/MysteryBoxHero';
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

const MysteryBoxesArchive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [riskFilters, setRiskFilters] = useState<string[]>([]);

  const itemsPerPage = 12;
  const totalBoxes = 89;
  const totalPages = Math.ceil(totalBoxes / itemsPerPage);

  const stats = {
    totalBoxes: 89,
    avgPrice: 47.82,
    verifiedBoxes: 76,
    newThisWeek: 5
  };

  const sites = [
    { value: '', label: 'All Sites' },
    { value: 'premium-skins', label: 'Premium Skins' },
    { value: 'skin-bay', label: 'Skin Bay' },
    { value: 'case-king', label: 'Case King' },
    { value: 'box-empire', label: 'Box Empire' },
    { value: 'mystery-co', label: 'Mystery Co' },
    { value: 'skin-vault', label: 'Skin Vault' },
    { value: 'drop-zone', label: 'Drop Zone' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'knives', label: 'Knife Collections' },
    { value: 'weapons', label: 'Weapon Skins' },
    { value: 'gloves', label: 'Glove Collections' },
    { value: 'stickers', label: 'Sticker Packs' },
    { value: 'mixed', label: 'Mixed Items' },
    { value: 'premium', label: 'Premium Boxes' },
    { value: 'apple', label: 'Apple Products' }
  ];

  const priceOptions = [
    { value: 'under-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: 'over-200', label: 'Over $200' }
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
    setSelectedSite('');
    setSelectedCategory('');
    setPriceFilters([]);
    setRiskFilters([]);
  };

  const activeFilterCount = 
    (selectedSite ? 1 : 0) + 
    (selectedCategory ? 1 : 0) + 
    priceFilters.length + 
    riskFilters.length;
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'value', label: 'Best Expected Value' },
    { value: 'profit', label: 'Highest Profit Rate' }
  ];

  // Sample mystery boxes data
  const mysteryBoxes = Array.from({ length: itemsPerPage }, (_, i) => ({
    id: `box-${i + 1}`,
    name: `${['Premium Knife', 'Elite Weapon', 'Legendary Skin', 'Rare Glove', 'Ultimate'][i % 5]} Collection ${i + 1}`,
    image: '/img/boxes/mystery-box.jpg',
    game: 'CS2',
    category: ['Knives', 'Weapons', 'Gloves', 'Stickers', 'Mixed'][i % 5],
    type: i % 4 === 0 ? 'physical' : 'digital',
    price: Math.round((Math.random() * 150 + 10) * 100) / 100,
    expectedValue: Math.round((Math.random() * 120 + 15) * 100) / 100,
    verified: Math.random() > 0.2,
    provablyFair: Math.random() > 0.3,
    profitRate: Math.round((Math.random() * 60 + 10) * 10) / 10,
    popularity: Math.floor(Math.random() * 5000) + 100,
    operator: ['Premium Skins', 'Skin Bay', 'Case King', 'Box Empire', 'Mystery Co'][i % 5],
    highlights: [
      { name: 'Karambit | Fade', rarity: 'Legendary' },
      { name: 'AK-47 | Redline', rarity: 'Epic' },
      { name: 'AWP | Asiimov', rarity: 'Rare' }
    ]
  }));

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-gaming-gold';
      case 'epic': return 'text-primary';
      case 'rare': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Mystery Boxes</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <MysteryBoxHero />

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
                    Filter mystery boxes by your preferences
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

        {/* Main Content */}
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Search results for "${searchQuery}"` : 'All Mystery Boxes'}
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
            {mysteryBoxes.map((box) => (
              <Card key={box.id} className={cn(
                "group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1",
                view === 'list' && "flex-row"
              )}>
                <div className={cn(
                  "relative overflow-hidden",
                  view === 'list' ? "w-32 flex-shrink-0" : "aspect-square"
                )}>
                  <div className="w-full h-full bg-gradient-card rounded group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎁</div>
                      <div className="font-semibold text-sm">{box.name}</div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">{box.game}</Badge>
                  </div>
                  <div className="absolute top-3 right-3 space-y-1">
                    {box.verified && (
                      <Badge className="bg-success text-success-foreground block text-xs">
                        <Verified className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {box.provablyFair && (
                      <Badge className="bg-gaming-blue text-white block text-xs">
                        <Hash className="w-3 h-3 mr-1" />
                        Fair
                      </Badge>
                    )}
                  </div>
                  {box.type === 'physical' && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-warning text-warning-foreground text-xs">
                        <Package className="w-3 h-3 mr-1" />
                        Physical
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className={cn("p-4", view === 'list' && "flex-1")}>
                  {/* Header */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{box.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">${box.price}</span>
                        <Badge variant="outline" className="text-xs">{box.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">EV: ${box.expectedValue}</div>
                        <div className={cn(
                          "text-xs",
                          box.profitRate > 30 ? "text-success" : 
                          box.profitRate > 10 ? "text-warning" : "text-destructive"
                        )}>
                          {box.profitRate}% profit rate
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">By {box.operator}</div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Featured Items</h4>
                    <div className="space-y-1">
                      {box.highlights.slice(0, view === 'list' ? 2 : 3).map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="truncate">{item.name}</span>
                          <span className={cn("text-xs font-medium", getRarityColor(item.rarity))}>
                            {item.rarity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 p-2 bg-muted/30 rounded-lg text-xs">
                    <div className="text-center">
                      <div className="font-medium">{box.popularity.toLocaleString()}</div>
                      <div className="text-muted-foreground">Opens</div>
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        "font-medium",
                        box.expectedValue > box.price ? "text-success" : "text-destructive"
                      )}>
                        {((box.expectedValue / box.price) * 100).toFixed(0)}%
                      </div>
                      <div className="text-muted-foreground">Return</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-trust">
                      Open Box
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
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
                    variant={page === currentPage ? 'default' : 'outline'}
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
        </div>
      </section>

      {/* Supporting Content for SEO */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* About Mystery Boxes */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Know About Mystery Boxes</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover the world of mystery box opening with our comprehensive guide to the best platforms, 
                transparent odds, and proven fair systems in 2024.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* What Are Mystery Boxes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    What Are Mystery Boxes?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Mystery boxes are digital containers that hold randomized virtual items, typically skins, 
                    weapons, or collectibles from popular games like CS2, Rust, and Dota2. Each box has 
                    predetermined odds and potential rewards.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Transparent odds disclosure</li>
                      <li>Provably fair algorithms</li>
                      <li>Real-time market value tracking</li>
                      <li>Instant item delivery</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* How to Choose */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    How to Choose the Right Box
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Selecting the right mystery box requires understanding expected value (EV), 
                    house edge, and your risk tolerance. Our platform provides detailed analytics 
                    for every box.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Consider These Factors:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Expected value vs. box price</li>
                      <li>Operator reputation and verification</li>
                      <li>Odds transparency and fairness</li>
                      <li>Withdrawal terms and conditions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Popular Games Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">Popular Games & Categories</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="text-center p-4">
                  <div className="text-3xl mb-2">🔫</div>
                  <h4 className="font-semibold mb-2">Counter-Strike 2</h4>
                  <p className="text-sm text-muted-foreground">
                    Premium weapon skins, knife collections, and rare gloves from the world's most popular FPS.
                  </p>
                  <Badge variant="outline" className="mt-2">31 boxes</Badge>
                </Card>
                
                <Card className="text-center p-4">
                  <div className="text-3xl mb-2">🔨</div>
                  <h4 className="font-semibold mb-2">Rust</h4>
                  <p className="text-sm text-muted-foreground">
                    Survival game skins including weapons, clothing, and building materials.
                  </p>
                  <Badge variant="outline" className="mt-2">18 boxes</Badge>
                </Card>
                
                <Card className="text-center p-4">
                  <div className="text-3xl mb-2">⚔️</div>
                  <h4 className="font-semibold mb-2">Dota 2</h4>
                  <p className="text-sm text-muted-foreground">
                    Immortal treasures, rare sets, and exclusive cosmetics for heroes.
                  </p>
                  <Badge variant="outline" className="mt-2">12 boxes</Badge>
                </Card>
                
                <Card className="text-center p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold mb-2">Team Fortress 2</h4>
                  <p className="text-sm text-muted-foreground">
                    Unusual hats, strange weapons, and vintage items from the classic shooter.
                  </p>
                  <Badge variant="outline" className="mt-2">8 boxes</Badge>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Are mystery boxes gambling?</h4>
                    <p className="text-muted-foreground text-sm">
                      Mystery boxes involve chance-based outcomes, similar to trading card packs. 
                      We only feature platforms that clearly disclose odds and implement provably fair systems. 
                      Always gamble responsibly and within your means.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">What does "provably fair" mean?</h4>
                    <p className="text-muted-foreground text-sm">
                      Provably fair systems use cryptographic algorithms that allow players to verify 
                      the randomness and fairness of each outcome. This ensures operators cannot 
                      manipulate results in their favor.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">How do you calculate expected value?</h4>
                    <p className="text-muted-foreground text-sm">
                      Expected Value (EV) is calculated by multiplying each possible item's market value 
                      by its probability of being won, then summing all possibilities. An EV above 
                      the box price indicates positive expected returns.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Can I withdraw items immediately?</h4>
                    <p className="text-muted-foreground text-sm">
                      Withdrawal policies vary by operator. Most platforms allow immediate withdrawals 
                      for verified accounts, while others may have minimum withdrawal amounts or 
                      waiting periods. Check each operator's terms before opening boxes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Safety & Tips */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">Safety Tips & Best Practices</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Verified className="w-5 h-5 text-success" />
                      Choosing Verified Operators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Look for official licensing and regulatory compliance</li>
                      <li>• Check user reviews and community feedback</li>
                      <li>• Verify transparent odds disclosure</li>
                      <li>• Ensure secure payment processing</li>
                      <li>• Confirm responsive customer support</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Hash className="w-5 h-5 text-primary" />
                      Understanding Risk Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Set a budget and stick to it</li>
                      <li>• Never chase losses with bigger bets</li>
                      <li>• Understand house edge and profit margins</li>
                      <li>• Take regular breaks from box opening</li>
                      <li>• Consider entertainment value over profit</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Market Trends */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Market Trends & Statistics</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="p-4">
                  <div className="text-3xl font-bold text-primary mb-2">${stats.avgPrice}</div>
                  <div className="text-sm text-muted-foreground">Average Box Price</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-success mb-2">{stats.verifiedBoxes}</div>
                  <div className="text-sm text-muted-foreground">Verified Platforms</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-accent mb-2">2.4M+</div>
                  <div className="text-sm text-muted-foreground">Monthly Openings</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-warning mb-2">15.2%</div>
                  <div className="text-sm text-muted-foreground">Avg House Edge</div>
                </div>
              </div>
              <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
                Our data is updated daily from verified operators and community sources. 
                We track over {stats.totalBoxes} mystery boxes across multiple games and platforms 
                to provide accurate, real-time market insights.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxesArchive;