-- Add missing fields to reviews table to support rich review data
ALTER TABLE public.reviews 
ADD COLUMN title TEXT,
ADD COLUMN username TEXT,
ADD COLUMN verification_status TEXT DEFAULT 'unverified',
ADD COLUMN subscores JSONB DEFAULT '{"trust": 5, "fees": 5, "ux": 5, "support": 5}'::jsonb,
ADD COLUMN helpful_votes JSONB DEFAULT '{"up": 0, "down": 0}'::jsonb,
ADD COLUMN photos TEXT[],
ADD COLUMN operator_response JSONB;

-- Update existing reviews with sample rich data for casesgg operator
UPDATE public.reviews 
SET 
  title = CASE 
    WHEN rating = 5 THEN 'Excellent variety and fair odds'
    WHEN rating = 4 THEN 'Great customer support experience'
    WHEN rating = 3 THEN 'Fast withdrawals, highly recommend'
    ELSE 'Good overall experience'
  END,
  username = CASE 
    WHEN rating = 5 THEN 'TradingPro2024'
    WHEN rating = 4 THEN 'SkinCollector'
    WHEN rating = 3 THEN 'CryptoTrader99'
    ELSE 'Anonymous'
  END,
  verification_status = CASE 
    WHEN rating = 5 THEN 'opener'
    WHEN rating = 4 THEN 'operator'
    ELSE 'unverified'
  END,
  subscores = CASE 
    WHEN rating = 5 THEN '{"trust": 5, "fees": 4, "ux": 5, "support": 5}'::jsonb
    WHEN rating = 4 THEN '{"trust": 4, "fees": 4, "ux": 4, "support": 5}'::jsonb
    WHEN rating = 3 THEN '{"trust": 3, "fees": 3, "ux": 4, "support": 3}'::jsonb
    ELSE '{"trust": 4, "fees": 3, "ux": 4, "support": 4}'::jsonb
  END,
  helpful_votes = CASE 
    WHEN rating >= 4 THEN '{"up": 12, "down": 2}'::jsonb
    ELSE '{"up": 5, "down": 1}'::jsonb
  END
WHERE operator_id = (SELECT id FROM operators WHERE slug = 'casesgg');

-- Add operator response to 4-star reviews
UPDATE public.reviews 
SET operator_response = '{"body": "Thank you for your feedback! We are constantly working to improve our platform and provide the best experience for our users.", "createdAt": "2024-01-20T10:30:00Z"}'::jsonb
WHERE operator_id = (SELECT id FROM operators WHERE slug = 'casesgg') 
AND rating = 4;