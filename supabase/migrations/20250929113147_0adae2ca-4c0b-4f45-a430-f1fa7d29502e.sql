-- Drop existing triggers first
DROP TRIGGER IF EXISTS trigger_update_operator_categories_on_mystery_box_change ON mystery_boxes;
DROP TRIGGER IF EXISTS trigger_update_operator_categories_on_category_change ON mystery_box_categories;

-- Update function to handle different trigger sources
CREATE OR REPLACE FUNCTION update_operator_categories_from_mystery_boxes()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_operator_id uuid;
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
    UPDATE operators 
    SET categories = (
      SELECT ARRAY_AGG(DISTINCT c.slug)
      FROM mystery_boxes mb
      JOIN mystery_box_categories mbc ON mb.id = mbc.mystery_box_id
      JOIN categories c ON mbc.category_id = c.id
      WHERE mb.operator_id = target_operator_id
        AND mb.is_active = true
    )
    WHERE id = target_operator_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Recreate triggers
CREATE TRIGGER trigger_update_operator_categories_on_mystery_box_change
  AFTER INSERT OR UPDATE OR DELETE ON mystery_boxes
  FOR EACH ROW
  EXECUTE FUNCTION update_operator_categories_from_mystery_boxes();

CREATE TRIGGER trigger_update_operator_categories_on_category_change
  AFTER INSERT OR UPDATE OR DELETE ON mystery_box_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_operator_categories_from_mystery_boxes();