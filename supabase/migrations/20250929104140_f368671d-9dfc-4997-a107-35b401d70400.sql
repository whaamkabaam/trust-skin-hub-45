-- Fix function search path security issue
CREATE OR REPLACE FUNCTION update_operator_categories_from_mystery_boxes()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update operator categories based on their mystery boxes
  UPDATE operators 
  SET categories = (
    SELECT ARRAY_AGG(DISTINCT c.slug)
    FROM mystery_boxes mb
    JOIN mystery_box_categories mbc ON mb.id = mbc.mystery_box_id
    JOIN categories c ON mbc.category_id = c.id
    WHERE mb.operator_id = COALESCE(NEW.operator_id, OLD.operator_id)
      AND mb.is_active = true
  )
  WHERE id = COALESCE(NEW.operator_id, OLD.operator_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;