# API Reference

## 🔌 Data Fetching Hooks

### useUnifiedBoxData

Fetches mystery box data from all providers in parallel.

```typescript
import { useUnifiedBoxData } from '@/hooks/useUnifiedBoxData';

const { 
  summaryData,    // Aggregate statistics
  boxesData,      // Array of all boxes
  loading,        // Loading state
  error,          // Error message
  refetch         // Function to refetch data
} = useUnifiedBoxData(
  selectedProviders,  // string[] | undefined (undefined = all)
  limit              // number (default: 1000)
);
```

**Returns**:
- `summaryData`: UnifiedSummaryData
- `boxesData`: UnifiedBoxData[]
- `loading`: boolean
- `error`: string | null
- `refetch`: () => void

### useOperators

Fetches operator data from Trust Skin Hub database.

```typescript
import { useOperators } from '@/hooks/useOperators';

const { operators, loading, error } = useOperators();
```

### useMysteryBoxes

Legacy hook for mystery boxes (uses Trust Skin Hub database).

```typescript
import { useMysteryBoxes } from '@/hooks/useMysteryBoxes';

const { mysteryBoxes, loading, totalCount } = useMysteryBoxes({
  limit: 12,
  offset: 0,
  search: 'searchQuery',
  category: 'CS:GO',
  operator: 'rillabox'
});
```

---

## 📊 Data Types

### UnifiedBoxData

```typescript
interface UnifiedBoxData {
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  floor_rate_percent: number;
  category: string;
  tags: string[];
  jackpot_items: BoxItem[];
  unwanted_items: BoxItem[];
  all_items: BoxItem[];
  provider: 'rillabox' | 'hypedrop' | 'casesgg' | 'luxdrop';
  provider_config: ProviderConfig;
}
```

### BoxItem

```typescript
interface BoxItem {
  name: string;
  value: number;           // USD value
  drop_chance: number;     // Probability (0-1)
  image?: string;
  type?: string;
}
```

### UnifiedSummaryData

```typescript
interface UnifiedSummaryData {
  portfolio_average_ev_percent: number;
  best_box_by_ev_percent: string;
  best_box_ev_percent: number;
  worst_box_by_ev_percent: string;
  worst_box_ev_percent: number;
  portfolio_average_standard_deviation_percent: number;
  total_boxes: number;
  provider_breakdown: Record<string, number>;
}
```

### FilterState

```typescript
interface FilterState {
  categories: string[];
  providers: string[];
  priceRange: { min: number; max: number };
  expectedValueRange: { min: number; max: number };
  volatilityBuckets: ('Low' | 'Medium' | 'High')[];
  volatilityRange: { min: number; max: number };
  floorRateRange: { min: number; max: number };
  tags: string[];
  advanced: {
    jackpotValueRange: { min: number; max: number };
    itemCountRange: { min: number; max: number };
  };
}
```

---

## 🔧 Utility Functions

### Box Statistics

```typescript
import { 
  calculateBoxStatistics,
  calculateTotalItemsCount,
  formatBoxCount,
  formatItemCount 
} from '@/utils/boxStatisticsUtils';

// Calculate all statistics for a box
const stats = calculateBoxStatistics(box);

// Count total items across all boxes
const totalItems = calculateTotalItemsCount(boxesData);

// Format numbers
formatBoxCount(1405);    // "1.4k"
formatItemCount(50000);  // "50k"
```

### Hunt Calculations

```typescript
import { calculateHuntResults } from '@/utils/huntCalculations';

const huntResults = calculateHuntResults(
  boxesData,      // All boxes
  targetItemName  // Item to hunt
);

// Returns array of HuntResult sorted by efficiency
interface HuntResult {
  box: UnifiedBoxData;
  targetItem: BoxItem;
  targetingCost: number;       // Expected cost to get item
  rank: number;
  efficiency: 'Excellent' | 'Good' | 'Poor';
}
```

### Portfolio Strategies

```typescript
import { 
  generateSafeStrategy,
  generateValueStrategy,
  generateGrailStrategy,
  generateBalancedStrategy 
} from '@/utils/portfolioStrategies';

const strategy = generateSafeStrategy(boxesData, budget);

interface PortfolioStrategy {
  name: string;
  description: string;
  boxes: BoxAllocation[];
  totalCost: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  pros: string[];
  cons: string[];
  keyMetric: {
    label: string;
    value: string;
    tooltip: string;
  };
}
```

---

## 🎨 UI Component APIs

### VirtualizedBoxGrid

High-performance grid with virtual scrolling.

```typescript
import VirtualizedBoxGrid from '@/components/VirtualizedBoxGrid';

<VirtualizedBoxGrid 
  boxes={filteredBoxes}
  onBoxClick={(box) => console.log(box)}
  loading={false}
/>
```

**Props**:
- `boxes`: UnifiedBoxData[]
- `onBoxClick?`: (box: UnifiedBoxData) => void
- `loading?`: boolean

### FilterControls

Advanced filtering UI.

```typescript
import FilterControls from '@/components/FilterControls';

<FilterControls
  boxes={boxesData}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  sortBy={sortBy}
  onSortChange={setSortBy}
  filters={filters}
  onFiltersChange={setFilters}
  onClearFilters={clearFilters}
  activeFiltersCount={5}
/>
```

### HuntExperience

Item Hunter interface.

```typescript
import HuntExperience from '@/components/scouter/HuntExperience';

<HuntExperience 
  searchQuery={searchQuery}
  searchResults={searchResults}
  selectedItem={selectedItem}
  huntResults={huntResults}
  onSearchChange={handleSearch}
  onItemSelect={handleItemSelect}
  onClearSearch={handleClearSearch}
  getItemImage={getItemImage}
/>
```

---

## 📡 Supabase Client

### Main Client (Trust Skin Hub)

```typescript
import { supabase } from '@/integrations/supabase/client';

// Query operators
const { data, error } = await supabase
  .from('operators')
  .select('*')
  .eq('published', true);

// Query reviews
const { data: reviews } = await supabase
  .from('reviews')
  .select('*')
  .eq('operator_id', operatorId)
  .eq('status', 'approved');
```

### Temporary RillaBox Client (Mystery Boxes)

```typescript
// Currently in src/hooks/useUnifiedBoxData.ts
const supabase = createClient(
  'https://qsrkzgywbcbfnmailmsp.supabase.co',
  '[ANON_KEY]'
);

// Fetches from rillabox_boxes, hypedrop_boxes, etc.
```

---

## 🔐 Authentication & Authorization

### Admin Authentication

```typescript
import { supabase } from '@/integrations/supabase/client';

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@unpacked.gg',
  password: 'your_password'
});

// Check if user is admin
const { data: adminUser } = await supabase
  .from('admin_users')
  .select('*')
  .eq('email', user.email)
  .single();
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route path="/admin" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 📈 Analytics Formulas

### Expected Value (EV)

```typescript
// Formula
EV% = (Σ(item.value × item.drop_chance) / box_price) × 100

// Code
const calculateEV = (box: UnifiedBoxData): number => {
  const totalValue = box.all_items.reduce((sum, item) => 
    sum + (item.value * item.drop_chance), 
    0
  );
  return (totalValue / box.box_price) * 100;
};
```

### Volatility (Standard Deviation)

```typescript
// Formula
σ = √(Σ(item.value - μ)² × item.drop_chance)

// Where μ = expected value
const calculateVolatility = (box: UnifiedBoxData): number => {
  const expectedValue = box.all_items.reduce((sum, item) => 
    sum + (item.value * item.drop_chance), 
    0
  );
  
  const variance = box.all_items.reduce((sum, item) => 
    sum + Math.pow(item.value - expectedValue, 2) * item.drop_chance,
    0
  );
  
  return Math.sqrt(variance);
};
```

### Floor Rate

```typescript
// Formula
floor_rate% = (min_item_value / box_price) × 100

// Code
const calculateFloorRate = (box: UnifiedBoxData): number => {
  const minValue = Math.min(...box.all_items.map(item => item.value));
  return (minValue / box.box_price) * 100;
};
```

### Hunt Efficiency

```typescript
// Formula
efficiency = (drop_chance / (box_price / item_value)) × 100

// Code
const calculateEfficiency = (
  box: UnifiedBoxData,
  item: BoxItem
): number => {
  return (item.drop_chance / (box.box_price / item.value)) * 100;
};
```

---

## 🎯 Filter Logic

### Multi-Stage Filtering

```typescript
// 1. Category filter
const categoryFiltered = boxes.filter(box => 
  filters.categories.length === 0 || 
  filters.categories.includes(box.category)
);

// 2. Provider filter
const providerFiltered = categoryFiltered.filter(box =>
  filters.providers.length === 0 ||
  filters.providers.includes(box.provider)
);

// 3. Price range
const priceFiltered = providerFiltered.filter(box =>
  box.box_price >= filters.priceRange.min &&
  box.box_price <= filters.priceRange.max
);

// 4. EV range
const evFiltered = priceFiltered.filter(box =>
  box.expected_value_percent_of_price >= filters.expectedValueRange.min &&
  box.expected_value_percent_of_price <= filters.expectedValueRange.max
);

// 5. Volatility
const volatilityFiltered = evFiltered.filter(box =>
  filters.volatilityBuckets.length === 0 ||
  filters.volatilityBuckets.includes(box.volatility_bucket)
);

// 6. Search
const searchFiltered = volatilityFiltered.filter(box =>
  searchTerm === '' ||
  box.box_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  box.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
);
```

---

## 🎨 Styling Classes

### Mystery Box Specific

```css
/* Dot background */
.dot-background {
  background-image: radial-gradient(#a855f7 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Pulse animation */
.animate-pulse-subtle {
  animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Stats box pattern */
.box-stats-pattern-blurred {
  /* Diagonal stripe pattern with purple tint */
}
```

### Volatility Colors

```typescript
const getVolatilityColor = (volatility: string) => {
  switch (volatility) {
    case 'Low': return 'text-green-600 bg-green-50';
    case 'Medium': return 'text-yellow-600 bg-yellow-50';
    case 'High': return 'text-red-600 bg-red-50';
  }
};
```

### EV Colors

```typescript
const getEVColor = (ev: number) => {
  if (ev >= 100) return 'text-green-600';  // Positive
  if (ev >= 80) return 'text-yellow-600';   // Break-even
  return 'text-red-600';                     // Negative
};
```

---

## 🗄️ Database Queries

### Fetch All Mystery Boxes

```sql
-- RillaBox
SELECT * FROM rillabox_boxes 
ORDER BY expected_value_percent DESC 
LIMIT 100;

-- All providers
SELECT * FROM rillabox_boxes
UNION ALL
SELECT * FROM hypedrop_boxes
UNION ALL
SELECT * FROM casesgg_boxes
UNION ALL
SELECT * FROM luxdrop_boxes;
```

### Filter by Category

```sql
SELECT * FROM rillabox_boxes 
WHERE category = 'CS:GO' 
  AND expected_value_percent > 100
ORDER BY box_price;
```

### Search by Tags

```sql
SELECT * FROM rillabox_boxes 
WHERE tags @> '["high-value"]'::jsonb;
```

### Top Positive EV Boxes

```sql
SELECT 
  box_name,
  box_price,
  expected_value_percent,
  volatility_bucket
FROM rillabox_boxes 
WHERE expected_value_percent > 100
ORDER BY expected_value_percent DESC
LIMIT 10;
```

---

## 🎯 Example Usage

### Complete Mystery Box Page

```typescript
import { useUnifiedBoxData } from '@/hooks/useUnifiedBoxData';
import { useOptimizedFiltering } from '@/hooks/useOptimizedFiltering';
import VirtualizedBoxGrid from '@/components/VirtualizedBoxGrid';
import FilterControls from '@/components/FilterControls';

const MyPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('ev_desc');
  
  // Fetch data
  const { boxesData, loading } = useUnifiedBoxData();
  
  // Apply filters
  const filteredBoxes = useOptimizedFiltering(
    boxesData,
    filters,
    searchTerm
  );
  
  // Sort
  const sortedBoxes = useMemo(() => {
    return [...filteredBoxes].sort((a, b) => {
      if (sortBy === 'ev_desc') {
        return b.expected_value_percent_of_price - a.expected_value_percent_of_price;
      }
      // ... other sort options
    });
  }, [filteredBoxes, sortBy]);
  
  return (
    <div>
      <FilterControls 
        boxes={boxesData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <VirtualizedBoxGrid 
        boxes={sortedBoxes}
        loading={loading}
      />
    </div>
  );
};
```

### Item Search Example

```typescript
import { useItemSearch } from '@/hooks/useItemSearch';
import { useHuntReport } from '@/hooks/useHuntReport';
import HuntExperience from '@/components/scouter/HuntExperience';

const ScouterPage = () => {
  const { boxesData } = useUnifiedBoxData();
  
  const {
    searchQuery,
    searchResults,
    selectedItem,
    handleSearch,
    handleItemSelect,
    handleClearSearch
  } = useItemSearch(boxesData);
  
  const huntResults = useHuntReport(boxesData, selectedItem);
  
  return (
    <HuntExperience 
      searchQuery={searchQuery}
      searchResults={searchResults}
      selectedItem={selectedItem}
      huntResults={huntResults}
      onSearchChange={handleSearch}
      onItemSelect={handleItemSelect}
      onClearSearch={handleClearSearch}
      getItemImage={(name) => '/placeholder.png'}
    />
  );
};
```

---

## 🔄 State Management

### Filter State

```typescript
import { useFilterReducer } from '@/hooks/useFilterReducer';

const {
  filters,
  updateFilter,
  clearFilters,
  resetFilter
} = useFilterReducer(initialFilters);

// Update single filter
updateFilter('categories', ['CS:GO', 'Dota 2']);

// Clear all filters
clearFilters();

// Reset specific filter
resetFilter('priceRange');
```

### URL State Persistence

```typescript
import { useUrlFilters } from '@/hooks/useUrlFilters';

// Filters automatically sync with URL
// Share filtered views with URL params
const { filters, updateFilters } = useUrlFilters();
```

---

## 📝 Custom Hooks

### useDebounce

```typescript
import { useDebounce } from '@/hooks/useDebounce';

const debouncedValue = useDebounce(value, 300); // 300ms delay
```

### useIsMobile

```typescript
import { useIsMobile } from '@/hooks/use-mobile';

const isMobile = useIsMobile(); // boolean
```

---

## 🎯 Provider Configuration

### PROVIDER_CONFIGS

```typescript
const PROVIDER_CONFIGS = {
  rillabox: {
    tableName: 'rillabox_boxes',
    displayName: 'RillaBox',
    color: 'purple',
    gradient: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  hypedrop: {
    tableName: 'hypedrop_boxes',
    displayName: 'Hypedrop',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  casesgg: {
    tableName: 'casesgg_boxes',
    displayName: 'Cases.GG',
    color: 'green',
    gradient: 'from-green-600 to-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  luxdrop: {
    tableName: 'luxdrop_boxes',
    displayName: 'Luxdrop',
    color: 'amber',
    gradient: 'from-amber-600 to-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700'
  }
};
```

---

## 🚀 Performance Tips

### 1. Use Memoization

```typescript
const expensiveCalculation = useMemo(() => 
  calculateComplexStats(boxes),
  [boxes]  // Only recalculate when boxes change
);
```

### 2. Debounce User Input

```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
// Use debouncedSearch in filtering to reduce re-renders
```

### 3. Virtual Scrolling

```typescript
// Always use VirtualizedBoxGrid for >100 items
<VirtualizedBoxGrid boxes={boxes} />
// Not: {boxes.map(box => <BoxCard />)}
```

### 4. Lazy Loading

```typescript
// Load heavy pages lazily
const Boxfolio = lazy(() => import('./pages/Boxfolio'));

<Suspense fallback={<LoadingSpinner />}>
  <Boxfolio />
</Suspense>
```

---

**Last Updated**: October 2, 2025  
**Version**: 1.0.0

