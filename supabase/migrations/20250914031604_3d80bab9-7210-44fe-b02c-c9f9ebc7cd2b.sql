-- Create storage bucket for form images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('form-images', 'form-images', true);

-- Create policies for form images
CREATE POLICY "Form images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'form-images');

CREATE POLICY "Users can upload their own form images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'form-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own form images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'form-images' AND auth.uid()::text = (storage.foldername(name))[1]);