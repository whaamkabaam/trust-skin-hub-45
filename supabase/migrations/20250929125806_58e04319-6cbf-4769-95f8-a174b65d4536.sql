-- Fix admin_users RLS policies to be more secure
DROP POLICY IF EXISTS "Admin: read own admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin: manage admin_users" ON public.admin_users;

-- Create more secure admin policies - only authenticated admins can access
CREATE POLICY "Admin: read admin_users only when authenticated admin" 
ON public.admin_users 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admin: manage admin_users only when authenticated admin" 
ON public.admin_users 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Clean up test/placeholder operators 
UPDATE operators 
SET published = false 
WHERE name IN ('test', 'efa', 'thisisjustatester', 'thisisjustatester (Copy)', 'thisisjustatester (Copy) (Copy)');

-- Fix category assignments - remove mystery-boxes from operators with no mystery boxes
UPDATE operators 
SET categories = array_remove(categories, 'mystery-boxes')
WHERE id IN (
  SELECT o.id 
  FROM operators o 
  WHERE 'mystery-boxes' = ANY(o.categories)
  AND NOT EXISTS (
    SELECT 1 FROM mystery_boxes mb 
    WHERE mb.operator_id = o.id 
    AND mb.is_active = true
  )
);

-- Clean up invalid categories from test operators
UPDATE operators 
SET categories = ARRAY[]::text[]
WHERE categories && ARRAY['edeasd', 'TEST 1', 'TEST 2', 'TEST 3', 'thisisjustatester', 'thisisjustatester 2', 'thisisjustatester 3'];

-- Add proper categories to Cases.gg (no mystery boxes, so luxury/physical items)
UPDATE operators 
SET categories = ARRAY['luxury-items', 'physical-prizes']
WHERE name = 'Cases.gg';

-- Ensure operators with mystery boxes have the mystery-boxes category
UPDATE operators 
SET categories = array_append(categories, 'mystery-boxes')
WHERE id IN (
  SELECT DISTINCT o.id 
  FROM operators o
  JOIN mystery_boxes mb ON mb.operator_id = o.id
  WHERE mb.is_active = true
  AND NOT ('mystery-boxes' = ANY(o.categories))
);

-- Create payment method associations (sample data)
INSERT INTO operator_payment_methods (operator_id, payment_method_id)
SELECT DISTINCT o.id, pm.id
FROM operators o
CROSS JOIN payment_methods pm
WHERE o.published = true
AND o.name NOT IN ('test', 'efa', 'thisisjustatester', 'thisisjustatester (Copy)', 'thisisjustatester (Copy) (Copy)')
ON CONFLICT DO NOTHING;