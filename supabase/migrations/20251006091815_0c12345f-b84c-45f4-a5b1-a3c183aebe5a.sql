-- Drop the old check constraint
ALTER TABLE category_content_blocks DROP CONSTRAINT IF EXISTS category_content_blocks_block_type_check;

-- Add new check constraint with all block types including new ones
ALTER TABLE category_content_blocks 
ADD CONSTRAINT category_content_blocks_block_type_check 
CHECK (block_type = ANY (ARRAY[
  'hero'::text, 
  'text'::text, 
  'mystery_boxes'::text, 
  'image'::text, 
  'video'::text, 
  'stats'::text, 
  'comparison'::text,
  'comparison_table'::text,
  'faq'::text,
  'cta_banner'::text,
  'trust_indicators'::text
]));
