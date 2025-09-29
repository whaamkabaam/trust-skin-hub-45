import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Schedule publisher function started');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date().toISOString();
    
    console.log('Checking for scheduled content to publish...');

    // Find all operators that are scheduled and past their publish time
    const { data: scheduledOperators, error: fetchError } = await supabaseClient
      .from('operators')
      .select('id, scheduled_publish_at, publish_status')
      .eq('publish_status', 'scheduled')
      .lte('scheduled_publish_at', now);

    if (fetchError) {
      console.error('Error fetching scheduled operators:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${scheduledOperators?.length || 0} operators to publish`);

    if (!scheduledOperators || scheduledOperators.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No scheduled content to publish',
          publishedCount: 0 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Update all scheduled operators to published
    const publishPromises = scheduledOperators.map(async (operator: any) => {
      const { error: updateError } = await supabaseClient
        .from('operators')
        .update({
          publish_status: 'published',
          published_at: now,
          scheduled_publish_at: null
        })
        .eq('id', operator.id);

      if (updateError) {
        console.error(`Error publishing operator ${operator.id}:`, updateError);
        return { id: operator.id, success: false, error: updateError.message };
      }

      console.log(`Successfully published operator ${operator.id}`);
      return { id: operator.id, success: true };
    });

    const results = await Promise.all(publishPromises);
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`Publishing complete. Success: ${successCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        publishedCount: successCount,
        errorCount,
        results,
        timestamp: now
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Schedule publisher error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});