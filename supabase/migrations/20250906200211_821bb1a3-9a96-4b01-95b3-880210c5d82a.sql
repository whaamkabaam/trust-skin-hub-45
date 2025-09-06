-- Remove security vulnerabilities and fix authentication
-- 1. Remove the development backdoor policy from operators table
DROP POLICY IF EXISTS "DEV: anon full access to operators" ON public.operators;

-- 2. Clear any existing cron jobs safely
DELETE FROM cron.job WHERE jobname IN ('invoke-schedule-publisher-every-minute', 'content-scheduler', 'content-publisher');

-- Create a single properly configured cron job for content publishing
SELECT cron.schedule(
  'content-publisher',
  '* * * * *', -- every minute
  $$
  SELECT net.http_post(
    url := 'https://aclxqriujtkpqceqtesg.supabase.co/functions/v1/schedule-publisher',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbHhxcml1anRrcHFjZXF0ZXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjYwNDUsImV4cCI6MjA3Mjc0MjA0NX0.yFxrQO1sDjJUwqlaFOQ51YLCuDCiBvOapoZJ68tm3BE"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);

-- 3. Ensure admin_users table has proper RLS
-- Update the admin check policy to be more restrictive
DROP POLICY IF EXISTS "Admin: read admin_users" ON public.admin_users;
CREATE POLICY "Admin: read own admin_users" 
ON public.admin_users 
FOR SELECT 
USING (email = (auth.jwt() ->> 'email') OR is_admin());

-- 4. Add index for better performance on operators search
CREATE INDEX IF NOT EXISTS idx_operators_search_vector ON public.operators USING gin(search_vector);

-- 5. Ensure the admin user exists and can access the system
INSERT INTO public.admin_users (email, role) 
VALUES ('admin@unpacked.gg', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- 6. Add policy for content_sections (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Admin: manage content_sections" ON public.content_sections;
CREATE POLICY "Admin: manage content_sections"
ON public.content_sections
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());