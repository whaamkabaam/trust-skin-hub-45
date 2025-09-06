-- Create operators table with complete schema
CREATE TABLE public.operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  tracking_link TEXT,
  launch_year INTEGER,
  categories TEXT[] DEFAULT '{}',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  ratings JSONB DEFAULT '{"overall": 0, "trust": 0, "value": 0, "payments": 0, "offering": 0, "ux": 0, "support": 0}',
  verdict TEXT,
  hero_image_url TEXT,
  kyc_required BOOLEAN DEFAULT false,
  bonus_terms TEXT,
  fairness_info TEXT,
  supported_countries TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_sections table
CREATE TABLE public.content_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  heading TEXT NOT NULL,
  rich_text_content TEXT,
  order_number INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_assets table
CREATE TABLE public.media_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('logo', 'hero', 'screenshot', 'gallery', 'banner')),
  alt_text TEXT,
  caption TEXT,
  order_number INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  user_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seo_metadata table
CREATE TABLE public.seo_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  schema_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for operators (public read, admin write)
CREATE POLICY "Allow public read access to published operators" 
ON public.operators FOR SELECT 
USING (published = true);

CREATE POLICY "Allow admin users full access to operators" 
ON public.operators FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

-- Create policies for content_sections (public read for published operators, admin write)
CREATE POLICY "Allow public read access to content sections for published operators" 
ON public.content_sections FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.operators 
  WHERE operators.id = content_sections.operator_id 
  AND operators.published = true
));

CREATE POLICY "Allow admin users full access to content sections" 
ON public.content_sections FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

-- Create policies for media_assets (public read for published operators, admin write)
CREATE POLICY "Allow public read access to media assets for published operators" 
ON public.media_assets FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.operators 
  WHERE operators.id = media_assets.operator_id 
  AND operators.published = true
));

CREATE POLICY "Allow admin users full access to media assets" 
ON public.media_assets FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

-- Create policies for reviews (public read for published operators, admin write)
CREATE POLICY "Allow public read access to approved reviews for published operators" 
ON public.reviews FOR SELECT 
USING (status = 'approved' AND EXISTS (
  SELECT 1 FROM public.operators 
  WHERE operators.id = reviews.operator_id 
  AND operators.published = true
));

CREATE POLICY "Allow admin users full access to reviews" 
ON public.reviews FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

-- Create policies for seo_metadata (public read for published operators, admin write)
CREATE POLICY "Allow public read access to SEO metadata for published operators" 
ON public.seo_metadata FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.operators 
  WHERE operators.id = seo_metadata.operator_id 
  AND operators.published = true
));

CREATE POLICY "Allow admin users full access to SEO metadata" 
ON public.seo_metadata FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

-- Create policies for admin_users (only accessible by existing admin users)
CREATE POLICY "Allow admin users to read admin users" 
ON public.admin_users FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

CREATE POLICY "Allow admin role users to manage admin users" 
ON public.admin_users FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email' 
  AND role = 'admin'
));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic updated_at timestamps
CREATE TRIGGER update_operators_updated_at
  BEFORE UPDATE ON public.operators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at
  BEFORE UPDATE ON public.seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_operators_slug ON public.operators(slug);
CREATE INDEX idx_operators_published ON public.operators(published);
CREATE INDEX idx_content_sections_operator_id ON public.content_sections(operator_id);
CREATE INDEX idx_content_sections_order ON public.content_sections(operator_id, order_number);
CREATE INDEX idx_media_assets_operator_id ON public.media_assets(operator_id);
CREATE INDEX idx_media_assets_type ON public.media_assets(type);
CREATE INDEX idx_reviews_operator_id ON public.reviews(operator_id);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_seo_metadata_operator_id ON public.seo_metadata(operator_id);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);

-- Insert a default admin user (you'll need to update this email)
INSERT INTO public.admin_users (email, role) VALUES ('admin@unpacked.gg', 'admin');

-- Create storage buckets for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('operator-media', 'operator-media', true);

-- Create storage policies for operator media
CREATE POLICY "Allow public access to operator media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'operator-media');

CREATE POLICY "Allow admin users to upload operator media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'operator-media' AND EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

CREATE POLICY "Allow admin users to update operator media" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'operator-media' AND EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));

CREATE POLICY "Allow admin users to delete operator media" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'operator-media' AND EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE email = auth.jwt() ->> 'email'
));