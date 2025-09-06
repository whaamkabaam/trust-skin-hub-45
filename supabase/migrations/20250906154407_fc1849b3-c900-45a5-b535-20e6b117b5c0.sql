-- Add auto-save fields to operators table
ALTER TABLE public.operators 
ADD COLUMN IF NOT EXISTS last_auto_saved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS draft_data jsonb;

-- Add published_at field for content scheduling
ALTER TABLE public.operators 
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;