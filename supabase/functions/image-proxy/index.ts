import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return new Response('Missing url parameter', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Validate URL
    try {
      new URL(imageUrl);
    } catch {
      return new Response('Invalid URL', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Fetch image from origin with appropriate headers
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': new URL(imageUrl).origin,
      },
    });

    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageUrl} - ${imageResponse.status}`);
      return new Response('Failed to fetch image', { 
        status: imageResponse.status,
        headers: corsHeaders
      });
    }

    // Get image data and content type
    const imageData = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Return image with permissive CORS and caching headers
    return new Response(imageData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
        'CDN-Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error in image-proxy:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
