-- Fix storage policies for operator-media bucket
-- First, drop existing conflicting policies
DROP POLICY IF EXISTS "Admin: manage operator-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin: upload operator-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin: view operator-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin: update operator-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin: delete operator-media" ON storage.objects;
DROP POLICY IF EXISTS "Public: view operator-media" ON storage.objects;

-- Create consolidated storage policies for operator-media bucket
CREATE POLICY "Allow public read access to operator-media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'operator-media');

CREATE POLICY "Allow admin upload to operator-media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'operator-media' AND is_admin());

CREATE POLICY "Allow admin update to operator-media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'operator-media' AND is_admin());

CREATE POLICY "Allow admin delete from operator-media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'operator-media' AND is_admin());

-- Fix is_admin() function to be case-insensitive
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE LOWER(au.email) = LOWER(auth.jwt() ->> 'email')
      AND au.role = 'admin'
  );
$$;