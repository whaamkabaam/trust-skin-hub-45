import { useState } from 'react';
import { Search, Filter, Grid, List, TrendingUp, Calendar, BarChart3, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseCard from '@/components/CaseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleCases } from '@/lib/sample-data';
import { cn } from '@/lib/utils';

const CasesArchive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filters, setFilters] = useState({
    games: [] as string[],
    verified: false,
    oddsDisclosed: false,
    priceMin: 0,
    priceMax: 100,
    popularity: 'all'
  });

  const itemsPerPage = 12;
  const totalCases = 156; // Simulated total
  const totalPages = Math.ceil(totalCases / itemsPerPage);

  const stats = {
    totalCases: 156,
    avgPrice: 2.47,
    verifiedCases: 142,
    newThisWeek: 8
  };

  const categories = [
    { name: 'All Cases', count: 156, href: '/cases' },
    { name: 'CS2 Cases', count: 89, href: '/cases?game=cs2' },
    { name: 'Rust Cases', count: 23, href: '/cases?game=rust' },
    { name: 'TF2 Cases', count: 31, href: '/cases?game=tf2' },
    { name: 'Dota2 Cases', count: 13, href: '/cases?game=dota2' },
    { name: 'New Releases', count: 8, href: '/cases?new=true' },
    { name: 'Best Value', count: 24, href: '/cases?value=best' },
    { name: 'Odds Disclosed', count: 98, href: '/cases?odds=disclosed' }
  ];

  const gameFilters = ['CS2', 'Rust', 'TF2', 'Dota2'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'value', label: 'Best Value' }
  ];

  // Simulate filtered cases (extend sample data for demo)
  const allCases = [
    ...sampleCases,
    ...Array.from({ length: Math.max(0, itemsPerPage - sampleCases.length) }, (_, i) => ({
      ...sampleCases[i % sampleCases.length],
      id: `case-${i + sampleCases.length}`,
      name: `${sampleCases[i % sampleCases.length].name} ${i + 1}`,
      minPrice: Math.round((Math.random() * 10 + 0.5) * 100) / 100
    }))
  ];

  const filteredCases = allCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">CS2 Cases</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-card border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">CS2 Cases & Containers</h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Analyze {stats.totalCases} CS2 cases with detailed drop tables, odds disclosure, 
              and expected value calculations. Make informed decisions before opening.
            </p>
            
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search cases by name, skins, or collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalCases}</div>
                <div className="text-sm text-muted-foreground">Total cases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">${stats.avgPrice}</div>
                <div className="text-sm text-muted-foreground">Avg price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.verifiedCases}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{stats.newThisWeek}</div>
                <div className="text-sm text-muted-foreground">New this week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="outline" className="text-xs">{category.count}</Badge>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Min</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Max</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Games */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Games</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {gameFilters.map((game) => (
                        <div key={game} className="flex items-center space-x-2">
                          <Checkbox id={`game-${game}`} />
                          <Label htmlFor={`game-${game}`} className="text-sm">{game}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Verification & Odds */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" />
                      <Label htmlFor="verified" className="text-sm">Verified only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="odds-disclosed" />
                      <Label htmlFor="odds-disclosed" className="text-sm">Odds disclosed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="new-release" />
                      <Label htmlFor="new-release" className="text-sm">New releases</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="profitable" />
                      <Label htmlFor="profitable" className="text-sm">Positive expected value</Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Popularity */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Popularity</Label>
                    <Select value={filters.popularity} onValueChange={(value) => 
                      setFilters({ ...filters, popularity: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All cases</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="popular">Most popular</SelectItem>
                        <SelectItem value="underrated">Underrated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span>Revolution Case +12% this week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span>Recoil Case most opened today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>8 new cases this month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>47K cases opened yesterday</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'All Cases'}
                </h2>
                <p className="text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCases)} of {totalCases} cases
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

            {/* Featured Cases Banner */}
            <Card className="bg-gradient-hero text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Featured This Week</h3>
                    <p className="text-white/90">Revolution Case - New skins with verified odds</p>
                  </div>
                  <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    View Case
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Grid/List */}
            <div className={cn(
              "gap-6",
              view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "flex flex-col space-y-4"
            )}>
              {filteredCases.map((caseItem) => (
                <CaseCard 
                  key={caseItem.id} 
                  case={caseItem} 
                  view={view}
                />
              ))}
            </div>

            {/* Load More / Pagination */}
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CasesArchive;