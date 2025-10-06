# Mystery Box Hub - Complete Feature Guide

## 📦 Overview

The Mystery Box Hub is a comprehensive analytics platform integrated into Trust Skin Hub, providing data-driven insights for CS2 mystery boxes across multiple providers.

## ✨ Features

### 1. Mystery Box Hub Dashboard
**Route**: `/mystery-boxes`

**Features**:
- Browse 1,400+ mystery boxes from 4 providers
- Real-time analytics and statistics
- Advanced filtering and search
- Virtual scrolling for performance
- Beautiful purple dot background design

**Components**:
- `src/pages/MysteryBoxHub.tsx` - Main hub page
- `src/components/BoxfolioDashboard.tsx` - Dashboard with filters and grid
- `src/components/VirtualizedBoxGrid.tsx` - Performance-optimized grid
- `src/components/CompactStats.tsx` - Compact statistics display

### 2. Item Hunter (Scouter)
**Integrated in Hub** (dedicated page coming soon)

**Features**:
- Search for specific items across all boxes
- Efficiency rankings (best box to get item)
- Cost-to-acquire calculations
- Drop chance analysis

**Components**:
- `src/components/scouter/HuntExperience.tsx` - Main scouter interface
- `src/components/scouter/ItemSearchInput.tsx` - Search input
- `src/components/scouter/ItemSearchResults.tsx` - Results display
- `src/components/scouter/HuntResults.tsx` - Hunt report
- `src/components/scouter/HuntStrategyCard.tsx` - Strategy cards

**Hooks**:
- `src/hooks/useItemSearch.ts` - Item search logic
- `src/hooks/useHuntReport.ts` - Hunt calculations

### 3. Advanced Filtering System

**Components**:
- `src/components/FilterControls.tsx` - Main filter UI
- `src/components/FilterPanel.tsx` - Filter panel (desktop/mobile)
- `src/components/filters/AdvancedFilters.tsx` - Advanced filter options
- `src/components/filters/CategoryFilter.tsx` - Category selection
- `src/components/filters/ProviderFilter.tsx` - Provider selection
- `src/components/filters/VolatilityFilter.tsx` - Volatility filtering
- `src/components/filters/RangeFilter.tsx` - Price/EV range sliders
- `src/components/filters/TagsFilter.tsx` - Tag filtering
- `src/components/MobileFilterChips.tsx` - Mobile filter chips

**Hooks**:
- `src/hooks/useOptimizedFiltering.ts` - Filtering logic with performance optimization
- `src/hooks/useFilterReducer.ts` - Filter state management
- `src/hooks/useUrlFilters.ts` - URL state persistence
- `src/hooks/useFilterPersistence.ts` - LocalStorage persistence
- `src/hooks/useQuickFilters.ts` - Quick filter presets
- `src/hooks/useFilterPresets.ts` - Saved filter presets

### 4. Analytics & Calculations

**Utilities**:
- `src/utils/boxStatistics.ts` - Core analytics (EV, volatility, floor rate)
- `src/utils/boxStatisticsUtils.ts` - Helper functions
- `src/utils/memoizedCalculations.ts` - Performance-optimized calculations
- `src/utils/outcomeAnalysis.ts` - Outcome scenario analysis
- `src/utils/huntCalculations.ts` - Item hunting calculations
- `src/utils/scouterCalculations.ts` - Scouter scoring algorithms
- `src/utils/probabilityCalculations.ts` - Drop probability math

**Formulas**:
```typescript
// Expected Value
EV% = (Σ(item.value × item.drop_chance) / box_price) × 100

// Volatility (Standard Deviation)
σ = √(Σ(item.value - μ)² × item.drop_chance)

// Floor Rate
floor_rate% = (min_item_value / box_price) × 100

// Efficiency (Scouter)
efficiency = (drop_chance / (box_price / item_value)) × 100
```

### 5. Portfolio Strategies (Boxfolio)

**Coming Soon** - Pre-built portfolio allocations:
- Safe & Steady ($25)
- Balanced Growth ($100)
- Value Hunter ($200)
- Grail Chaser ($500)

**Utilities**:
- `src/utils/portfolioStrategies/safeStrategy.ts`
- `src/utils/portfolioStrategies/valueStrategy.ts`
- `src/utils/portfolioStrategies/grailStrategy.ts`
- `src/utils/portfolioStrategies/balancedStrategy.ts`

---

## 🗄️ Data Structure

### Mystery Box Schema

```typescript
interface MysteryBox {
  // Basic Info
  box_name: string;
  box_price: number;
  box_image: string;
  box_url: string;
  category: string;
  tags: string[];
  
  // Analytics
  expected_value_percent: number;     // EV as % of box price
  ev_to_price_ratio: number;          // EV / price ratio
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  floor_rate_percent: number;
  
  // Items
  all_items: BoxItem[];              // All possible items
  jackpot_items: BoxItem[];          // High-value items
  unwanted_items: BoxItem[];         // Low-value items
  
  // Meta
  data_source: string;               // Provider identifier
  last_updated: timestamp;
  
  // Computed (client-side)
  provider: 'rillabox' | 'hypedrop' | 'casesgg' | 'luxdrop';
  provider_config: ProviderConfig;
}

interface BoxItem {
  name: string;
  value: number;           // Item value in currency
  drop_chance: number;     // Drop probability (0-1)
  image?: string;
  type?: string;
}

interface ProviderConfig {
  displayName: string;
  color: string;
  gradient: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}
```

### Provider Configurations

```typescript
const PROVIDER_CONFIGS = {
  rillabox: {
    displayName: 'RillaBox',
    color: 'purple',
    gradient: 'from-purple-600 to-purple-700'
  },
  hypedrop: {
    displayName: 'Hypedrop',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-700'
  },
  casesgg: {
    displayName: 'Cases.GG',
    color: 'green',
    gradient: 'from-green-600 to-green-700'
  },
  luxdrop: {
    displayName: 'Luxdrop',
    color: 'amber',
    gradient: 'from-amber-600 to-amber-700'
  }
};
```

---

## 🔄 Data Flow

### 1. Data Fetching

```typescript
// src/hooks/useUnifiedBoxData.ts

// Fetches from all 4 provider tables in parallel
const { summaryData, boxesData, loading, error } = useUnifiedBoxData(
  undefined,  // selectedProviders (undefined = all)
  5000        // limit (max boxes to fetch)
);
```

### 2. Filtering

```typescript
// src/hooks/useOptimizedFiltering.ts

// Multi-stage filtering pipeline
const filteredBoxes = useOptimizedFiltering(
  boxesData,
  filters,        // FilterState object
  searchTerm      // Search query
);
```

### 3. Item Search

```typescript
// src/hooks/useItemSearch.ts

const {
  searchQuery,
  searchResults,
  selectedItem,
  handleSearch,
  handleItemSelect
} = useItemSearch(boxesData);
```

### 4. Hunt Report

```typescript
// src/hooks/useHuntReport.ts

// Calculates best boxes to get specific item
const huntResults = useHuntReport(boxesData, selectedItem);
```

---

## 🎯 Filter System

### Filter State Structure

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

### Sort Options

- `price_asc`: Price Low to High
- `price_desc`: Price High to Low
- `ev_asc`: Expected Value Low to High
- `ev_desc`: Expected Value High to Low
- `volatility_asc`: Volatility Low to High
- `volatility_desc`: Volatility High to Low
- `floor_rate_desc`: Floor Rate High to Low
- `name_asc`: Name A-Z

---

## 🎨 UI Components Reference

### Mystery Box Specific

| Component | Purpose | Location |
|-----------|---------|----------|
| BoxfolioDashboard | Main dashboard with filters | `src/components/` |
| VirtualizedBoxGrid | Performance grid | `src/components/` |
| CompactStats | Stats display | `src/components/` |
| FilterControls | Filter UI | `src/components/` |
| HuntExperience | Item scouter | `src/components/scouter/` |
| SkeletonStatsCard | Loading state | `src/components/` |

### Shared UI Components (shadcn/ui)

All mystery box features use shared UI components from `src/components/ui/`:
- Card, Button, Badge, Input, Select
- Slider, Checkbox, Sheet, Dialog
- Tooltip, ScrollArea, Separator
- And 40+ more...

---

## 📈 Performance Optimizations

### 1. Virtual Scrolling
```typescript
// Renders only visible items
// Handles 1,400+ boxes without lag
<VirtualizedBoxGrid 
  boxes={filteredBoxes}
  itemHeight={400}  // Estimated item height
/>
```

### 2. Memoized Calculations
```typescript
// Caches expensive calculations
const stats = useMemo(() => 
  calculateBoxStatistics(box),
  [box]
);
```

### 3. Debounced Search
```typescript
// Delays search execution until user stops typing
const debouncedSearch = useDebounce(searchTerm, 300);
```

### 4. Optimized Filtering
```typescript
// Multi-stage pipeline for efficient filtering
// 1. Category filter
// 2. Provider filter
// 3. Numeric range filters
// 4. Search filter
// 5. Sort
```

---

## 🔧 Configuration

### Supabase Configuration

**Current** (Development - connects to RillaBox):
```typescript
// src/hooks/useUnifiedBoxData.ts
const supabase = createClient(
  'https://qsrkzgywbcbfnmailmsp.supabase.co',
  '[RILLABOX_ANON_KEY]'
);
```

**After Migration** (Production - use Trust Skin Hub):
```typescript
// src/hooks/useUnifiedBoxData.ts
import { supabase } from '@/integrations/supabase/client';
// Remove temporary client, use existing Trust Skin Hub client
```

### Environment Variables

```env
# Trust Skin Hub Supabase (main database)
VITE_SUPABASE_PROJECT_ID=aclxqriujtkpqceqtesg
VITE_SUPABASE_URL=https://aclxqriujtkpqceqtesg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[YOUR_KEY]
```

---

## 🐛 Known Issues & Solutions

### Issue: Multiple Supabase Clients Warning
**Cause**: Temporary RillaBox client + Trust Skin Hub client  
**Solution**: After database migration, remove temporary client  
**Impact**: None (warning only, functionally works fine)

### Issue: Provider Logos Not Loading
**Cause**: Missing logo images in public/images/  
**Solution**: Logos now copied, refresh browser  
**Status**: ✅ Fixed

### Issue: Missing Dependencies
**Cause**: Components from RillaBox require specific utilities  
**Solution**: All dependencies now copied  
**Status**: ✅ Fixed

---

## 📝 Development Notes

### Adding New Providers

1. Add table in Supabase: `[provider]_boxes`
2. Update `PROVIDER_CONFIGS` in `src/hooks/useUnifiedBoxData.ts`
3. Add provider option in filters
4. Add provider logo to `public/images/`

### Modifying Analytics

1. Update calculations in `src/utils/boxStatistics.ts`
2. Add memoization in `src/utils/memoizedCalculations.ts`
3. Update types in `src/types/index.ts`

### Custom Filters

1. Create filter component in `src/components/filters/`
2. Add filter state in `src/types/filters.ts`
3. Update `useOptimizedFiltering.ts` logic
4. Add UI in `FilterPanel.tsx`

---

## 🎯 Best Practices

### Performance
- Always use memoization for expensive calculations
- Implement virtual scrolling for large lists (>100 items)
- Debounce user inputs (search, sliders)
- Lazy load images

### Accessibility
- Include ARIA labels on interactive elements
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

### Code Quality
- Use TypeScript strict mode
- Add proper error handling
- Write descriptive comments for complex logic
- Follow existing component patterns

---

**Last Updated**: October 2, 2025  
**Version**: 1.0.0

