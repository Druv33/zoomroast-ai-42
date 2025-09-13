-- Create roasts table for storing generated roast content
CREATE TABLE public.roasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roast_lines TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed',
  video_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own roasts" 
ON public.roasts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roasts" 
ON public.roasts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roasts" 
ON public.roasts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roasts" 
ON public.roasts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_roasts_updated_at
BEFORE UPDATE ON public.roasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_roasts_user_id ON public.roasts(user_id);
CREATE INDEX idx_roasts_created_at ON public.roasts(created_at DESC);