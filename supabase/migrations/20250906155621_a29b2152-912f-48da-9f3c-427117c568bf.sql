-- Fix search path security issue for the function
CREATE OR REPLACE FUNCTION public.update_operators_search_vector()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.verdict, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.bonus_terms, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.fairness_info, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(COALESCE(NEW.categories, '{}'), ' ')), 'C') ||
    setweight(to_tsvector('english', array_to_string(COALESCE(NEW.pros, '{}'), ' ')), 'C') ||
    setweight(to_tsvector('english', array_to_string(COALESCE(NEW.cons, '{}'), ' ')), 'C');
  RETURN NEW;
END;
$$;