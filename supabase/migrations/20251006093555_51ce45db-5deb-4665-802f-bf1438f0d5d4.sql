-- Add author metadata fields to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS author_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS content_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_published ON categories(published) WHERE published = true;