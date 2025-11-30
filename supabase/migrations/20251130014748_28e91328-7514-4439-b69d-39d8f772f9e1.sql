-- Phase 1: Migrate Security Text Fields to Content Sections
-- Move existing operator_security text data to content_sections

INSERT INTO content_sections (operator_id, section_key, heading, rich_text_content, order_number)
SELECT 
  os.operator_id,
  'licensing',
  'Licensing & Regulation',
  os.license_info,
  100
FROM operator_security os
WHERE os.license_info IS NOT NULL 
  AND os.license_info != ''
  AND NOT EXISTS (
    SELECT 1 FROM content_sections cs 
    WHERE cs.operator_id = os.operator_id 
    AND cs.section_key = 'licensing'
  );

INSERT INTO content_sections (operator_id, section_key, heading, rich_text_content, order_number)
SELECT 
  os.operator_id,
  'provably_fair',
  'Provably Fair Gaming',
  os.provably_fair_description,
  101
FROM operator_security os
WHERE os.provably_fair_description IS NOT NULL 
  AND os.provably_fair_description != ''
  AND NOT EXISTS (
    SELECT 1 FROM content_sections cs 
    WHERE cs.operator_id = os.operator_id 
    AND cs.section_key = 'provably_fair'
  );

INSERT INTO content_sections (operator_id, section_key, heading, rich_text_content, order_number)
SELECT 
  os.operator_id,
  'data_protection',
  'Data Protection & Privacy',
  os.data_protection_info,
  102
FROM operator_security os
WHERE os.data_protection_info IS NOT NULL 
  AND os.data_protection_info != ''
  AND NOT EXISTS (
    SELECT 1 FROM content_sections cs 
    WHERE cs.operator_id = os.operator_id 
    AND cs.section_key = 'data_protection'
  );

INSERT INTO content_sections (operator_id, section_key, heading, rich_text_content, order_number)
SELECT 
  os.operator_id,
  'responsible_gaming',
  'Responsible Gaming',
  os.responsible_gaming_info,
  103
FROM operator_security os
WHERE os.responsible_gaming_info IS NOT NULL 
  AND os.responsible_gaming_info != ''
  AND NOT EXISTS (
    SELECT 1 FROM content_sections cs 
    WHERE cs.operator_id = os.operator_id 
    AND cs.section_key = 'responsible_gaming'
  );

INSERT INTO content_sections (operator_id, section_key, heading, rich_text_content, order_number)
SELECT 
  os.operator_id,
  'complaints',
  'Complaints & Dispute Resolution',
  os.complaints_platform,
  104
FROM operator_security os
WHERE os.complaints_platform IS NOT NULL 
  AND os.complaints_platform != ''
  AND NOT EXISTS (
    SELECT 1 FROM content_sections cs 
    WHERE cs.operator_id = os.operator_id 
    AND cs.section_key = 'complaints'
  );

INSERT INTO content_sections (operator_id, section_key, heading, rich_text_content, order_number)
SELECT 
  os.operator_id,
  'audit',
  'Security Audits & Testing',
  os.audit_info,
  105
FROM operator_security os
WHERE os.audit_info IS NOT NULL 
  AND os.audit_info != ''
  AND NOT EXISTS (
    SELECT 1 FROM content_sections cs 
    WHERE cs.operator_id = os.operator_id 
    AND cs.section_key = 'audit'
  );

-- Phase 2: Fix Old Section Keys
-- Update existing content_sections with old keys to new fixed keys

UPDATE content_sections
SET section_key = 'bonuses_summary'
WHERE section_key = 'bonuses';

UPDATE content_sections
SET section_key = 'security_overview'
WHERE section_key = 'security';

UPDATE content_sections
SET section_key = 'responsible_gaming'
WHERE section_key = 'responsible';