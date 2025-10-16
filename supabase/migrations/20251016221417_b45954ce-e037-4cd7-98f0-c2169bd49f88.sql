-- Drop the old constraint that doesn't include 'table'
ALTER TABLE category_content_blocks 
DROP CONSTRAINT IF EXISTS category_content_blocks_block_type_check;

-- Add new constraint with 'table' included in the allowed values
ALTER TABLE category_content_blocks 
ADD CONSTRAINT category_content_blocks_block_type_check 
CHECK (block_type IN (
  'hero',
  'text',
  'mystery_boxes',
  'table',
  'image',
  'video',
  'stats',
  'comparison',
  'comparison_table',
  'faq',
  'cta_banner',
  'trust_indicators'
));

-- Update documentation comment
COMMENT ON COLUMN category_content_blocks.block_type IS 
'Block type: hero, text, mystery_boxes, table, image, video, stats, comparison, comparison_table, faq, cta_banner, trust_indicators';