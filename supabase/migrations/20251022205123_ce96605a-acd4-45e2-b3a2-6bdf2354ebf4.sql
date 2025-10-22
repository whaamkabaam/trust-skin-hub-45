-- Add featured box support to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS featured_box_id uuid REFERENCES provider_box_category_overrides(id),
ADD COLUMN IF NOT EXISTS featured_box_description text;

-- Add category statistics fields for performance
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS total_boxes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_price numeric(10,2),
ADD COLUMN IF NOT EXISTS price_min numeric(10,2),
ADD COLUMN IF NOT EXISTS price_max numeric(10,2);

-- Create index for featured box lookups
CREATE INDEX IF NOT EXISTS idx_categories_featured_box ON categories(featured_box_id);

-- Add comment explaining the featured box relationship
COMMENT ON COLUMN categories.featured_box_id IS 'References a specific box override to feature prominently in the category hero section';
COMMENT ON COLUMN categories.featured_box_description IS 'Custom description for the featured box, overriding default description';
COMMENT ON COLUMN categories.total_boxes IS 'Cached count of boxes assigned to this category';
COMMENT ON COLUMN categories.avg_price IS 'Cached average price of boxes in this category';
COMMENT ON COLUMN categories.price_min IS 'Cached minimum box price in this category';
COMMENT ON COLUMN categories.price_max IS 'Cached maximum box price in this category';