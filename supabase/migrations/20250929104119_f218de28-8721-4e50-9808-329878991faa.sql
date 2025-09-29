-- Create function to auto-update operator categories from mystery boxes
CREATE OR REPLACE FUNCTION update_operator_categories_from_mystery_boxes()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for mystery box insertions/updates
CREATE TRIGGER trigger_update_operator_categories_on_mystery_box_change
  AFTER INSERT OR UPDATE OR DELETE ON mystery_boxes
  FOR EACH ROW
  EXECUTE FUNCTION update_operator_categories_from_mystery_boxes();

-- Create trigger for mystery box category relationship changes
CREATE TRIGGER trigger_update_operator_categories_on_category_change
  AFTER INSERT OR UPDATE OR DELETE ON mystery_box_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_operator_categories_from_mystery_boxes();