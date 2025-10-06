# Database Setup Guide

## 🗄️ Database Configuration

Trust Skin Hub uses **Supabase** (PostgreSQL) for data storage.

---

## Current Setup (Development)

### Dual Supabase Configuration

**Trust Skin Hub Supabase** (Main):
- **Project ID**: `aclxqriujtkpqceqtesg`
- **URL**: https://aclxqriujtkpqceqtesg.supabase.co
- **Tables**: Operators, reviews, content, media, admin users

**RillaBox Supabase** (Temporary - for Mystery Boxes):
- **Project ID**: `qsrkzgywbcbfnmailmsp`
- **URL**: https://qsrkzgywbcbfnmailmsp.supabase.co
- **Tables**: rillabox_boxes, hypedrop_boxes, casesgg_boxes, luxdrop_boxes

> Mystery box features currently connect to RillaBox Supabase. This is temporary for development. Follow the migration guide below to consolidate into one database.

---

## Production Setup (Recommended)

### Single Supabase Instance

Migrate all mystery box tables to Trust Skin Hub Supabase for:
- **Cost Savings**: One Supabase project instead of two
- **Simplicity**: Single database connection
- **Performance**: No cross-instance queries
- **Management**: Unified admin dashboard

---

## Migration Guide

### Step 1: Create Mystery Box Tables

Run in **Trust Skin Hub Supabase SQL Editor**:

```sql
-- RillaBox table
CREATE TABLE public.rillabox_boxes (
  id SERIAL PRIMARY KEY,
  box_name TEXT NOT NULL,
  box_price NUMERIC(10,2),
  box_image TEXT,
  box_url TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  expected_value_percent NUMERIC(10,2),
  ev_to_price_ratio NUMERIC(10,4),
  volatility_bucket TEXT CHECK (volatility_bucket IN ('Low', 'Medium', 'High')),
  standard_deviation_percent NUMERIC(10,2),
  floor_rate_percent NUMERIC(10,2),
  all_items JSONB,
  jackpot_items JSONB,
  unwanted_items JSONB,
  data_source TEXT DEFAULT 'rillabox',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repeat for: hypedrop_boxes, casesgg_boxes, luxdrop_boxes
-- (See DATABASE_MIGRATION_GUIDE.md in workspace root for full script)
```

### Step 2: Apply RLS Policies

```sql
-- Enable RLS
ALTER TABLE public.rillabox_boxes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to rillabox boxes" 
ON public.rillabox_boxes FOR SELECT USING (true);

-- Repeat for all 4 tables
```

### Step 3: Create Performance Indexes

```sql
CREATE INDEX idx_rillabox_box_name ON public.rillabox_boxes(box_name);
CREATE INDEX idx_rillabox_category ON public.rillabox_boxes(category);
CREATE INDEX idx_rillabox_volatility ON public.rillabox_boxes(volatility_bucket);
CREATE INDEX idx_rillabox_price ON public.rillabox_boxes(box_price);
CREATE INDEX idx_rillabox_ev ON public.rillabox_boxes(expected_value_percent);
CREATE INDEX idx_rillabox_tags ON public.rillabox_boxes USING GIN(tags);

-- Repeat for all 4 tables
```

### Step 4: Export Data from RillaBox

**Via Supabase Studio**:
1. Go to https://supabase.com/dashboard/project/qsrkzgywbcbfnmailmsp/editor
2. Export each table as CSV
3. Download files

**Via pg_dump**:
```bash
pg_dump \
  "postgresql://postgres:[PASSWORD]@db.qsrkzgywbcbfnmailmsp.supabase.co:5432/postgres" \
  --data-only \
  --table=public.rillabox_boxes \
  --table=public.hypedrop_boxes \
  --table=public.casesgg_boxes \
  --table=public.luxdrop_boxes \
  > mystery_boxes_data.sql
```

### Step 5: Import to Trust Skin Hub

**Via Supabase Studio**:
1. Go to https://supabase.com/dashboard/project/aclxqriujtkpqceqtesg/editor
2. Import CSV files to corresponding tables

**Via psql**:
```bash
psql \
  "postgresql://postgres:[PASSWORD]@db.aclxqriujtkpqceqtesg.supabase.co:5432/postgres" \
  < mystery_boxes_data.sql
```

### Step 6: Update Application Code

**Update `src/hooks/useUnifiedBoxData.ts`**:

```typescript
// BEFORE (temporary):
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://qsrkzgywbcbfnmailmsp.supabase.co',
  '[RILLABOX_KEY]'
);

// AFTER (production):
import { supabase } from '@/integrations/supabase/client';
// Remove the createClient call above
```

### Step 7: Verify Migration

```sql
-- Check row counts in Trust Skin Hub Supabase
SELECT 
  'rillabox_boxes' as table_name, COUNT(*) as row_count FROM rillabox_boxes
UNION ALL
SELECT 'hypedrop_boxes', COUNT(*) FROM hypedrop_boxes
UNION ALL
SELECT 'casesgg_boxes', COUNT(*) FROM casesgg_boxes
UNION ALL
SELECT 'luxdrop_boxes', COUNT(*) FROM luxdrop_boxes;

-- Should match row counts from RillaBox Supabase
```

---

## Environment Variables

### Development (.env)

```env
# Trust Skin Hub Supabase (Main Database)
VITE_SUPABASE_PROJECT_ID=aclxqriujtkpqceqtesg
VITE_SUPABASE_URL=https://aclxqriujtkpqceqtesg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbHhxcml1anRrcHFjZXF0ZXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjYwNDUsImV4cCI6MjA3Mjc0MjA0NX0.yFxrQO1sDjJUwqlaFOQ51YLCuDCiBvOapoZJ68tm3BE
```

### Production

Store credentials in deployment platform:
- **Lovable Cloud**: Project Settings > Environment Variables
- **Vercel**: Project Settings > Environment Variables
- **Netlify**: Site Settings > Environment > Environment variables

---

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

**Public Tables** (read-only):
- operators (published only)
- mystery boxes (all)
- reviews (approved only)

**Admin-Only** (write access):
- All tables require admin authentication
- Email-based authorization via `admin_users` table

### Admin User Management

```sql
-- View admin users
SELECT * FROM public.admin_users;

-- Add new admin
INSERT INTO public.admin_users (email, role) 
VALUES ('newadmin@unpacked.gg', 'editor');

-- Update admin role
UPDATE public.admin_users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

---

## 🛠️ Database Maintenance

### Backup Database

```bash
# Full backup
npx supabase db dump \
  --db-url="postgresql://postgres:[PASSWORD]@db.aclxqriujtkpqceqtesg.supabase.co:5432/postgres" \
  > backup_$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
psql \
  "postgresql://postgres:[PASSWORD]@db.aclxqriujtkpqceqtesg.supabase.co:5432/postgres" \
  < backup_20251002.sql
```

### Update Mystery Box Data

```bash
# Export latest data from provider
# Import to database
# Or use admin panel (coming soon)
```

---

## 📊 Database Performance

### Indexes

All tables have optimized indexes for:
- Primary keys
- Foreign keys
- Frequently queried columns (name, slug, category, price, EV, volatility)
- JSONB columns (tags) with GIN indexes

### Query Optimization

```sql
-- Use indexes effectively
SELECT * FROM rillabox_boxes 
WHERE category = 'CS:GO' 
  AND expected_value_percent > 100
ORDER BY box_price DESC
LIMIT 50;

-- JSONB tag queries
SELECT * FROM rillabox_boxes 
WHERE tags @> '["high-value"]'::jsonb;
```

---

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/aclxqriujtkpqceqtesg)
- [Supabase Documentation](https://supabase.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated**: October 2, 2025


