-- Add 'table' to the category content block types
-- This allows table blocks to be created alongside text, hero, and mystery_boxes blocks

COMMENT ON COLUMN category_content_blocks.block_type IS 'Block type: hero, text, mystery_boxes, table, image, video, stats, comparison, faq';