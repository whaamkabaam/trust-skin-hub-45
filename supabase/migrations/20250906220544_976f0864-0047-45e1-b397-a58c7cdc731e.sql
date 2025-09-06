-- Fix storage policies for operator-media bucket to allow admin uploads

-- Policy for SELECT (viewing files)
CREATE POLICY "Admin: view operator media files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'operator-media' AND is_admin());

-- Policy for INSERT (uploading files)  
CREATE POLICY "Admin: upload operator media files"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'operator-media' AND is_admin());

-- Policy for UPDATE (updating file metadata)
CREATE POLICY "Admin: update operator media files"
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'operator-media' AND is_admin());

-- Policy for DELETE (deleting files)
CREATE POLICY "Admin: delete operator media files"
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'operator-media' AND is_admin());

-- Also ensure public access for published operators (for frontend display)
CREATE POLICY "Public: view published operator media"
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'operator-media' AND 
  EXISTS (
    SELECT 1 FROM operators 
    WHERE operators.published = true 
  )
);