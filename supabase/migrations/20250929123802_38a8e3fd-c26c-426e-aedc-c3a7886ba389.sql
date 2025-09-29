-- Create 'mystery-boxes' category
INSERT INTO categories (name, slug, display_order, is_featured, description_rich)
VALUES (
  'Mystery Boxes',
  'mystery-boxes',
  1,
  true,
  '<p>Discover the best mystery box operators offering exciting unboxing experiences with digital items, skins, and collectibles.</p>'
) ON CONFLICT (slug) DO NOTHING;

-- Update the auto-population trigger function to include 'mystery-boxes' category
CREATE OR REPLACE FUNCTION public.update_operator_categories_from_mystery_boxes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  target_operator_id uuid;
  mystery_box_categories text[];
BEGIN
  -- Determine the operator_id based on trigger source table
  IF TG_TABLE_NAME = 'mystery_boxes' THEN
    target_operator_id := COALESCE(NEW.operator_id, OLD.operator_id);
  ELSIF TG_TABLE_NAME = 'mystery_box_categories' THEN
    -- Get operator_id from the mystery box
    SELECT mb.operator_id INTO target_operator_id
    FROM mystery_boxes mb
    WHERE mb.id = COALESCE(NEW.mystery_box_id, OLD.mystery_box_id);
  END IF;

  -- Update operator categories if we have a valid operator_id
  IF target_operator_id IS NOT NULL THEN
    -- Get unique categories from mystery boxes for this operator
    SELECT ARRAY_AGG(DISTINCT c.slug) INTO mystery_box_categories
    FROM mystery_boxes mb
    JOIN mystery_box_categories mbc ON mb.id = mbc.mystery_box_id
    JOIN categories c ON mbc.category_id = c.id
    WHERE mb.operator_id = target_operator_id
      AND mb.is_active = true;

    -- Update operator categories to include both mystery box categories and 'mystery-boxes'
    UPDATE operators 
    SET categories = ARRAY(
      SELECT DISTINCT unnest(
        COALESCE(mystery_box_categories, ARRAY[]::text[]) || 
        CASE 
          WHEN EXISTS(SELECT 1 FROM mystery_boxes WHERE operator_id = target_operator_id AND is_active = true)
          THEN ARRAY['mystery-boxes']
          ELSE ARRAY[]::text[]
        END
      )
    )
    WHERE id = target_operator_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS update_operator_categories_on_mystery_box_change ON mystery_boxes;
CREATE TRIGGER update_operator_categories_on_mystery_box_change
  AFTER INSERT OR UPDATE OR DELETE ON mystery_boxes
  FOR EACH ROW EXECUTE FUNCTION update_operator_categories_from_mystery_boxes();

DROP TRIGGER IF EXISTS update_operator_categories_on_category_change ON mystery_box_categories;  
CREATE TRIGGER update_operator_categories_on_category_change
  AFTER INSERT OR UPDATE OR DELETE ON mystery_box_categories
  FOR EACH ROW EXECUTE FUNCTION update_operator_categories_from_mystery_boxes();

-- Update existing operators to have 'mystery-boxes' category if they have mystery boxes
UPDATE operators 
SET categories = ARRAY(
  SELECT DISTINCT unnest(
    COALESCE(categories, ARRAY[]::text[]) || ARRAY['mystery-boxes']
  )
)
WHERE id IN (
  SELECT DISTINCT operator_id 
  FROM mystery_boxes 
  WHERE is_active = true AND operator_id IS NOT NULL
)
AND NOT ('mystery-boxes' = ANY(COALESCE(categories, ARRAY[]::text[])));