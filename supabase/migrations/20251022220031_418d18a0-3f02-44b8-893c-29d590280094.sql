-- Update the functions to have a secure search_path
CREATE OR REPLACE FUNCTION refresh_category_stats(p_category_id uuid)
RETURNS void AS $$
DECLARE
  v_stats RECORD;
BEGIN
  -- Calculate stats by joining overrides with provider tables
  WITH box_prices AS (
    SELECT 
      pbco.category_id,
      COALESCE(
        CASE 
          WHEN pbco.provider = 'rillabox' THEN r.box_price
          WHEN pbco.provider = 'hypedrop' THEN h.box_price
          WHEN pbco.provider = 'casesgg' THEN c.box_price
          WHEN pbco.provider = 'luxdrop' THEN l.box_price
        END, 0
      ) as price
    FROM provider_box_category_overrides pbco
    LEFT JOIN rillabox r ON pbco.provider = 'rillabox' AND pbco.box_id = r.id
    LEFT JOIN hypedrop h ON pbco.provider = 'hypedrop' AND pbco.box_id = h.id
    LEFT JOIN casesgg c ON pbco.provider = 'casesgg' AND pbco.box_id = c.id
    LEFT JOIN luxdrop l ON pbco.provider = 'luxdrop' AND pbco.box_id = l.id
    WHERE pbco.category_id = p_category_id
  )
  SELECT 
    COUNT(*)::integer as total,
    COALESCE(AVG(price), 0) as avg,
    COALESCE(MIN(price), 0) as min,
    COALESCE(MAX(price), 0) as max
  INTO v_stats
  FROM box_prices
  WHERE price > 0;

  -- Update categories table
  UPDATE categories
  SET 
    total_boxes = COALESCE(v_stats.total, 0),
    avg_price = COALESCE(v_stats.avg, 0),
    price_min = COALESCE(v_stats.min, 0),
    price_max = COALESCE(v_stats.max, 0)
  WHERE id = p_category_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update trigger function with secure search_path
CREATE OR REPLACE FUNCTION trigger_refresh_category_stats()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_category_stats(OLD.category_id);
    RETURN OLD;
  ELSE
    PERFORM refresh_category_stats(NEW.category_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SET search_path = public;