import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, List, Package, SlidersHorizontal } from 'lucide-react';
import { CategoryStatsBar } from '@/components/category-blocks/CategoryStatsBar';
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
import { FeaturedBoxCard } from '@/components/category-blocks/FeaturedBoxCard';
import React from 'react';

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

  // Helper function to normalize provider names from various data sources
  const normalizeProviderName = (box: any): string => {
    const PROVIDER_MAP: Record<string, string> = {
      'rillabox': 'RillaBox',
      'hypedrop': 'Hypedrop',
      'casesgg': 'Cases.GG',
      'luxdrop': 'LuxDrop',
    };

    // Priority 1: Direct provider field (from published content)
    if (box.provider) {
      const lower = box.provider.toLowerCase();
      return PROVIDER_MAP[lower] || box.provider;
    }

    // Priority 2: Check site_name
    if (box.site_name) {
      const lowerSiteName = box.site_name.toLowerCase();
      if (PROVIDER_MAP[lowerSiteName]) {
        return PROVIDER_MAP[lowerSiteName];
      }
      if (Object.values(PROVIDER_MAP).includes(box.site_name)) {
        return box.site_name;
      }
    }

    return 'Unknown';
  };

  // Extract boxes from published content blocks (source of truth for displayed boxes)
  const publishedBoxes = useMemo(() => {
    if (!publishedContent?.content_data) return [];
    
    const blocks = (publishedContent.content_data as any)?.blocks || [];
    const allBoxes: any[] = [];
    
    blocks.forEach((block: any) => {
      if (block.block_type === 'mystery_boxes' && block.block_data?.boxesData) {
        allBoxes.push(...block.block_data.boxesData);
      }
    });
    
    // Also add featured box if present
    if ((publishedContent.content_data as any)?.featuredBox) {
      allBoxes.push((publishedContent.content_data as any).featuredBox);
    }
    
    return allBoxes;
  }, [publishedContent]);

  // Calculate category statistics - use published boxes if available (source of truth)
  const categoryStats = useMemo(() => {
    // Use publishedBoxes if available (preferred source), otherwise fallback to mysteryBoxes
    const boxesSource = publishedBoxes.length > 0 ? publishedBoxes : mysteryBoxes;
    
    if (boxesSource.length === 0) return null;

    // Calculate prices from the source
    const prices = boxesSource
      .map(b => b.box_price || b.price || 0)
      .filter(p => p > 0);
    
    const avgPrice = prices.length > 0 
      ? prices.reduce((a, b) => a + b, 0) / prices.length 
      : category?.avg_price || 0;
    
    // Calculate EV values
    const evValues = boxesSource
      .map(b => {
        const price = b.box_price || b.price;
        const ev = b.expected_value_percent_of_price || 
                   (b.expected_value && price ? (b.expected_value / price) * 100 : null);
        return ev ? ev - 100 : 0;
      })
      .filter(ev => ev !== 0);
    
    const avgEV = evValues.length > 0 ? evValues.reduce((a, b) => a + b, 0) / evValues.length : 0;
    const bestEV = evValues.length > 0 ? Math.max(...evValues) : 0;

    // Count providers using normalized names from ACTUAL displayed boxes
    const providerCounts = boxesSource.reduce((acc, box) => {
      const provider = normalizeProviderName(box);
      if (provider !== 'Unknown') {
        acc[provider] = (acc[provider] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topProviders = Object.entries(providerCounts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topProvider = topProviders[0]?.name || 'Various';

    return {
      priceRange: {
        min: category?.price_min || (prices.length > 0 ? Math.min(...prices) : 0),
        max: category?.price_max || (prices.length > 0 ? Math.max(...prices) : 0)
      },
      avgPrice,
      avgEV,
      bestEV,
      topProviders,
      topProvider
    };
  }, [category, mysteryBoxes, publishedBoxes]);

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

  // Filter boxes based on site and price
  const filteredBoxes = useMemo(() => {
    let boxes = mysteryBoxes;

    // Apply site filter
    if (selectedSite !== 'all') {
      boxes = boxes.filter(box => {
        const provider = normalizeProviderName(box);
        const providerSlug = provider.toLowerCase().replace(/\./g, '');
        return providerSlug === selectedSite;
      });
    }

    // Apply price filters
    if (priceFilters.length > 0) {
      boxes = boxes.filter(box => {
        return priceFilters.some(filter => {
          const price = box.price || 0;
          switch (filter) {
            case 'under-25': return price < 25;
            case '25-50': return price >= 25 && price < 50;
            case '50-100': return price >= 50 && price < 100;
            case '100-200': return price >= 100 && price < 200;
            case 'over-200': return price >= 200;
            default: return true;
          }
        });
      });
    }

    // Risk filters would require volatility data from provider tables
    // Skipping for now as MysteryBox type doesn't include volatility_bucket

    return boxes;
  }, [mysteryBoxes, selectedSite, priceFilters]);

  // Generate sections dynamically from published content
  const sections = React.useMemo(() => {
    const baseSections = [
      { id: 'at-a-glance', title: 'At a Glance' }
    ];

    // Add content block sections - only include text blocks with headings that should be in nav
    if (publishedContent?.content_data && (publishedContent.content_data as any)?.blocks) {
      const blockSections = (publishedContent.content_data as any).blocks
        .filter((block: any) => {
          // Only filter out explicitly hidden blocks
          if (block.is_visible === false) return false;
          
          // Include text/table blocks that have headings (unless explicitly excluded from nav)
          if (block.block_type === 'text' || block.block_type === 'table') {
            return block.block_data?.heading && block.block_data?.includeInNav !== false;
          }
          
          // Include mystery_boxes blocks
          if (block.block_type === 'mystery_boxes') {
            return true;
          }
          
          return false;
        })
        .map((block: any) => {
          if ((block.block_type === 'text' || block.block_type === 'table') && block.block_data?.heading) {
            const headingSlug = block.block_data.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return {
              id: headingSlug,
              title: block.block_data.heading
            };
          }
          
          // Better fallback titles for mystery_boxes blocks
        if (block.block_type === 'mystery_boxes') {
          // Match the ID generation logic in BlockRenderer
          const blockId = block.block_data?.heading 
            ? block.block_data.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            : `block-mystery_boxes-${block.order_number}`;
          
          return {
            id: blockId,
            title: block.block_data?.heading || 'Mystery Boxes'
          };
        }
          
          // Generic fallback (should rarely be used)
          return {
            id: `block-${block.block_type}-${block.order_number}`,
            title: block.block_data?.heading || `${block.block_type.replace('_', ' ')} Section`
          };
        });
      return [...baseSections, ...blockSections];
    }

    return baseSections;
  }, [publishedContent]);

  // Generate dynamic sites list from actual mystery box data
  const sites = useMemo(() => {
    const uniqueProviders = new Set<string>();
    mysteryBoxes.forEach(box => {
      const provider = normalizeProviderName(box);
      if (provider !== 'Unknown') {
        uniqueProviders.add(provider);
      }
    });
    
    const providerOptions = Array.from(uniqueProviders)
      .sort()
      .map(provider => ({
        value: provider.toLowerCase().replace(/\./g, ''),
        label: provider
      }));

    return [
      { value: 'all', label: 'All Sites' },
      ...providerOptions
    ];
  }, [mysteryBoxes]);

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
      
      <EnhancedBreadcrumbs 
        categoryName={category.name} 
        categorySlug={category.slug}
      />

      <div id="at-a-glance">
        <CompactHero
          category={category}
          boxCount={mysteryBoxes.length}
          priceRange={categoryStats?.priceRange}
          avgEV={categoryStats?.avgEV}
          topProviders={categoryStats?.topProviders}
        />
      </div>

      {/* Full-width Featured Box Section */}
      {(publishedContent?.content_data as any)?.featuredBox && (
        <section className="container mx-auto px-4 py-6">
          <FeaturedBoxCard 
            box={(publishedContent?.content_data as any).featuredBox} 
            layout="horizontal-full"
          />
        </section>
      )}

      {categoryStats && categoryStats.avgPrice !== undefined && (
        <CategoryStatsBar 
          stats={{
            totalBoxes: mysteryBoxes.length,
            avgPrice: categoryStats.avgPrice || 0,
            bestEV: categoryStats.bestEV || 0
          }}
        />
      )}

      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {/* At a Glance Summary Card */}
            {categoryStats && (
              <div className="mb-8">
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
          {publishedContent?.content_data && (publishedContent.content_data as any)?.blocks && (publishedContent.content_data as any).blocks.length > 0 ? (
            <div className="space-y-12 mb-12">
              {(publishedContent.content_data as any).blocks
                .filter((block: any) => block.is_visible)
                .sort((a: any, b: any) => a.order_number - b.order_number)
                .map((block: any) => (
                  <BlockRenderer key={block.id} block={block} />
                ))}
            </div>
          ) : (
            <>
              {/* Collapsible Filters Section */}
              <section id="filters" className="mb-8">
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
                </section>

                {/* Results Header */}
                <section id="mystery-boxes">
                  <SectionHeader 
                    title={`${category.name} Mystery Boxes`}
                    description={`Showing ${mysteryBoxes.length} verified mystery boxes`}
                  />

                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div className="text-sm text-muted-foreground">
                    Found <strong>{filteredBoxes.length}</strong> boxes
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
                ) : filteredBoxes.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No boxes found</h3>
                    <p className="text-muted-foreground mb-6">
                      No {category.name.toLowerCase()} mystery boxes match your filters.
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
                    {filteredBoxes.map((box, index) => (
                      <MysteryBoxCard 
                        key={box.id} 
                        box={transformToRillaBoxFormat(box)}
                        index={index}
                        isVisible={true}
                      />
                    ))}
                  </div>
                )}

                </section>

                {/* Category Description */}
                {category.description_rich && (
                  <div id="about" className="mt-12">
                    <SectionHeader 
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
              bestEV: categoryStats.bestEV || 0
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
