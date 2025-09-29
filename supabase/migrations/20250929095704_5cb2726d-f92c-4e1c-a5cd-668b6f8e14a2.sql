-- Create categories table for mystery box categorization
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  description_rich text,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create payment_methods table for operator payment options
CREATE TABLE public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  description_rich text,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create mystery_boxes table to replace the basic Case interface
CREATE TABLE public.mystery_boxes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id uuid REFERENCES public.operators(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  game text CHECK (game IN ('CS2', 'Rust', 'TF2', 'Dota2', 'Apple', 'Tech')),
  price numeric(10,2) NOT NULL,
  expected_value numeric(10,2),
  profit_rate numeric(5,2),
  min_price numeric(10,2),
  odds_disclosed text CHECK (odds_disclosed IN ('Yes', 'Partial', 'No')),
  verified boolean DEFAULT false,
  provably_fair boolean DEFAULT false,
  box_type text CHECK (box_type IN ('digital', 'physical')) DEFAULT 'digital',
  site_name text,
  rarity_mix jsonb DEFAULT '{}',
  highlights jsonb DEFAULT '[]',
  stats jsonb DEFAULT '{"open_count": 0, "avg_return": 0}',
  popularity_score integer DEFAULT 0,
  release_date timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create junction table for mystery box categories (many-to-many)
CREATE TABLE public.mystery_box_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mystery_box_id uuid REFERENCES public.mystery_boxes(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(mystery_box_id, category_id)
);

-- Create junction table for operator payment methods (many-to-many)
CREATE TABLE public.operator_payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id uuid REFERENCES public.operators(id) ON DELETE CASCADE,
  payment_method_id uuid REFERENCES public.payment_methods(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(operator_id, payment_method_id)
);

-- Add indexes for performance
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_featured ON public.categories(is_featured) WHERE is_featured = true;
CREATE INDEX idx_categories_display_order ON public.categories(display_order);

CREATE INDEX idx_payment_methods_slug ON public.payment_methods(slug);
CREATE INDEX idx_payment_methods_featured ON public.payment_methods(is_featured) WHERE is_featured = true;

CREATE INDEX idx_mystery_boxes_slug ON public.mystery_boxes(slug);
CREATE INDEX idx_mystery_boxes_operator ON public.mystery_boxes(operator_id);
CREATE INDEX idx_mystery_boxes_active ON public.mystery_boxes(is_active) WHERE is_active = true;
CREATE INDEX idx_mystery_boxes_game ON public.mystery_boxes(game);
CREATE INDEX idx_mystery_boxes_price ON public.mystery_boxes(price);

CREATE INDEX idx_mystery_box_categories_mystery_box ON public.mystery_box_categories(mystery_box_id);
CREATE INDEX idx_mystery_box_categories_category ON public.mystery_box_categories(category_id);

CREATE INDEX idx_operator_payment_methods_operator ON public.operator_payment_methods(operator_id);
CREATE INDEX idx_operator_payment_methods_method ON public.operator_payment_methods(payment_method_id);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_box_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories - public read, admin manage
CREATE POLICY "Allow public read access to categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admin: manage categories" 
ON public.categories 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for payment_methods - public read, admin manage
CREATE POLICY "Allow public read access to payment_methods" 
ON public.payment_methods 
FOR SELECT 
USING (true);

CREATE POLICY "Admin: manage payment_methods" 
ON public.payment_methods 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for mystery_boxes - public read active boxes, admin manage all
CREATE POLICY "Allow public read access to active mystery boxes" 
ON public.mystery_boxes 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin: manage mystery_boxes" 
ON public.mystery_boxes 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for junction tables - public read, admin manage
CREATE POLICY "Allow public read access to mystery_box_categories" 
ON public.mystery_box_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admin: manage mystery_box_categories" 
ON public.mystery_box_categories 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Allow public read access to operator_payment_methods" 
ON public.operator_payment_methods 
FOR SELECT 
USING (true);

CREATE POLICY "Admin: manage operator_payment_methods" 
ON public.operator_payment_methods 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mystery_boxes_updated_at
  BEFORE UPDATE ON public.mystery_boxes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description_rich, display_order, is_featured) VALUES
('Apple Products', 'apple', 'Premium Apple device mystery boxes featuring iPhones, MacBooks, iPads, and more authentic Apple products.', 1, true),
('Knife Collections', 'knives', 'Exclusive knife collections featuring rare and legendary CS2 knife skins from top-tier cases.', 2, true),
('Weapon Skins', 'weapons', 'High-quality weapon skins and collections from popular games including CS2, Rust, and more.', 3, true),
('Glove Collections', 'gloves', 'Rare and expensive glove collections from CS2 and other gaming platforms.', 4, false),
('Tech Gadgets', 'tech', 'Latest technology gadgets and accessories from premium brands and manufacturers.', 5, false),
('Sticker Packs', 'stickers', 'Collectible sticker packs and rare foil stickers from various gaming collections.', 6, false),
('Mixed Items', 'mixed', 'Variety boxes containing mixed items from different categories and price ranges.', 7, false),
('Premium Boxes', 'premium', 'High-value premium boxes containing the most valuable and rare items available.', 8, true);

-- Insert sample payment methods
INSERT INTO public.payment_methods (name, slug, description_rich, display_order, is_featured) VALUES
('Cryptocurrency', 'crypto', 'Secure payments using Bitcoin, Ethereum, and other major cryptocurrencies.', 1, true),
('Skins', 'skins', 'Trade using CS2, Rust, and other game skins as payment method.', 2, true),
('Credit Cards', 'cards', 'Traditional payment using Visa, Mastercard, and other major credit cards.', 3, true),
('PayPal', 'paypal', 'Fast and secure payments using PayPal worldwide.', 4, false),
('Bank Transfer', 'bank', 'Direct bank transfers and wire payments for larger transactions.', 5, false),
('Digital Wallets', 'wallets', 'Payments using digital wallets like Skrill, Neteller, and similar services.', 6, false);