# Mystery Box Category Page Styling Plan

## 🎯 Objectives

1. **Make category page mystery boxes match /mystery-boxes style (1:1)**
2. **Make boxes clickable and route to box detail pages**
3. **Fix scroll-to-top issue on navigation**

---

## 📊 Current State Analysis

### Category Page (CategoryArchive.tsx)
**Current Component**: `EnhancedMysteryBoxCard`
- **Location**: `src/components/category-blocks/EnhancedMysteryBoxCard.tsx`
- **Style**: Simple Trust Skin Hub style (basic card, no patterns)
- **Clickable**: No - just shows "View Details" button that does nothing
- **Data Source**: Trust Skin Hub's `mystery_boxes` table (old data)
- **Missing Features**:
  - No box-container-pattern background
  - No shimmer-card hover effect
  - No provider logo in top-right corner
  - No volatility badge
  - No tag dots
  - Different layout (EV on right, not centered)

### Mystery Box Hub (/mystery-boxes)
**Current Component**: `VirtualizedBoxGrid` → `BoxCard`
- **Location**: `src/components/VirtualizedBoxGrid.tsx`
- **Style**: RillaBox original style (exact 1:1)
- **Clickable**: Yes - navigates to `/hub/box/:boxSlug`
- **Data Source**: RillaBox Supabase (all 4 providers)
- **Features**:
  - ✅ box-container-pattern background
  - ✅ shimmer-card hover effect  
  - ✅ Provider logo (top-right with tooltip)
  - ✅ Volatility badge
  - ✅ Tag dots
  - ✅ Proper layout (Price | Provider | Volatility, centered EV)

---

## 🔧 Implementation Plan

### Task 1: Replace EnhancedMysteryBoxCard Component

**File**: `src/components/category-blocks/EnhancedMysteryBoxCard.tsx`

**Option A: Replace entirely with BoxCard from VirtualizedBoxGrid**
- Extract BoxCard from VirtualizedBoxGrid
- Make it a standalone component
- Use in both VirtualizedBoxGrid and CategoryArchive
- Requires data transformation (Trust Skin Hub format → RillaBox format)

**Option B: Update EnhancedMysteryBoxCard to match BoxCard style**
- Add all missing classes (box-container-pattern, shimmer-card, etc.)
- Update layout to match exactly
- Add provider logo
- Add volatility badge
- Add tag dots
- Make clickable

**RECOMMENDED: Option A** (cleaner, ensures 100% consistency)

---

### Task 2: Create Reusable MysteryBoxCard Component

**New File**: `src/components/MysteryBoxCard.tsx`

**Purpose**: Single source of truth for mystery box card design

**Features**:
```typescript
interface MysteryBoxCardProps {
  box: {
    box_name: string;
    box_price: number;
    box_image: string;
    expected_value_percent_of_price: number;
    volatility_bucket: 'Low' | 'Medium' | 'High';
    floor_rate_percent: number;
    standard_deviation_percent: number;
    tags: string[];
    provider: string;
  };
  onClick?: () => void;
  index?: number;
  isVisible?: boolean;
}
```

**Styling**: Exact copy of BoxCard from VirtualizedBoxGrid with:
- box-container-pattern
- shimmer-card
- Provider logo (top-right)
- Volatility badge
- Tag dots
- 3-section layout
- Centered EV display

---

### Task 3: Update CategoryArchive to Use New Card

**File**: `src/pages/CategoryArchive.tsx`

**Changes**:
1. Replace `EnhancedMysteryBoxCard` with new `MysteryBoxCard`
2. Transform mystery box data to match RillaBox format
3. Add onClick handler to navigate to `/hub/box/:boxSlug`
4. Add scroll-to-top on navigation

**Data Transformation Needed**:
```typescript
// Current: Trust Skin Hub format
{
  id: string;
  name: string;
  price: number;
  expected_value?: number;
  operator?: { name: string };
}

// Target: RillaBox format
{
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  floor_rate_percent: number;
  standard_deviation_percent: number;
  tags: string[];
  provider: string;
}
```

---

### Task 4: Fix Scroll-to-Top on Navigation

**Files to Update**:
1. `src/components/VirtualizedBoxGrid.tsx` - BoxCard onClick
2. `src/components/MysteryBoxCard.tsx` - New card onClick
3. `src/App.tsx` - Add scroll restoration

**Implementation**:

**Option A: ScrollRestoration component**
```typescript
// In App.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Add in App component
<BrowserRouter>
  <ScrollToTop />
  <Routes>...</Routes>
</BrowserRouter>
```

**Option B: Navigate with scroll state**
```typescript
// In card onClick
navigate(`/hub/box/${boxSlug}`, { 
  replace: false,
  state: { scrollToTop: true }
});

// In BoxDetail page
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
```

**RECOMMENDED: Option A** (applies to all navigation automatically)

---

## 📝 Implementation Steps

### Step 1: Create ScrollToTop Component

**File**: `src/components/ScrollToTop.tsx`

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  
  return null;
};
```

### Step 2: Add ScrollToTop to App.tsx

```typescript
// In App.tsx
import { ScrollToTop } from './components/ScrollToTop';

// Inside BrowserRouter
<BrowserRouter>
  <ScrollToTop />
  <ErrorBoundary>
    <Routes>...</Routes>
  </ErrorBoundary>
</BrowserRouter>
```

### Step 3: Create Standalone MysteryBoxCard Component

**Extract BoxCard from VirtualizedBoxGrid**:

```typescript
// src/components/MysteryBoxCard.tsx
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import TagDots from './TagDots';
import ProviderLogo from './ui/ProviderLogo';
import { useScrollState } from '@/hooks/useScrollState';
import { PROVIDER_CONFIGS } from '@/types/filters';
import { 
  useMemoizedVolatilityColor, 
  useMemoizedEVGradient, 
  useMemoizedFloorRateColor 
} from '@/utils/memoizedCalculations';
import { formatBoxPrice } from '@/utils/priceFormatter';
import { generateSlug } from '@/utils/slugUtils';

// Copy entire BoxCard implementation from VirtualizedBoxGrid
```

### Step 4: Update VirtualizedBoxGrid to Use Standalone Component

```typescript
// src/components/VirtualizedBoxGrid.tsx
import MysteryBoxCard from './MysteryBoxCard';

// Replace BoxCard definition with import
// Use MysteryBoxCard in the map
```

### Step 5: Update CategoryArchive

```typescript
// src/pages/CategoryArchive.tsx

// Replace
import { EnhancedMysteryBoxCard } from '@/components/category-blocks/EnhancedMysteryBoxCard';

// With
import MysteryBoxCard from '@/components/MysteryBoxCard';

// Transform data and use new card
{mysteryBoxes.map((box, index) => {
  // Transform to RillaBox format
  const transformedBox = {
    box_name: box.name,
    box_price: box.price,
    box_image: box.image_url || '',
    expected_value_percent_of_price: box.expected_value && box.price 
      ? (box.expected_value / box.price) * 100 
      : 0,
    volatility_bucket: 'Medium' as const, // Default or calculate
    floor_rate_percent: box.floor_rate_percent || 0,
    standard_deviation_percent: box.volatility || 0,
    tags: box.tags || [],
    provider: box.operator?.slug || 'unknown'
  };
  
  return (
    <MysteryBoxCard 
      key={box.id}
      box={transformedBox}
      index={index}
      isVisible={true}
    />
  );
})}
```

---

## 🚀 Execution Order

1. ✅ **Create ScrollToTop component** (5 min)
2. ✅ **Add ScrollToTop to App.tsx** (2 min)
3. ✅ **Extract BoxCard to MysteryBoxCard.tsx** (10 min)
4. ✅ **Update VirtualizedBoxGrid to use MysteryBoxCard** (5 min)
5. ✅ **Create data transformer utility** (10 min)
6. ✅ **Update CategoryArchive to use MysteryBoxCard** (15 min)
7. ✅ **Test on /mystery-boxes** (5 min)
8. ✅ **Test on category pages** (5 min)
9. ✅ **Test scroll-to-top behavior** (5 min)
10. ✅ **Commit and push** (2 min)

**Total Estimated Time**: ~60 minutes

---

## ✅ Success Criteria

### Visual Consistency
- [ ] Category page mystery boxes look identical to /mystery-boxes
- [ ] Same card layout (image, price, provider, volatility, EV, floor, tags)
- [ ] Same patterns (box-container-pattern, shimmer-card)
- [ ] Same hover effects
- [ ] Same provider logos and badges

### Functionality
- [ ] Clicking box on category page navigates to `/hub/box/:boxSlug`
- [ ] Clicking box on /mystery-boxes navigates to `/hub/box/:boxSlug`
- [ ] Page scrolls to top on navigation (from both pages)
- [ ] Box detail page displays correctly
- [ ] Back button works from box detail

### No Regressions
- [ ] Homepage still works
- [ ] Operators section still works
- [ ] Other mystery box pages still work
- [ ] Admin panel still works

---

## 🐛 Potential Issues & Solutions

### Issue: Data Format Mismatch
**Problem**: Category page boxes use Trust Skin Hub format, cards expect RillaBox format

**Solution**: Create transformer function in utils
```typescript
// src/utils/mysteryBoxDataTransformer.ts
export const transformToRillaBoxFormat = (trustHubBox: any) => {
  return {
    box_name: trustHubBox.name,
    box_price: trustHubBox.price,
    // ... complete transformation
  };
};
```

### Issue: Missing Data Fields
**Problem**: Trust Skin Hub boxes might not have volatility, tags, etc.

**Solution**: Use defaults
- volatility_bucket: 'Medium'
- tags: []
- floor_rate_percent: Calculate from data or default to 0

### Issue: Provider Identification
**Problem**: Trust Skin Hub uses operator relationships

**Solution**: Map operator slug to provider
```typescript
const providerMap = {
  'rillabox': 'rillabox',
  'hypedrop': 'hypedrop',
  'casesgg': 'casesgg',
  'luxdrop': 'luxdrop'
};
```

---

## 📦 Files to Create/Modify

### New Files
1. `src/components/ScrollToTop.tsx`
2. `src/components/MysteryBoxCard.tsx`
3. `src/utils/mysteryBoxDataTransformer.ts`

### Modified Files
1. `src/App.tsx` - Add ScrollToTop component
2. `src/components/VirtualizedBoxGrid.tsx` - Use MysteryBoxCard
3. `src/pages/CategoryArchive.tsx` - Use MysteryBoxCard, add transform
4. `src/components/category-blocks/EnhancedMysteryBoxCard.tsx` - Deprecate or remove

---

## 🎨 Visual Reference

### Target (from /mystery-boxes - VirtualizedBoxGrid):
```
┌─────────────────────────┐
│ Provider Logo (top-right)│
│                         │
│  ┌───────────────────┐ │
│  │                   │ │  ← box-container-pattern
│  │   Box Image       │ │
│  │                   │ │
│  └───────────────────┘ │
│                         │
│  Box Name              │
├─────────────────────────┤
│ $0.10  │ Cases.GG │241.0%│  ← 3 columns
│                         │
│      84.9% EV          │  ← Centered, large
│                         │
│   Floor: 10.0%         │  ← Centered
│                         │
│  ● ● ● ●   Parody      │  ← Tag dots
└─────────────────────────┘
       ↑ shimmer-card hover
```

### Current (category pages - EnhancedMysteryBoxCard):
```
┌─────────────────────────┐
│                         │
│   Operator Logo (right) │
│                         │
│      Box Image          │
│   (aspect-square)       │
│                         │
├─────────────────────────┤
│  Box Name              │
│  Operator Name         │
│                         │
│  $0.10      EV: 84%    │
│                         │
│  +10% ROI              │
│                         │
│  [View Details]        │
└─────────────────────────┘
```

**Difference**: Completely different layout, no patterns, no proper styling

---

## 🎯 Scroll-to-Top Implementation

### Current Behavior
- Navigate to `/hub/box/some-box` → Page stays scrolled down
- Navigate from category page to box → Page stays scrolled down

### Target Behavior
- Navigate to any page → Scroll to top
- Happens on ALL route changes
- Smooth user experience

### Implementation
Add `ScrollToTop` component that watches route changes and scrolls to top

---

**Status**: Ready to implement  
**Estimated Time**: 60 minutes  
**Risk**: Low (no breaking changes to existing features)


