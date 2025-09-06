import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Grid, List, TrendingUp, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OperatorCard from '@/components/OperatorCard';
import FilterSort from '@/components/FilterSort';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { usePublicOperatorsQuery } from '@/hooks/usePublicOperatorsQuery';
import { OperatorListSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const OperatorsArchive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    games: [] as string[],
    modes: [] as string[],
    paymentMethods: [] as string[],
    kycRequired: null as boolean | null,
    verified: false,
    feeLevel: [] as string[],
    trustScore: [0, 5] as [number, number]
  });

  const itemsPerPage = 12;
  
  const { 
    data, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = usePublicOperatorsQuery({
    search: searchQuery,
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortBy,
    games: filters.games,
    modes: filters.modes,
    kycRequired: filters.kycRequired,
    verified: filters.verified
  });

  const operators = data?.operators || [];
  const totalCount = data?.totalCount || 0;
  const stats = data?.stats || { totalOperators: 0, avgTrustScore: 0, verifiedOperators: 0, newThisMonth: 0 };
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const categories = [
    { name: 'All Operators', count: 47, href: '/operators' },
    { name: 'Top Rated (4.5+)', count: 12, href: '/operators?rating=4.5' },
    { name: 'Low Fees', count: 18, href: '/operators?fees=low' },
    { name: 'Fast Payouts', count: 23, href: '/operators?payout=fast' },
    { name: 'No KYC Required', count: 15, href: '/operators?kyc=false' },
    { name: 'Crypto Friendly', count: 31, href: '/operators?payment=crypto' }
  ];

  const gameFilters = ['CS2', 'Rust', 'TF2', 'Dota2'];
  const modeFilters = ['Cases', 'Crash', 'Coinflip', 'Roulette', 'Upgrader', 'Contracts'];
  const feeFilters = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
            <span className="font-medium">Operators</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-card border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">CS2 Trading Operators</h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Compare {stats.totalOperators} verified CS2 trading platforms. Find the best rates, 
              security, and features for your skin trading needs.
            </p>
            
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search operators by name, features, or payment methods..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalOperators}</div>
                <div className="text-sm text-muted-foreground">Total operators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stats.avgTrustScore}</div>
                <div className="text-sm text-muted-foreground">Avg trust score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.verifiedOperators}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{stats.newThisMonth}</div>
                <div className="text-sm text-muted-foreground">New this month</div>
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

              {/* Advanced Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                  </CardTitle>
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

                  {/* Modes */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Trading Modes</Label>
                    <div className="space-y-2">
                      {modeFilters.map((mode) => (
                        <div key={mode} className="flex items-center space-x-2">
                          <Checkbox id={`mode-${mode}`} />
                          <Label htmlFor={`mode-${mode}`} className="text-sm">{mode}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Fee Level */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Fee Level</Label>
                    <div className="space-y-2">
                      {feeFilters.map((fee) => (
                        <div key={fee} className="flex items-center space-x-2">
                          <Checkbox id={`fee-${fee}`} />
                          <Label htmlFor={`fee-${fee}`} className="text-sm">{fee}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Other Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" />
                      <Label htmlFor="verified" className="text-sm">Verified only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="no-kyc" />
                      <Label htmlFor="no-kyc" className="text-sm">No KYC required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fast-payout" />
                      <Label htmlFor="fast-payout" className="text-sm">Fast payouts (&lt;1h)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-app" />
                      <Label htmlFor="mobile-app" className="text-sm">Mobile app available</Label>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>

              {/* Popular Comparisons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Comparisons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href="#" className="block text-sm text-accent hover:underline">
                    Clash.gg vs Key-Drop
                  </a>
                  <a href="#" className="block text-sm text-accent hover:underline">
                    Hellcase vs CSGOEmpire  
                  </a>
                  <a href="#" className="block text-sm text-accent hover:underline">
                    CSGORoll vs Gamdom
                  </a>
                  <a href="#" className="block text-sm text-accent hover:underline">
                    Best low-fee operators
                  </a>
                  <a href="#" className="block text-sm text-accent hover:underline">
                    Crypto-only platforms
                  </a>
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
                  {searchQuery ? `Search results for "${searchQuery}"` : 'All Operators'}
                </h2>
                <p className="text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} operators
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sort Options */}
            <FilterSort
              view={view}
              onViewChange={setView}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filters={filters}
              onFiltersChange={handleFilterChange}
            />

            {/* Results Grid/List */}
            {isLoading ? (
              <OperatorListSkeleton count={itemsPerPage} view={view} />
            ) : isError ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-destructive">Error loading operators: {error?.message}</p>
                <Button onClick={() => refetch()} variant="outline">
                  Try again
                </Button>
              </div>
            ) : operators.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No operators found.</p>
              </div>
            ) : (
              <div className={cn(
                "gap-6",
                view === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                  : "flex flex-col space-y-4"
              )}>
                {operators.map((operator) => (
                  <OperatorCard 
                    key={operator.id} 
                    operator={operator} 
                    view={view}
                  />
                ))}
              </div>
            )}

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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OperatorsArchive;
