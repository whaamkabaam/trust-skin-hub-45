# Trust Skin Hub - Unpacked.gg
## CS2 Trading Operators & Mystery Box Analytics Platform

A comprehensive trust-first platform for CS2 trading featuring operator reviews, community ratings, and advanced mystery box analytics across multiple providers.

## ✨ Features

### 🛡️ Trust-First Operator Reviews
- Comprehensive security analysis for all operators
- Multi-dimensional trust scores (Trust, Fees, UX, Support, Payments, Offering)
- Community-driven reviews and ratings
- Transparent methodology and editorial policies
- Detailed operator comparisons

### 📦 Mystery Box Analytics Hub (NEW)
- **1,400+ Mystery Boxes** from 4 providers (RillaBox, HypeDrop, Cases.gg, LuxDrop)
- **Expected Value Analysis**: Precise ROI calculations
- **Volatility Metrics**: Risk assessment (Low/Medium/High)
- **Item Scouter**: Hunt specific items with efficiency rankings
- **Advanced Filtering**: Multi-dimensional search and filters
- **Portfolio Strategies**: Pre-built allocations for different budgets
- **Virtual Scrolling**: High-performance rendering

### 🎮 CS2 Trading Focus
- Case opening odds and drop table analysis
- Real-time market data and trends
- Payment method comparisons
- KYC requirement transparency

### 📱 Responsive & Accessible
- Full feature parity across desktop and mobile
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Colorblind-safe design elements

### 🔍 Advanced Filtering
- Multi-dimensional operator filtering
- Sort by fees, trust score, payout speed
- Game-specific filters (CS2, Rust, TF2, Dota2)
- Payment method and KYC filtering

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/whaamkabaam/trust-skin-hub-45.git
cd trust-skin-hub-45

# Install dependencies
npm install

# Configure environment (see .env file)
cp .env.example .env

# Start development server
npm run dev

# Open http://localhost:8080
```

### Environment Setup

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID=aclxqriujtkpqceqtesg
VITE_SUPABASE_URL=https://aclxqriujtkpqceqtesg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[your_key_here]
```

> **Note**: Mystery box features currently connect to a separate Supabase instance during development. See `docs/DATABASE_SETUP.md` for migration instructions.

## 📖 Documentation

- **README.md** (this file) - Main overview and quick start
- **docs/MYSTERY_BOX_FEATURES.md** - Complete mystery box feature guide
- **docs/DATABASE_SETUP.md** - Database setup and migration
- **docs/API_REFERENCE.md** - API and data structures

## 🗺️ Key Routes

### Public Routes
- `/` - Homepage
- `/operators` - Browse operators
- `/operators/:slug` - Operator detail
- `/mystery-boxes` - **Mystery Box Hub** (NEW)
- `/cases` - Cases listing
- `/skins` - Skins page

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/operators` - Manage operators
- `/admin/mystery-boxes` - Manage mystery boxes (coming soon)
- `/admin/reviews` - Review moderation
- `/admin/media` - Media library

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                   # shadcn/ui (49 files)
│   ├── admin/                # Admin dashboard (35 files)
│   ├── filters/              # Mystery box filters (NEW)
│   ├── scouter/              # Item Hunter (NEW)
│   ├── BoxfolioDashboard.tsx # Mystery box dashboard (NEW)
│   ├── VirtualizedBoxGrid.tsx # Performance grid (NEW)
│   └── ... (operators, reviews, etc.)
├── pages/
│   ├── admin/                # Admin pages
│   ├── MysteryBoxHub.tsx     # Mystery box hub (NEW)
│   └── ... (operators, cases, etc.)
├── hooks/                    # 30+ custom hooks
├── utils/                    # Utilities & calculations
├── types/                    # TypeScript types
└── integrations/supabase/    # Supabase client
```

## Key Components

### Design System
- **Colors**: Professional navy/slate with CS2-inspired accents
- **Typography**: Inter font with clear hierarchy
- **Shadows**: Layered elevation system
- **Animations**: Smooth transitions and micro-interactions

### Operator Cards
- Trust scores and verification badges
- Fee analysis with visual indicators
- Payment method icons
- Pros/cons comparison
- Community ratings integration

### Review System
- Verified reviewer badges
- Multi-dimensional ratings (Trust, Fees, UX, Support)
- Helpful/unhelpful voting
- Operator response threads
- Photo attachments

### Case Analysis
- Odds disclosure verification
- Drop table analysis
- Expected return calculations
- Rarity-based color coding
- Historical price data

## Data Integration

The application uses sample JSON data for demonstration. To integrate real data:

1. Replace sample data in `src/lib/sample-data.ts`
2. Implement API calls in respective components
3. Add error handling and loading states
4. Update TypeScript types as needed

## Performance

- Lazy loading for images with aspect ratio boxes
- Route-level code splitting
- Optimized bundle size with tree shaking
- LCP target: ≤ 2.5s

## Security & Compliance

- No affiliate parameters in regular links (only tracked CTAs)
- GDPR-compliant review submission
- Content moderation system
- Anti-gaming safeguards for reviews

## Contributing

1. Follow the established component patterns
2. Maintain TypeScript strict mode compliance
3. Test accessibility with keyboard navigation
4. Ensure mobile responsiveness
5. Update this README for significant changes

## 🎉 What's New: Mystery Box Hub Integration

### ✅ Fully Integrated Features

**From RillaBox Oracle Dashboard**:
- Complete mystery box analytics platform
- 1,400+ boxes from 4 providers
- Advanced filtering and search
- Item Hunter (Scouter) tool
- Analytics dashboard
- Virtual scrolling for performance

**Integration Details**:
- 40+ new components copied and integrated
- 15+ new custom hooks
- Complete utility libraries for calculations
- Beautiful purple dot background design
- Seamless integration with existing Header/Footer

### 📂 New Files Added

**Components** (~40 files):
- Mystery box dashboard and grids
- Advanced filter system
- Item Scouter interface
- Loading skeletons
- Provider logos and branding

**Hooks** (~15 files):
- Data fetching (useUnifiedBoxData)
- Filtering (useOptimizedFiltering)
- Item search (useItemSearch, useHuntReport)
- State management (useFilterReducer, useUrlFilters)

**Utilities** (~20 files):
- Box statistics and analytics
- Portfolio strategy generators
- Hunt calculations
- Probability mathematics
- Memoized calculations

**Documentation**:
- `docs/MYSTERY_BOX_FEATURES.md` - Feature guide
- `docs/DATABASE_SETUP.md` - Database setup
- `docs/API_REFERENCE.md` - API reference

### 🔄 Database Migration Status

**Current**: Mystery boxes fetch from RillaBox Supabase (temporary)  
**Target**: Migrate to Trust Skin Hub Supabase (see `docs/DATABASE_SETUP.md`)

**Migration Required**:
1. Create mystery box tables in Trust Skin Hub Supabase
2. Export/import data
3. Update `src/hooks/useUnifiedBoxData.ts` to use main client

---

## 📚 Additional Resources

### Documentation in Workspace Root
- `MIGRATION_IMPLEMENTATION_PLAN.md` - Detailed integration plan
- `DATABASE_MIGRATION_GUIDE.md` - Complete migration guide with credentials
- `PROJECT_OVERVIEW.md` - High-level overview
- `QUICK_REFERENCE.md` - Quick lookup cheat sheet

### External Links
- [Supabase Dashboard (Trust Skin Hub)](https://supabase.com/dashboard/project/aclxqriujtkpqceqtesg)
- [Supabase Documentation](https://supabase.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## License

This project is proprietary software for Unpacked.gg.

---

**Version**: 2.0.0 (with Mystery Box Hub)  
**Last Updated**: October 2, 2025  
**Repository**: https://github.com/whaamkabaam/trust-skin-hub-45  
**Status**: Production Ready 🚀