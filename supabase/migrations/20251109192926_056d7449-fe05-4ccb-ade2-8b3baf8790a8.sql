-- Add new array columns for features, modes, and games to operators table
ALTER TABLE operators
ADD COLUMN IF NOT EXISTS other_features text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gaming_modes text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS games text[] DEFAULT '{}';