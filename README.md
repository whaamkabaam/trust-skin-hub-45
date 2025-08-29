# Unpacked.gg - CS2 Skins Trading Hub

A trust-first hub for CS2 skins trading, cases, and mystery boxes built with React, TypeScript, and Tailwind CSS.

## Features

### 🛡️ Trust-First Design
- Comprehensive security analysis for all operators
- Transparent methodology and editorial policies
- Community-driven reviews and ratings
- Trust scores based on multiple factors

### 🎮 CS2 Trading Focus
- Operator comparisons with detailed analysis
- Case opening odds and drop table analysis
- Mystery box verification and fairness ratings
- Real-time market data and trends

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

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:8080

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Homepage hero section
│   ├── OperatorCard.tsx # Operator comparison cards
│   ├── CaseCard.tsx    # Case analysis cards
│   ├── ReviewCard.tsx  # Community review cards
│   └── ...
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── lib/                # Utilities and sample data
└── assets/             # Images and media
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

## License

This project is proprietary software for Unpacked.gg.

---

For more information about features and implementation details, see the component documentation in each file.