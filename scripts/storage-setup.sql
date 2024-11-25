-- Create the orders bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('orders', 'orders', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'orders');

-- Allow authenticated users to read files
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'orders');

-- Allow authenticated users to delete their files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'orders');

-- Allow public access to files (if needed)
CREATE POLICY "Allow public access to order photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'orders');

-- Create RLS policy for the orders bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
