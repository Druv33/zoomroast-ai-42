-- Rename roasts_generated to forms_generated in profiles table
ALTER TABLE public.profiles 
RENAME COLUMN roasts_generated TO forms_generated;

-- Update any existing data if needed (optional cleanup)
-- This is a safe operation as it just renames the column