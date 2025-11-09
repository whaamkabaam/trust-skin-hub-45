-- Update feature types from generic 'gameplay' to proper semantic types
-- Premium features: Most valuable, special features
UPDATE operator_features 
SET feature_type = 'premium'
WHERE feature_name IN ('Battles', 'Instant Resell')
  AND feature_type = 'gameplay';

-- Core features: Essential functionality
UPDATE operator_features 
SET feature_type = 'core'
WHERE feature_name IN ('Community Chat', 'Drop Ticker')
  AND feature_type = 'gameplay';

-- Utility features: Additional tools and conveniences
UPDATE operator_features 
SET feature_type = 'utility'
WHERE feature_name IN ('Item Vault', 'Tournaments and Races')
  AND feature_type = 'gameplay';