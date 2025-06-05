-- Create storage buckets for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for property images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'property-images' 
  AND auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE 
USING (
  bucket_id = 'property-images' 
  AND auth.jwt() ->> 'role' = 'admin'
);
