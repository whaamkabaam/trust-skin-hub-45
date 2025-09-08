-- Create table for published operator content (flattened for SEO)
CREATE TABLE public.published_operator_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.published_operator_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Allow public read access to published content" 
ON public.published_operator_content 
FOR SELECT 
USING (true);

-- Allow admin management
CREATE POLICY "Admin: manage published_operator_content" 
ON public.published_operator_content 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create index for fast slug lookups
CREATE INDEX idx_published_operator_content_slug ON public.published_operator_content(slug);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_published_operator_content_updated_at
BEFORE UPDATE ON public.published_operator_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();