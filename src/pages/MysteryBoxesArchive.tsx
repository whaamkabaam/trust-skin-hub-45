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
import { useMysteryBoxes } from '@/hooks/useMysteryBoxes';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const MysteryBoxesArchive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [riskFilters, setRiskFilters] = useState<string[]>([]);

  // Get real mystery boxes data
  const { mysteryBoxes, loading, totalCount } = useMysteryBoxes({
    limit: 12,
    offset: (currentPage - 1) * 12,
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    operator: selectedSite !== 'all' ? selectedSite : undefined
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);

  const stats = {
    totalBoxes: totalCount || 0,
    avgPrice: mysteryBoxes.length > 0 ? mysteryBoxes.reduce((sum, box) => sum + (box.price || 0), 0) / mysteryBoxes.length : 0,
    verifiedBoxes: mysteryBoxes.filter(box => box.verified).length,
    newThisWeek: mysteryBoxes.filter(box => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(box.release_date || box.created_at) > weekAgo;
    }).length
  };

  // Filter and search handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const sites = [
    { value: 'all', label: 'All Sites' },
    { value: 'premium-skins', label: 'Premium Skins' },
    { value: 'skin-bay', label: 'Skin Bay' },
    { value: 'case-king', label: 'Case King' },
    { value: 'box-empire', label: 'Box Empire' },
    { value: 'mystery-co', label: 'Mystery Co' },
    { value: 'skin-vault', label: 'Skin Vault' },
    { value: 'drop-zone', label: 'Drop Zone' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'value', label: 'Best Expected Value' },
    { value: 'profit', label: 'Highest Profit Rate' }
  ];

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
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Search results for "${searchQuery}"` : 'All Mystery Boxes'}
              </h2>
              <p className="text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount || 0)} of {totalCount || 0} boxes
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : mysteryBoxes.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No mystery boxes found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
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
                    {box.image_url ? (
                      <img 
                        src={box.image_url} 
                        alt={box.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-card rounded group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                        <div className="text-center">
                          <Package className="h-12 w-12 text-primary mx-auto mb-2" />
                          <p className="text-sm font-medium">Mystery Box</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {box.verified && (
                        <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                          <Verified className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {box.provably_fair && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          <Hash className="w-3 h-3 mr-1" />
                          Fair
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{box.name}</h3>
                      <p className="text-xs text-muted-foreground">{box.site_name || 'Mystery Box Site'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{box.game || 'CS2'}</Badge>
                      <Badge variant="outline" className="text-xs">{box.box_type || 'digital'}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">${box.price}</span>
                      </div>
                      {box.expected_value && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expected</span>
                          <span className="font-semibold text-success">${box.expected_value}</span>
                        </div>
                      )}
                      {box.profit_rate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Profit Rate</span>
                          <span className="font-semibold text-primary">{box.profit_rate}%</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-3" />

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Box Info</p>
                      <div className="space-y-1">
                        {box.highlights && box.highlights.length > 0 ? (
                          box.highlights.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                              <span className="truncate flex-1">{item.name}</span>
                              <span className={cn("font-medium ml-2", getRarityColor(item.rarity))}>
                                {item.rarity}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">No highlight items available</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button size="sm" className="w-full" asChild>
                        <Link to={`/mystery-box/${box.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxesArchive;