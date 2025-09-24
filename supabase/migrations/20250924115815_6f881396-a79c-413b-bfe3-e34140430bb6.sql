-- Add password management fields to admin_users table
ALTER TABLE public.admin_users 
ADD COLUMN current_password TEXT,
ADD COLUMN password_reset_count INTEGER DEFAULT 0,
ADD COLUMN last_password_reset TIMESTAMP WITH TIME ZONE;