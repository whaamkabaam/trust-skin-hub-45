-- Make operator_id nullable in media_assets table to allow uploads before operator association
ALTER TABLE public.media_assets 
ALTER COLUMN operator_id DROP NOT NULL;