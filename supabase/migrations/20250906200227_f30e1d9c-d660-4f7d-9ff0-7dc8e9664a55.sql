-- Remove security vulnerabilities and fix authentication
-- 1. Remove the development backdoor policy from operators table
DROP POLICY IF EXISTS "DEV: anon full access to operators" ON public.operators;

-- 2. Ensure admin_users table has proper RLS
-- Update the admin check policy to be more restrictive
DROP POLICY IF EXISTS "Admin: read admin_users" ON public.admin_users;
CREATE POLICY "Admin: read own admin_users" 
ON public.admin_users 
FOR SELECT 
USING (email = (auth.jwt() ->> 'email') OR is_admin());

-- 3. Add index for better performance on operators search
CREATE INDEX IF NOT EXISTS idx_operators_search_vector ON public.operators USING gin(search_vector);

-- 4. Ensure the admin user exists and can access the system
INSERT INTO public.admin_users (email, role) 
VALUES ('admin@unpacked.gg', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- 5. Add policy for content_sections (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Admin: manage content_sections" ON public.content_sections;
CREATE POLICY "Admin: manage content_sections"
ON public.content_sections
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());