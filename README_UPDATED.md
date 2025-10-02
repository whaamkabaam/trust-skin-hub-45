# Trust Skin Hub - Unpacked.gg

## 🎯 Project Overview

Trust Skin Hub is a comprehensive CS2 (Counter-Strike 2) skins trading platform that provides trust-first analysis of operators, cases, and mystery boxes. Built with React, TypeScript, and Supabase, it offers detailed comparisons, community reviews, and transparency-focused content for gamers making informed trading decisions.

## 🌟 Key Features

### 🛡️ Trust-First Design
- **Comprehensive Security Analysis**: Detailed evaluation of all operators with multi-factor trust scores
- **Transparent Methodology**: Open editorial policies and clear rating criteria
- **Community-Driven Reviews**: User-generated reviews with verified badges and helpful voting
- **Trust Scores**: Multi-dimensional ratings (Trust, Fees, UX, Support, Payments, Offering)

### 🎮 CS2 Trading Focus
- **Operator Comparisons**: Side-by-side analysis of trading platforms
- **Case Opening Analysis**: Odds disclosure verification and drop table analysis
- **Mystery Box Ratings**: Fairness ratings and expected value calculations
- **Real-Time Market Data**: Up-to-date pricing and market trends

### 📱 User Experience
- **Responsive Design**: Full feature parity across desktop, tablet, and mobile
- **WCAG 2.1 AA Compliance**: Accessible to all users
- **Keyboard Navigation**: Full support for keyboard-only users
- **Colorblind-Safe Design**: Carefully chosen color palettes

### 🔍 Advanced Features
- **Multi-Dimensional Filtering**: Filter by fees, trust score, payout speed, games, payment methods
- **Global Search**: Intelligent search across operators, cases, and mystery boxes
- **Admin Dashboard**: Content management system for operators, reviews, and media
- **Publishing Queue**: Scheduled publishing with auto-save and version control
- **SEO Optimized**: Dynamic meta tags, schema.org markup, and sitemap generation

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4 with custom design system
- **Animations**: Framer Motion 12
- **Routing**: React Router v6
- **State Management**: Zustand 5.0, TanStack Query 5.87
- **Forms**: React Hook Form + Zod validation

### Backend & Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with admin role system
- **Storage**: Supabase Storage for media assets
- **Hosting**: Lovable Cloud (deployment ready)
- **Edge Functions**: Supabase Functions for AI integration and scheduling

### Development Tools
- **TypeScript**: Strict mode enabled
- **ESLint**: Modern flat config
- **Package Manager**: npm (compatible with bun)
- **Rich Text**: React Quill for content editing
- **File Uploads**: React Dropzone

## 📁 Project Structure

```
trust-skin-hub-45/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui base components (49 files)
│   │   ├── admin/          # Admin dashboard components (35 files)
│   │   ├── Header.tsx      # Main navigation
│   │   ├── Hero.tsx        # Homepage hero section
│   │   ├── OperatorCard.tsx # Operator comparison cards
│   │   ├── CaseCard.tsx    # Case analysis cards
│   │   ├── ReviewCard.tsx  # User review components
│   │   └── ...             # Other UI components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages (15 files)
│   │   ├── Index.tsx       # Homepage
│   │   ├── OperatorReview.tsx
│   │   ├── MysteryBoxesArchive.tsx
│   │   ├── MysteryBoxDetail.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks (24 files)
│   │   ├── useOperators.ts
│   │   ├── useMysteryBoxes.ts
│   │   ├── useReviews.ts
│   │   ├── useGlobalSearch.ts
│   │   └── ...
│   ├── integrations/
│   │   └── supabase/       # Supabase client and types
│   ├── lib/                # Utilities and helpers
│   │   ├── sample-data.ts  # Sample data for development
│   │   ├── utils.ts        # Utility functions
│   │   ├── validations.ts  # Zod schemas
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   └── main.tsx            # Application entry point
├── supabase/
│   ├── migrations/         # 32 database migration files
│   ├── functions/          # Edge functions
│   │   ├── admin-users/
│   │   ├── ai/
│   │   └── schedule-publisher/
│   └── config.toml         # Supabase configuration
├── public/
│   ├── img/operators/      # Operator logos
│   └── ...
└── package.json
```

## 🗄️ Database Schema

### Core Tables
- **operators**: Main operator/platform data (slug, name, ratings, categories, etc.)
- **content_sections**: Rich text content sections for operator pages
- **media_assets**: Image gallery and media for operators
- **reviews**: User reviews with ratings and status (pending/approved/rejected)
- **seo_metadata**: SEO tags and schema.org data
- **admin_users**: Admin authentication and role management

### Mystery Boxes (Coming from rillabox-oracle-dashboard migration)
- **mystery_boxes**: Unified mystery box catalog
- Provider-specific tables: `rillabox_boxes`, `hypedrop_boxes`, `casesgg_boxes`, `luxdrop_boxes`

### Additional Tables
- **categories**: Dynamic categorization
- **payment_methods**: Payment method catalog
- **static_content**: Editable static content
- **publishing_queue**: Scheduled publishing system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun runtime)
- npm, yarn, or bun package manager
- Supabase account (for production deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/whaamkabaam/trust-skin-hub-45.git
cd trust-skin-hub-45

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (Vite's default port, may vary).

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your_project_id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

**Current Production Credentials** (trust-skin-hub-45):
```env
VITE_SUPABASE_PROJECT_ID=aclxqriujtkpqceqtesg
VITE_SUPABASE_URL=https://aclxqriujtkpqceqtesg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbHhxcml1anRrcHFjZXF0ZXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjYwNDUsImV4cCI6MjA3Mjc0MjA0NX0.yFxrQO1sDjJUwqlaFOQ51YLCuDCiBvOapoZJ68tm3BE
```

## 🎨 Design System

### Colors
- **Primary**: Navy/Slate professional palette with CS2-inspired accents
- **Trust Indicators**: Green (verified), Yellow (warning), Red (risk)
- **Rarity Colors**: CS2-inspired rarity system (Consumer, Industrial, Mil-Spec, Restricted, Classified, Covert, Exceedingly Rare)

### Typography
- **Font Family**: Inter (variable font)
- **Hierarchy**: Clear heading structure with consistent sizing
- **Line Height**: Optimized for readability

### Shadows & Elevation
- Layered elevation system for depth perception
- Subtle shadows for cards and elevated elements

### Animations
- Smooth transitions (200-300ms)
- Micro-interactions for engagement
- Framer Motion for complex animations

## 🔒 Security & Compliance

### Row Level Security (RLS)
- Public read access for published content
- Admin-only write access
- Email-based admin authentication via Supabase Auth

### Content Moderation
- Review approval workflow (pending → approved/rejected)
- Admin moderation dashboard
- Anti-gaming safeguards

### Privacy & Compliance
- GDPR-compliant review submission
- No affiliate tracking in regular links
- Transparent disclosure of tracking links

## 📊 Performance Targets

- **Largest Contentful Paint (LCP)**: ≤ 2.5s
- **First Input Delay (FID)**: ≤ 100ms
- **Cumulative Layout Shift (CLS)**: ≤ 0.1

### Optimization Strategies
- Lazy loading for images with aspect ratio boxes
- Route-level code splitting
- Tree shaking for optimized bundle size
- Virtual scrolling for large lists
- Debounced search and filtering

## 🧪 Testing & Quality

### Code Quality
- TypeScript strict mode enabled
- ESLint with React hooks and refresh plugins
- Consistent component patterns

### Accessibility Testing
- Keyboard navigation verification
- Screen reader compatibility
- Color contrast validation
- Focus management

## 🚢 Deployment

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Lovable Cloud Deployment

The project is configured for Lovable Cloud deployment:
1. Push changes to the main branch
2. Lovable automatically builds and deploys
3. Environment variables configured in Lovable dashboard

### Custom Domain Setup

Connect a custom domain via Project > Settings > Domains in Lovable.

## 📝 Content Management

### Admin Access

Default admin user: `admin@unpacked.gg`

Access the admin dashboard at `/admin` after authentication.

### Key Admin Features
- **Operators Management**: CRUD operations for operators
- **Content Sections**: Rich text editor for operator pages
- **Media Library**: Upload and manage images
- **Reviews Manager**: Moderate user reviews
- **SEO Manager**: Optimize meta tags and schema
- **Publishing Queue**: Schedule content publication

## 🤝 Contributing

### Development Workflow
1. Follow established component patterns
2. Maintain TypeScript strict mode compliance
3. Test accessibility with keyboard navigation
4. Ensure mobile responsiveness
5. Update documentation for significant changes

### Code Style
- Use functional components with hooks
- Prefer named exports for components
- Colocate related logic in custom hooks
- Keep components focused and single-purpose

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lovable Docs](https://docs.lovable.dev)

## 📄 License

This project is proprietary software for Unpacked.gg.

---

**Project maintained by**: whaamkabaam  
**Last Updated**: October 2, 2025  
**Version**: 1.0.0

