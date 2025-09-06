-- Add full-text search capabilities to operators table
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION public.update_operators_search_vector()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
DROP TRIGGER IF EXISTS update_operators_search_trigger ON public.operators;
CREATE TRIGGER update_operators_search_trigger
  BEFORE INSERT OR UPDATE ON public.operators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_operators_search_vector();

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS idx_operators_search_vector ON public.operators USING gin(search_vector);

-- Update existing records
UPDATE public.operators SET search_vector = 
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(verdict, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(bonus_terms, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(fairness_info, '')), 'C') ||
  setweight(to_tsvector('english', array_to_string(COALESCE(categories, '{}'), ' ')), 'C') ||
  setweight(to_tsvector('english', array_to_string(COALESCE(pros, '{}'), ' ')), 'C') ||
  setweight(to_tsvector('english', array_to_string(COALESCE(cons, '{}'), ' ')), 'C');

-- Add content scheduling fields to operators table
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamp with time zone;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS publish_status text DEFAULT 'draft' CHECK (publish_status IN ('draft', 'scheduled', 'published', 'archived'));

-- Update existing operators to have proper publish status
UPDATE public.operators 
SET publish_status = CASE 
  WHEN published = true THEN 'published'
  ELSE 'draft'
END
WHERE publish_status IS NULL;