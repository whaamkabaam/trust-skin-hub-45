import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const categories = [{
    name: 'All Cases',
    count: 156,
    href: '/cases'
  }, {
    name: 'CS2 Cases',
    count: 89,
    href: '/cases?game=cs2'
  }, {
    name: 'Rust Cases',
    count: 23,
    href: '/cases?game=rust'
  }, {
    name: 'TF2 Cases',
    count: 31,
    href: '/cases?game=tf2'
  }, {
    name: 'Dota2 Cases',
    count: 13,
    href: '/cases?game=dota2'
  }, {
    name: 'New Releases',
    count: 8,
    href: '/cases?new=true'
  }, {
    name: 'Best Value',
    count: 24,
    href: '/cases?value=best'
  }, {
    name: 'Odds Disclosed',
    count: 98,
    href: '/cases?odds=disclosed'
  }];
  const gameFilters = ['CS2', 'Rust', 'TF2', 'Dota2'];
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
    label: 'Best Value'
  }];

  // Simulate filtered cases (extend sample data for demo)
  const allCases = [...sampleCases, ...Array.from({
    length: Math.max(0, itemsPerPage - sampleCases.length)
  }, (_, i) => ({
    ...sampleCases[i % sampleCases.length],
    id: `case-${i + sampleCases.length}`,
    name: `${sampleCases[i % sampleCases.length].name} ${i + 1}`,
    minPrice: Math.round((Math.random() * 10 + 0.5) * 100) / 100
  }))];
  const filteredCases = allCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">CS2 Cases</span>
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎮</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">CS2 Cases</h1>
              </div>
              
              <p className="text-xl text-muted-foreground mb-8">
                Analyze {stats.totalCases} CS2 cases with detailed drop tables, odds disclosure, and expected value calculations.
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto lg:mx-0 mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search CS2 cases..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{stats.totalCases}</div>
                  <div className="text-sm text-muted-foreground">Total Cases</div>
                </div>
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">${stats.avgPrice}</div>
                  <div className="text-sm text-muted-foreground">Avg. Price</div>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Case */}
            <div>
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                      Most Popular
                    </Badge>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    {/* Case Image */}
                    <div className="w-20 h-20 bg-white/50 dark:bg-black/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-3xl">📦</span>
                    </div>
                    
                    {/* Case Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">Revolution Case</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Latest CS2 case with premium weapon skins and verified drop rates.
                      </p>
                    </div>
                  </div>

                  {/* Featured Skins */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Featured Skins</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>AK-47 | Nightwish</span>
                        <span className="font-medium text-gaming-gold">$450</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>M4A4 | Temukau</span>
                        <span className="font-medium text-primary">$120</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>AWP | Duality</span>
                        <span className="font-medium text-accent">$85</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-xl font-bold">$2.50</div>
                      <div className="text-xs text-muted-foreground">Case Price</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-xl font-bold text-green-600">$3.20</div>
                      <div className="text-xs text-muted-foreground">Expected Value</div>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link to="/cases/revolution-case">View Case Details</Link>
                  </Button>
                </CardContent>
              </Card>
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
                  {categories.map(category => <a key={category.name} href={category.href} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="outline" className="text-xs">{category.count}</Badge>
                    </a>)}
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="px-2">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={0.5} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Min</Label>
                      <Input type="number" step="0.01" value={priceRange[0]} onChange={e => setPriceRange([parseFloat(e.target.value), priceRange[1]])} className="text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Max</Label>
                      <Input type="number" step="0.01" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseFloat(e.target.value)])} className="text-sm" />
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
                      {gameFilters.map(game => <div key={game} className="flex items-center space-x-2">
                          <Checkbox id={`game-${game}`} />
                          <Label htmlFor={`game-${game}`} className="text-sm">{game}</Label>
                        </div>)}
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
                    <Select value={filters.popularity} onValueChange={value => setFilters({
                    ...filters,
                    popularity: value
                  })}>
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

              {/* Risk Level Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500"></div>
                      <Slider defaultValue={[30]} max={100} min={0} step={10} className="absolute top-0 w-full" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                      <span>Extreme</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Returns Rate Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Returns Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500"></div>
                      <Slider value={[70, 90]} onValueChange={value => console.log('Returns rate:', value)} max={100} min={40} step={5} className="absolute top-0 w-full" />
                    </div>
                    
                    {/* Tick marks and labels */}
                    <div className="relative">
                      <div className="flex justify-between items-end h-4">
                        {/* Generate marks for 40% to 100% in 5% increments */}
                        {Array.from({
                        length: 13
                      }, (_, i) => {
                        const value = 40 + i * 5;
                        const isMainTick = value % 10 === 0;
                        return <div key={value} className="flex flex-col items-center">
                              <div className={`bg-muted-foreground ${isMainTick ? 'h-3 w-px' : 'h-1.5 w-px'}`}></div>
                              {isMainTick && <span className="text-xs text-muted-foreground mt-1">{value}%</span>}
                            </div>;
                      })}
                      </div>
                    </div>
                    
                    {/* Selected Range Display */}
                    <div className="text-center">
                      <span className="text-sm font-medium">70% - 90%</span>
                    </div>
                  </div>
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
                    {sortOptions.map(option => <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex items-center border rounded-lg">
                  <Button variant={view === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setView('grid')} className="rounded-r-none">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant={view === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setView('list')} className="rounded-l-none">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Cases Banner */}
            

            {/* Results Grid/List */}
            <div className={cn("gap-6", view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col space-y-4")}>
              {filteredCases.map(caseItem => <CaseCard key={caseItem.id} case={caseItem} view={view} />)}
            </div>

            {/* Load More / Pagination */}
            <div className="flex items-center justify-between pt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  Previous
                </Button>
                {Array.from({
                length: Math.min(5, totalPages)
              }, (_, i) => {
                const page = i + 1;
                return <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)}>
                      {page}
                    </Button>;
              })}
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default CasesArchive;