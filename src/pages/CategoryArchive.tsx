import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, List, Package, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import { useMysteryBoxes } from '@/hooks/useMysteryBoxes';
import { SEOHead } from '@/components/SEOHead';
import { usePublishedCategoryContent } from '@/hooks/usePublishedCategoryContent';
import { BlockRenderer } from '@/components/category-blocks-renderer/BlockRenderer';
import { CompactHero } from '@/components/category-blocks/CompactHero';
import { EnhancedBreadcrumbs } from '@/components/category-blocks/EnhancedBreadcrumbs';
import { CategorySidebar } from '@/components/category-blocks/CategorySidebar';
import { SectionHeader } from '@/components/category-blocks/SectionHeader';
import { AtAGlanceCard } from '@/components/category-blocks/AtAGlanceCard';
import { EnhancedMysteryBoxCard } from '@/components/category-blocks/EnhancedMysteryBoxCard';
import MysteryBoxCard from '@/components/MysteryBoxCard';
import { transformToRillaBoxFormat } from '@/utils/mysteryBoxDataTransformer';

const CategoryArchive = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { getCategoryBySlug } = useCategories();
  const { mysteryBoxes, loading, getMysteryBoxesByCategory } = useMysteryBoxes();
  const { content: publishedContent, loading: contentLoading } = usePublishedCategoryContent(categorySlug || '');
  
  const [category, setCategory] = useState<any>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('all');
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [riskFilters, setRiskFilters] = useState<string[]>([]);

  // Calculate stats from mystery boxes data
  const categoryStats = useMemo(() => {
    if (!mysteryBoxes || mysteryBoxes.length === 0) return null;
    
    const prices = mysteryBoxes.map(b => b.price).filter(p => p > 0);
    const evs = mysteryBoxes.map(b => b.expected_value && b.price ? (b.expected_value / b.price) * 100 : 0).filter(ev => ev > 0);
    const verifiedCount = mysteryBoxes.filter(b => b.verified).length;
    
    // Count boxes per operator
    const operatorCounts = mysteryBoxes.reduce((acc, box) => {
      if (box.operator?.name) {
        acc[box.operator.name] = (acc[box.operator.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topProviders = Object.entries(operatorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      avgEV: evs.length > 0 ? evs.reduce((a, b) => a + b, 0) / evs.length : 0,
      bestROI: evs.length > 0 ? Math.max(...evs) - 100 : 0,
      verificationRate: (verifiedCount / mysteryBoxes.length) * 100,
      topProviders,
      topProvider: topProviders[0]?.name || 'Various'
    };
  }, [mysteryBoxes]);

  // Find best value box
  const bestValueBox = useMemo(() => {
    if (!mysteryBoxes || mysteryBoxes.length === 0) return null;
    return mysteryBoxes.reduce((best, current) => {
      const currentROI = current.expected_value && current.price 
        ? ((current.expected_value / current.price) * 100) - 100 
        : -Infinity;
      const bestROI = best.expected_value && best.price 
        ? ((best.expected_value / best.price) * 100) - 100 
        : -Infinity;
      return currentROI > bestROI ? current : best;
    }, mysteryBoxes[0]);
  }, [mysteryBoxes]);

  // Define sections for sidebar navigation
  const sections = [
    { id: 'at-a-glance', title: 'At a Glance' },
    { id: 'filters', title: 'Filter & Sort' },
    { id: 'mystery-boxes', title: 'All Mystery Boxes' },
    { id: 'about', title: `About ${category?.name || 'Category'}` },
  ];

  const sites = [
    { value: 'all', label: 'All Sites' },
    { value: 'premium-skins', label: 'Premium Skins' },
    { value: 'skin-bay', label: 'Skin Bay' },
    { value: 'case-king', label: 'Case King' },
    { value: 'box-empire', label: 'Box Empire' },
    { value: 'mystery-co', label: 'Mystery Co' },
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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'value', label: 'Best Expected Value' },
    { value: 'profit', label: 'Highest Profit Rate' }
  ];

  useEffect(() => {
    const loadCategory = async () => {
      if (categorySlug) {
        const categoryData = await getCategoryBySlug(categorySlug);
        setCategory(categoryData);
        
        if (categoryData) {
          getMysteryBoxesByCategory(categorySlug);
        }
      }
    };
    
    loadCategory();
  }, [categorySlug, getCategoryBySlug, getMysteryBoxesByCategory]);

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
    setPriceFilters([]);
    setRiskFilters([]);
  };

  const activeFilterCount = 
    (selectedSite !== 'all' ? 1 : 0) + 
    priceFilters.length + 
    riskFilters.length;

  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <Link to="/mystery-boxes" className="text-primary hover:underline">
              ← Back to Mystery Boxes
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`Best ${category.name} Mystery Boxes (${monthYear})`}
        description={category.description_rich || `Discover the best ${category.name} mystery boxes with verified items, fair odds, and worldwide shipping.`}
        canonicalUrl={`/mystery-boxes/${category.slug}`}
      />
      
      <Header />
      
      {/* Enhanced Breadcrumbs */}
      <EnhancedBreadcrumbs 
        categoryName={category.name} 
        categorySlug={category.slug}
      />

      {/* Compact Hero Section */}
      <CompactHero
        category={category}
        boxCount={mysteryBoxes.length}
        priceRange={categoryStats?.priceRange}
        avgEV={categoryStats?.avgEV}
        topProviders={categoryStats?.topProviders}
      />

      {/* Main Content with Sidebar */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* At a Glance Summary Card */}
            {categoryStats && (
              <div id="at-a-glance" className="mb-8 scroll-mt-24">
                <AtAGlanceCard 
                  categoryName={category.name}
                  stats={{
                    totalBoxes: mysteryBoxes.length,
                    priceRange: categoryStats.priceRange,
                    avgEV: categoryStats.avgEV,
                    topProvider: categoryStats.topProvider
                  }}
                />
              </div>
            )}
            {/* Render Published Content Blocks if available */}
            {publishedContent?.content_data?.blocks && publishedContent.content_data.blocks.length > 0 ? (
              <div className="space-y-12 mb-12">
                {publishedContent.content_data.blocks
                  .filter((block: any) => block.is_visible)
                  .sort((a: any, b: any) => a.order_number - b.order_number)
                  .map((block: any) => (
                    <BlockRenderer key={block.id} block={block} />
                  ))}
              </div>
            ) : (
              <>
                {/* Collapsible Filters Section */}
                <div id="filters" className="mb-8 scroll-mt-24">
                  <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full mb-4 justify-between">
                        <div className="flex items-center">
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          <span>Show Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                        </div>
                        {activeFilterCount > 0 && (
                          <Badge variant="secondary">{activeFilterCount} active</Badge>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Card>
                        <CardContent className="p-6">
                          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
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
                                    <Label htmlFor={`price-${price.value}`} className="text-xs cursor-pointer">
                                      {price.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

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
                                    <Label htmlFor={`risk-${risk.value}`} className="text-xs cursor-pointer">
                                      {risk.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {activeFilterCount > 0 && (
                            <div className="flex items-center justify-end mt-6 pt-4 border-t">
                              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                                Clear all filters
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Results Header */}
                <SectionHeader 
                  id="mystery-boxes" 
                  title={`${category.name} Mystery Boxes`}
                  description={`Showing ${mysteryBoxes.length} verified mystery boxes`}
                />

                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div className="text-sm text-muted-foreground">
                    Found <strong>{mysteryBoxes.length}</strong> boxes
                  </div>

                  <div className="flex items-center gap-4">
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

                {/* Mystery Boxes Grid */}
                {loading ? (
                  <div className="text-center py-16">
                    <div className="text-lg">Loading {category.name.toLowerCase()} mystery boxes...</div>
                  </div>
                ) : mysteryBoxes.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No boxes found</h3>
                    <p className="text-muted-foreground mb-6">
                      No {category.name.toLowerCase()} mystery boxes are currently available.
                    </p>
                    <Link to="/mystery-boxes">
                      <Button variant="outline">Browse All Categories</Button>
                    </Link>
                  </div>
                ) : (
                  <div className={cn(
                    "gap-6 mb-12",
                    view === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "flex flex-col space-y-4"
                  )}>
                    {mysteryBoxes.map((box, index) => (
                      <MysteryBoxCard 
                        key={box.id} 
                        box={transformToRillaBoxFormat(box)}
                        index={index}
                        isVisible={true}
                      />
                    ))}
                  </div>
                )}

                {/* Category Description */}
                {category.description_rich && (
                  <div id="about" className="mt-12 scroll-mt-24">
                    <SectionHeader 
                      id="about-section"
                      title={`About ${category.name} Mystery Boxes`}
                    />
                    <Card>
                      <CardContent className="p-6">
              <div className="prose prose-sm max-w-none">
                <p>{category.description_rich}</p>
              </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar Navigation */}
          <CategorySidebar 
            sections={sections}
            quickStats={categoryStats ? {
              avgPrice: categoryStats.avgPrice,
              bestROI: categoryStats.bestROI,
              verificationRate: categoryStats.verificationRate
            } : undefined}
            topProviders={categoryStats?.topProviders}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryArchive;