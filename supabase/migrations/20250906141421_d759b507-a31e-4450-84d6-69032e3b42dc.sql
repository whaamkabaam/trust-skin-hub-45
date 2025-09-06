-- 1) Helper function to safely check if current JWT email is an admin
--    Using SECURITY DEFINER to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.email = (auth.jwt() ->> 'email')
      AND au.role = 'admin'
  );
$$;

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- 2) Replace recursive policies on admin_users with function-based policies
DROP POLICY IF EXISTS "Allow admin role users to manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow admin users to read admin users" ON public.admin_users;

CREATE POLICY "Admin: read admin_users"
ON public.admin_users
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admin: manage admin_users"
ON public.admin_users
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3) Update all other tables that referenced admin_users directly to use is_admin()
-- operators
DROP POLICY IF EXISTS "Allow admin users full access to operators" ON public.operators;
CREATE POLICY "Admin: manage operators"
ON public.operators
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- TEMP DEV POLICY: Allow anon full access to operators to unblock CMS while auth is not implemented
-- IMPORTANT: Remove this before production
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'operators' AND policyname = 'DEV: anon full access to operators'
  ) THEN
    EXECUTE $$
      CREATE POLICY "DEV: anon full access to operators"
      ON public.operators
      FOR ALL
      TO anon
      USING (true)
      WITH CHECK (true);
    $$;
  END IF;
END $$;

-- content_sections
DROP POLICY IF EXISTS "Allow admin users full access to content sections" ON public.content_sections;
CREATE POLICY "Admin: manage content_sections"
ON public.content_sections
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- media_assets
DROP POLICY IF EXISTS "Allow admin users full access to media assets" ON public.media_assets;
CREATE POLICY "Admin: manage media_assets"
ON public.media_assets
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- reviews
DROP POLICY IF EXISTS "Allow admin users full access to reviews" ON public.reviews;
CREATE POLICY "Admin: manage reviews"
ON public.reviews
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- seo_metadata
DROP POLICY IF EXISTS "Allow admin users full access to SEO metadata" ON public.seo_metadata;
CREATE POLICY "Admin: manage seo_metadata"
ON public.seo_metadata
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());