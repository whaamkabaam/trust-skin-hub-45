-- Add media asset type field and operator promo code
ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'image';

-- Add promo code to operators table
ALTER TABLE operators ADD COLUMN IF NOT EXISTS promo_code TEXT;

-- Add index for media asset type for better performance
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(type);

-- Update existing media assets to have a default type
UPDATE media_assets SET type = 'screenshot' WHERE type = 'image' OR type IS NULL;