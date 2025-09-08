# Setup Guide for SnapRoast App

## Required API Keys (Already Added to Supabase Secrets)
✅ **OPENAI_API_KEY** - Added
✅ **GEMINI_API_KEY** - Added  
✅ **STRIPE_SECRET_KEY** - Added
✅ **ELEVENLABS_API_KEY** - Added

## Database Setup Required

### 1. Create Storage Bucket
Go to Supabase Dashboard > Storage > Create new bucket:
- **Bucket Name**: `user-uploads`
- **Public**: ✅ Enabled

### 2. Set Storage Policies
Go to Storage > user-uploads > Policies, add these policies:

**Policy 1: Users can upload their own files**
```sql
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: Users can view their own files**  
```sql
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Public can view files**
```sql
CREATE POLICY "Public can view uploaded files" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');
```

### 3. Create Roasts Table (if not exists)
Go to Supabase Dashboard > SQL Editor, run:

```sql
CREATE TABLE IF NOT EXISTS public.roasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  roast_lines TEXT[] NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'generated',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own roasts
CREATE POLICY "Users can view their own roasts" ON public.roasts
FOR SELECT USING (user_id = auth.uid());

-- Create policy for edge functions to insert roasts  
CREATE POLICY "Service role can insert roasts" ON public.roasts
FOR INSERT WITH CHECK (true);

-- Create policy for users to update their own roasts
CREATE POLICY "Users can update their own roasts" ON public.roasts  
FOR UPDATE USING (user_id = auth.uid());
```

### 4. Update Profiles Table
```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS roasts_generated INTEGER DEFAULT 0;
```

## How to Test

1. **Login with Google** - Should work automatically
2. **Subscribe** - Click subscribe button, complete Stripe checkout
3. **Upload Image** - Use the upload or camera feature
4. **Generate Roast** - Should analyze image, generate roast, and create audio

## Error Messages Fixed

- ✅ Better error handling in generate-roast function
- ✅ Detailed logging for debugging  
- ✅ Subscription verification
- ✅ Image storage in Supabase
- ✅ Improved TTS with ElevenLabs
- ✅ Frontend error message improvements

## Common Issues & Solutions

**"Edge Function returned a non-2xx status code"**
- Check if API keys are properly set in Supabase secrets
- Verify user has active subscription
- Check console logs in edge function for detailed error

**"No features detected"**  
- Use clearer photo with face visible
- Ensure good lighting
- Try different angle

**TTS Issues**
- Verify ElevenLabs API key is valid
- Check credit balance in ElevenLabs account

**Storage Issues**
- Ensure user-uploads bucket exists and is public
- Verify storage policies are correctly set