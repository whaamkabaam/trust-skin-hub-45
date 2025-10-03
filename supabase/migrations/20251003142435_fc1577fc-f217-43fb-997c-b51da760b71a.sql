-- Phase 1: Category CMS Database Schema

-- Add publishing and hero fields to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS published boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS hero_title text,
ADD COLUMN IF NOT EXISTS hero_subtitle text,
ADD COLUMN IF NOT EXISTS hero_image_url text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS author text,
ADD COLUMN IF NOT EXISTS reading_time integer;

-- Create category_content_blocks table
CREATE TABLE IF NOT EXISTS category_content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  block_type text NOT NULL CHECK (block_type IN ('hero', 'text', 'mystery_boxes', 'image', 'video', 'stats', 'comparison', 'faq')),
  block_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  order_number integer NOT NULL DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create published_category_content table (for performance)
CREATE TABLE IF NOT EXISTS published_category_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  content_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_category_content_blocks_category_id ON category_content_blocks(category_id);
CREATE INDEX IF NOT EXISTS idx_category_content_blocks_order ON category_content_blocks(category_id, order_number);
CREATE INDEX IF NOT EXISTS idx_published_category_content_slug ON published_category_content(slug);
CREATE INDEX IF NOT EXISTS idx_categories_published ON categories(published) WHERE published = true;

-- Enable RLS
ALTER TABLE category_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_category_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for category_content_blocks
CREATE POLICY "Admin: manage category_content_blocks"
  ON category_content_blocks
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow public read access to visible blocks for published categories"
  ON category_content_blocks
  FOR SELECT
  USING (
    is_visible = true 
    AND EXISTS (
      SELECT 1 FROM categories 
      WHERE categories.id = category_content_blocks.category_id 
      AND categories.published = true
    )
  );

-- RLS Policies for published_category_content
CREATE POLICY "Admin: manage published_category_content"
  ON published_category_content
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow public read access to published_category_content"
  ON published_category_content
  FOR SELECT
  USING (true);

-- Trigger to update updated_at
CREATE TRIGGER update_category_content_blocks_updated_at
  BEFORE UPDATE ON category_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_published_category_content_updated_at
  BEFORE UPDATE ON published_category_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();