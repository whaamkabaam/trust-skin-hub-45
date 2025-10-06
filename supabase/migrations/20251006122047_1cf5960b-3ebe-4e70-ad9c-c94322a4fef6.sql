-- Phase 2: Complete Payment System Migration

-- Step 1: Add detailed configuration columns to operator_payment_methods
ALTER TABLE operator_payment_methods
ADD COLUMN IF NOT EXISTS method_type text NOT NULL DEFAULT 'deposit',
ADD COLUMN IF NOT EXISTS minimum_amount numeric,
ADD COLUMN IF NOT EXISTS maximum_amount numeric,
ADD COLUMN IF NOT EXISTS fee_percentage numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fee_fixed numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_time text DEFAULT 'Instant',
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true;

-- Step 2: Add check constraint for method_type
ALTER TABLE operator_payment_methods
ADD CONSTRAINT method_type_check CHECK (method_type IN ('deposit', 'withdrawal', 'both'));

-- Step 3: Migrate any existing data from operator_payments to operator_payment_methods
-- This ensures no data loss during migration
INSERT INTO operator_payment_methods (
  operator_id, 
  payment_method_id, 
  method_type, 
  minimum_amount, 
  maximum_amount, 
  fee_percentage, 
  fee_fixed, 
  processing_time, 
  is_available
)
SELECT 
  op.operator_id,
  pm.id as payment_method_id,
  op.method_type,
  op.minimum_amount,
  op.maximum_amount,
  op.fee_percentage,
  op.fee_fixed,
  op.processing_time,
  op.is_available
FROM operator_payments op
JOIN payment_methods pm ON pm.slug = op.payment_method OR pm.name = op.payment_method
WHERE NOT EXISTS (
  SELECT 1 FROM operator_payment_methods opm 
  WHERE opm.operator_id = op.operator_id 
  AND opm.payment_method_id = pm.id
)
ON CONFLICT DO NOTHING;

-- Step 4: Drop the old operator_payments table
DROP TABLE IF EXISTS operator_payments CASCADE;

-- Step 5: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_operator_payment_methods_operator_id 
ON operator_payment_methods(operator_id);

CREATE INDEX IF NOT EXISTS idx_operator_payment_methods_method_type 
ON operator_payment_methods(method_type);