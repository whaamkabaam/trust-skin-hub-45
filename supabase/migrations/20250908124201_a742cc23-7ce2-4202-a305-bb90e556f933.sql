-- Create operator_bonuses table
CREATE TABLE public.operator_bonuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  bonus_type TEXT NOT NULL, -- 'welcome', 'daily', 'cashback', 'vip', 'referral', 'tournament', 'freeplay'
  title TEXT NOT NULL,
  description TEXT,
  value TEXT, -- e.g., "5%", "$10", "100 coins"
  terms TEXT,
  is_active BOOLEAN DEFAULT true,
  order_number INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create operator_payments table
CREATE TABLE public.operator_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL, -- 'deposit', 'withdrawal'
  payment_method TEXT NOT NULL, -- 'crypto', 'skins', 'credit_card', 'paypal', etc.
  minimum_amount DECIMAL,
  maximum_amount DECIMAL,
  fee_percentage DECIMAL,
  fee_fixed DECIMAL,
  processing_time TEXT, -- e.g., "Instant", "1-24 hours"
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create operator_features table
CREATE TABLE public.operator_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- 'game', 'mode', 'platform', 'community'
  feature_name TEXT NOT NULL,
  description TEXT,
  is_highlighted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create operator_security table
CREATE TABLE public.operator_security (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  ssl_enabled BOOLEAN DEFAULT false,
  ssl_provider TEXT,
  license_info TEXT,
  compliance_certifications TEXT[],
  data_protection_info TEXT,
  responsible_gaming_info TEXT,
  provably_fair BOOLEAN DEFAULT false,
  provably_fair_description TEXT,
  complaints_platform TEXT,
  audit_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create operator_faqs table
CREATE TABLE public.operator_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT, -- 'general', 'payments', 'bonuses', 'security', 'support'
  order_number INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Extend operators table with additional fields
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS site_type TEXT; -- 'case_opening', 'casino', 'trading', 'mixed'
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS promo_code TEXT;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified'; -- 'verified', 'unverified', 'pending'
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS company_background TEXT;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS performance_metrics JSONB DEFAULT '{}';
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS prize_info JSONB DEFAULT '{}';
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS shipping_info JSONB DEFAULT '{}';
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS support_channels TEXT[];
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS community_links JSONB DEFAULT '{}';
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS withdrawal_time_crypto TEXT;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS withdrawal_time_skins TEXT;
ALTER TABLE public.operators ADD COLUMN IF NOT EXISTS withdrawal_time_fiat TEXT;

-- Enable RLS on new tables
ALTER TABLE public.operator_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_faqs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables (public read for published operators, admin manage all)
CREATE POLICY "Allow public read for published operators" ON public.operator_bonuses
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.operators 
    WHERE operators.id = operator_bonuses.operator_id AND operators.published = true
  ));

CREATE POLICY "Admin: manage operator_bonuses" ON public.operator_bonuses
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Allow public read for published operators" ON public.operator_payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.operators 
    WHERE operators.id = operator_payments.operator_id AND operators.published = true
  ));

CREATE POLICY "Admin: manage operator_payments" ON public.operator_payments
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Allow public read for published operators" ON public.operator_features
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.operators 
    WHERE operators.id = operator_features.operator_id AND operators.published = true
  ));

CREATE POLICY "Admin: manage operator_features" ON public.operator_features
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Allow public read for published operators" ON public.operator_security
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.operators 
    WHERE operators.id = operator_security.operator_id AND operators.published = true
  ));

CREATE POLICY "Admin: manage operator_security" ON public.operator_security
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Allow public read for published operators" ON public.operator_faqs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.operators 
    WHERE operators.id = operator_faqs.operator_id AND operators.published = true
  ));

CREATE POLICY "Admin: manage operator_faqs" ON public.operator_faqs
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Create triggers for updated_at
CREATE TRIGGER update_operator_bonuses_updated_at
  BEFORE UPDATE ON public.operator_bonuses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_payments_updated_at
  BEFORE UPDATE ON public.operator_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_features_updated_at
  BEFORE UPDATE ON public.operator_features
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_security_updated_at
  BEFORE UPDATE ON public.operator_security
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operator_faqs_updated_at
  BEFORE UPDATE ON public.operator_faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();