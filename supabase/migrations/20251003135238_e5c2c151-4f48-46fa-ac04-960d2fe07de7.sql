-- Create table for manual category overrides on provider boxes
CREATE TABLE public.provider_box_category_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  box_id INTEGER NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(provider, box_id, category_id)
);

-- Create indexes for fast lookups
CREATE INDEX idx_provider_box_overrides_lookup ON public.provider_box_category_overrides(provider, box_id);
CREATE INDEX idx_provider_box_overrides_category ON public.provider_box_category_overrides(category_id);

-- Enable RLS
ALTER TABLE public.provider_box_category_overrides ENABLE ROW LEVEL SECURITY;

-- Admin can manage everything
CREATE POLICY "Admin: manage provider_box_category_overrides"
  ON public.provider_box_category_overrides
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Public can read
CREATE POLICY "Allow public read access"
  ON public.provider_box_category_overrides
  FOR SELECT
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_provider_box_category_overrides_updated_at
  BEFORE UPDATE ON public.provider_box_category_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();