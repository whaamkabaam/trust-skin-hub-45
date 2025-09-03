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

  const itemsPerPage = 12;
  const totalBoxes = 89;
  const totalPages = Math.ceil(totalBoxes / itemsPerPage);

  const stats = {
    totalBoxes: 89,
    avgPrice: 47.82,
    verifiedBoxes: 76,
    newThisWeek: 5
  };

  const categories = [
    { name: 'All Mystery Boxes', count: 89, href: '/mystery-boxes' },
    { name: 'Apple Mystery Boxes', count: 45, href: '/mystery-boxes/apple' },
    { name: 'Knife Collections', count: 23, href: '/mystery-boxes?type=knives' },
    { name: 'Weapon Skins', count: 31, href: '/mystery-boxes?type=weapons' },
    { name: 'Glove Collections', count: 12, href: '/mystery-boxes?type=gloves' },
    { name: 'Sticker Packs', count: 8, href: '/mystery-boxes?type=stickers' },
    { name: 'Premium Boxes', count: 15, href: '/mystery-boxes?premium=true' },
    { name: 'Provably Fair', count: 67, href: '/mystery-boxes?fair=true' },
    { name: 'Physical Items', count: 6, href: '/mystery-boxes?physical=true' }
  ];

  const gameFilters = ['CS2', 'Rust', 'TF2', 'Dota2'];
  const typeFilters = ['Knives', 'Weapons', 'Gloves', 'Stickers', 'Mixed'];
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
                  {/* Mobile filter content - same structure as desktop but vertical */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Categories</Label>
                    <div className="space-y-2">
                      {categories.slice(0, 6).map((category) => (
                        <a
                          key={category.name}
                          href={category.href}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm">{category.name}</span>
                          <Badge variant="outline" className="text-xs">{category.count}</Badge>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Games</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {gameFilters.map((game) => (
                        <div key={game} className="flex items-center space-x-2">
                          <Checkbox id={`mobile-game-${game}`} />
                          <Label htmlFor={`mobile-game-${game}`} className="text-sm">{game}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Features</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mobile-verified" />
                        <Label htmlFor="mobile-verified" className="text-sm flex items-center gap-1">
                          <Verified className="w-3 h-3" />
                          Verified only
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mobile-provably-fair" />
                        <Label htmlFor="mobile-provably-fair" className="text-sm flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Provably fair
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mobile-physical" />
                        <Label htmlFor="mobile-physical" className="text-sm flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          Physical items
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
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
                <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-6">
                  
                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Categories</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {categories.slice(0, 4).map((category) => (
                        <a
                          key={category.name}
                          href={category.href}
                          className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/50 transition-colors text-xs"
                        >
                          <span className="truncate">{category.name.replace('Mystery Boxes', '').replace('Boxes', '').trim()}</span>
                          <Badge variant="outline" className="text-xs ml-1">{category.count}</Badge>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
                    <div className="px-1">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={5}
                        className="w-full mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Games */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Games</Label>
                    <div className="space-y-2">
                      {gameFilters.map((game) => (
                        <div key={game} className="flex items-center space-x-2">
                          <Checkbox id={`game-${game}`} className="h-3 w-3" />
                          <Label htmlFor={`game-${game}`} className="text-xs">{game}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Box Types */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Box Type</Label>
                    <div className="space-y-2">
                      {typeFilters.slice(0, 4).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={`type-${type}`} className="h-3 w-3" />
                          <Label htmlFor={`type-${type}`} className="text-xs">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Features</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="verified-h" className="h-3 w-3" />
                        <Label htmlFor="verified-h" className="text-xs flex items-center gap-1">
                          <Verified className="w-3 h-3" />
                          Verified
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="fair-h" className="h-3 w-3" />
                        <Label htmlFor="fair-h" className="text-xs flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Provably Fair
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="physical-h" className="h-3 w-3" />
                        <Label htmlFor="physical-h" className="text-xs flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          Physical
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="positive-ev-h" className="h-3 w-3" />
                        <Label htmlFor="positive-ev-h" className="text-xs">Positive EV</Label>
                      </div>
                    </div>
                  </div>

                  {/* Top Operators */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Top Operators</Label>
                    <div className="space-y-1">
                      {['Premium Skins', 'Skin Bay', 'Case King', 'Box Empire'].map((operator) => (
                        <a
                          key={operator}
                          href={`/mystery-boxes?operator=${operator.toLowerCase().replace(' ', '-')}`}
                          className="block text-xs text-accent hover:underline py-1"
                        >
                          {operator}
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Active filters: <Badge variant="secondary" className="ml-1">0</Badge>
                  </div>
                  <Button variant="outline" size="sm">
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

      <Footer />
    </div>
  );
};

export default MysteryBoxesArchive;