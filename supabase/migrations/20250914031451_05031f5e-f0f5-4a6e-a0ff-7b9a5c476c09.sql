-- Add forms_generated column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN forms_generated INTEGER NOT NULL DEFAULT 0;

-- Add index for better performance
CREATE INDEX idx_profiles_forms_generated ON public.profiles(forms_generated);

-- Add downloads_count column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN downloads_count INTEGER NOT NULL DEFAULT 0;