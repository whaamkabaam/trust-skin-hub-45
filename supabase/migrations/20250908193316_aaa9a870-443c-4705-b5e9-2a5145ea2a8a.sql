-- Check and create storage policies for operator-media bucket
-- Allow public read access to operator-media files
CREATE POLICY "Allow public read access to operator media" ON storage.objects
FOR SELECT USING (bucket_id = 'operator-media');

-- Allow authenticated users to upload to operator-media
CREATE POLICY "Allow authenticated upload to operator media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'operator-media' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their operator media
CREATE POLICY "Allow authenticated update to operator media" ON storage.objects
FOR UPDATE USING (bucket_id = 'operator-media' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete operator media  
CREATE POLICY "Allow authenticated delete of operator media" ON storage.objects
FOR DELETE USING (bucket_id = 'operator-media' AND auth.role() = 'authenticated');