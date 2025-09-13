-- Fix security vulnerability in subscribers table RLS policies
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create secure policies that only allow users to modify their own subscription data
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE 
USING ((user_id = auth.uid()) OR (email = auth.email()));

CREATE POLICY "insert_own_subscription" ON public.subscribers
FOR INSERT 
WITH CHECK ((user_id = auth.uid()) OR (email = auth.email()));