-- Create cron job for content scheduling
SELECT cron.schedule(
  'publish-scheduled-content',
  '*/5 * * * *', -- Every 5 minutes
  $$
  UPDATE public.operators 
  SET 
    published = true,
    published_at = now(),
    publish_status = 'published'
  WHERE 
    scheduled_publish_at IS NOT NULL 
    AND scheduled_publish_at <= now() 
    AND publish_status = 'scheduled';
  $$
);