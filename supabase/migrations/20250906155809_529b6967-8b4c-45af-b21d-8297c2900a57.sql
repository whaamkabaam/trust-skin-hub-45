-- Create cron job for automated publishing
SELECT cron.schedule(
  'publish-scheduled-content',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://aclxqriujtkpqceqtesg.supabase.co/functions/v1/schedule-publisher',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbHhxcml1anRrcHFjZXF0ZXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjYwNDUsImV4cCI6MjA3Mjc0MjA0NX0.yFxrQO1sDjJUwqlaFOQ51YLCuDCiBvOapoZJ68tm3BE"}'::jsonb,
        body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);