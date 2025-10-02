-- Create casesgg table
CREATE TABLE public.casesgg (
  id INTEGER PRIMARY KEY,
  box_name TEXT NOT NULL,
  box_price NUMERIC NOT NULL,
  box_image TEXT,
  box_url TEXT,
  expected_value_percent NUMERIC,
  floor_rate_percent NUMERIC,
  standard_deviation_percent NUMERIC,
  volatility_bucket TEXT,
  ev_to_price_ratio NUMERIC,
  category TEXT,
  tags JSONB,
  jackpot_items JSONB,
  unwanted_items JSONB,
  all_items JSONB,
  last_updated TIMESTAMPTZ,
  data_source TEXT
);

-- Create hypedrop table
CREATE TABLE public.hypedrop (
  id INTEGER PRIMARY KEY,
  box_name TEXT NOT NULL,
  box_price NUMERIC NOT NULL,
  box_image TEXT,
  box_url TEXT,
  expected_value_percent NUMERIC,
  floor_rate_percent NUMERIC,
  standard_deviation_percent NUMERIC,
  volatility_bucket TEXT,
  ev_to_price_ratio NUMERIC,
  category TEXT,
  tags JSONB,
  jackpot_items JSONB,
  unwanted_items JSONB,
  all_items JSONB,
  last_updated TIMESTAMPTZ,
  data_source TEXT
);

-- Create luxdrop table
CREATE TABLE public.luxdrop (
  id INTEGER PRIMARY KEY,
  box_name TEXT NOT NULL,
  box_price NUMERIC NOT NULL,
  box_image TEXT,
  box_url TEXT,
  expected_value_percent NUMERIC,
  floor_rate_percent NUMERIC,
  standard_deviation_percent NUMERIC,
  volatility_bucket TEXT,
  ev_to_price_ratio NUMERIC,
  category TEXT,
  tags JSONB,
  jackpot_items JSONB,
  unwanted_items JSONB,
  all_items JSONB,
  last_updated TIMESTAMPTZ,
  data_source TEXT
);

-- Create rillabox table
CREATE TABLE public.rillabox (
  id INTEGER PRIMARY KEY,
  box_name TEXT NOT NULL,
  box_price NUMERIC NOT NULL,
  box_image TEXT,
  box_url TEXT,
  expected_value_percent NUMERIC,
  floor_rate_percent NUMERIC,
  standard_deviation_percent NUMERIC,
  volatility_bucket TEXT,
  ev_to_price_ratio NUMERIC,
  category TEXT,
  tags JSONB,
  jackpot_items JSONB,
  unwanted_items JSONB,
  all_items JSONB,
  last_updated TIMESTAMPTZ,
  data_source TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.casesgg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hypedrop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luxdrop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rillabox ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Allow public read access to casesgg"
  ON public.casesgg FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to hypedrop"
  ON public.hypedrop FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to luxdrop"
  ON public.luxdrop FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to rillabox"
  ON public.rillabox FOR SELECT
  USING (true);

-- Create admin management policies
CREATE POLICY "Admin: manage casesgg"
  ON public.casesgg FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin: manage hypedrop"
  ON public.hypedrop FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin: manage luxdrop"
  ON public.luxdrop FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin: manage rillabox"
  ON public.rillabox FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create indexes for better query performance
CREATE INDEX idx_casesgg_category ON public.casesgg(category);
CREATE INDEX idx_casesgg_volatility ON public.casesgg(volatility_bucket);
CREATE INDEX idx_casesgg_tags ON public.casesgg USING GIN(tags);

CREATE INDEX idx_hypedrop_category ON public.hypedrop(category);
CREATE INDEX idx_hypedrop_volatility ON public.hypedrop(volatility_bucket);
CREATE INDEX idx_hypedrop_tags ON public.hypedrop USING GIN(tags);

CREATE INDEX idx_luxdrop_category ON public.luxdrop(category);
CREATE INDEX idx_luxdrop_volatility ON public.luxdrop(volatility_bucket);
CREATE INDEX idx_luxdrop_tags ON public.luxdrop USING GIN(tags);

CREATE INDEX idx_rillabox_category ON public.rillabox(category);
CREATE INDEX idx_rillabox_volatility ON public.rillabox(volatility_bucket);
CREATE INDEX idx_rillabox_tags ON public.rillabox USING GIN(tags);