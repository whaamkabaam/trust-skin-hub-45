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
    const { message, mode = 'chat' } = await req.json();

    if (mode === 'parse') {
      // AI-powered content parsing for operator/review data
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-pro',
          messages: [
            {
              role: 'system',
              content: `You are a specialized parser for gambling platform reviews and operator information. Extract structured data from the provided text and return a JSON response with the following structure:

{
  "operator_data": {
    "name": "string or null",
    "site_type": "casino|case_opening|sports_betting|poker|null",
    "launch_year": "number or null",
    "verdict": "string or null",
    "bonus_terms": "string or null",
    "fairness_info": "string or null",
    "categories": ["array", "of", "strings"],
    "pros": ["array", "of", "positives"],
    "cons": ["array", "of", "negatives"],
    "supported_countries": ["array", "of", "countries"],
    "ratings": {
      "overall": "number 0-10 or null",
      "trust": "number 0-10 or null", 
      "value": "number 0-10 or null",
      "payments": "number 0-10 or null",
      "offering": "number 0-10 or null",
      "ux": "number 0-10 or null",
      "support": "number 0-10 or null"
    },
    "kyc_required": "boolean or null",
    "verification_status": "verified|unverified|pending|null",
    "company_background": "string or null",
    "promo_code": "string or null",
    "withdrawal_time_crypto": "string or null",
    "withdrawal_time_skins": "string or null",
    "withdrawal_time_fiat": "string or null"
  },
  "review_data": {
    "rating": "number 1-5 or null",
    "title": "string or null",
    "content": "string or null",
    "subscores": {
      "trust": "number 1-5 or null",
      "fees": "number 1-5 or null", 
      "ux": "number 1-5 or null",
      "support": "number 1-5 or null"
    },
    "username": "string or null",
    "verification_status": "opener|verified|unverified|null"
  },
  "extensions": {
    "bonuses": [
      {
        "bonus_type": "welcome|deposit|cashback|loyalty|null",
        "title": "string or null",
        "value": "string or null",
        "terms": "string or null"
      }
    ],
    "payments": [
      {
        "payment_method": "string or null",
        "method_type": "deposit|withdrawal|null",
        "processing_time": "string or null",
        "minimum_amount": "number or null",
        "maximum_amount": "number or null",
        "fee_percentage": "number or null",
        "fee_fixed": "number or null"
      }
    ],
    "features": [
      {
        "feature_name": "string or null",
        "feature_type": "security|gameplay|interface|payment|null",
        "description": "string or null",
        "is_highlighted": "boolean or null"
      }
    ],
    "security": {
      "ssl_enabled": "boolean or null",
      "ssl_provider": "string or null",
      "provably_fair": "boolean or null",
      "provably_fair_description": "string or null",
      "license_info": "string or null",
      "compliance_certifications": ["array", "of", "certifications"],
      "data_protection_info": "string or null",
      "responsible_gaming_info": "string or null"
    },
    "faqs": [
      {
        "question": "string or null",
        "answer": "string or null",
        "category": "general|payments|security|gameplay|null",
        "is_featured": "boolean or null"
      }
    ]
  },
  "unmatched_content": ["Array of text segments that couldn't be categorized"],
  "confidence_scores": {
    "operator": "number 0-100",
    "review": "number 0-100", 
    "extensions": "number 0-100",
    "overall": "number 0-100"
  }
}

Important guidelines:
- Return ONLY valid JSON, no other text
- If information is not available, use null or empty arrays
- For ratings, convert any scale to the appropriate 0-10 (operator) or 1-5 (review) scale
- Extract all bonus codes, promo codes mentioned in the text
- Identify withdrawal times for different payment methods
- Separate operator-level information from individual review information
- Include confidence scores based on how certain you are about extracted data
- Place any text that doesn't fit into structured fields into unmatched_content`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          max_completion_tokens: 4000
        })
      });

      if (!response.ok) {
        console.error('AI Gateway Error:', response.status, await response.text());
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      console.log('AI Gateway Response:', data);
      
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Parse the JSON response from AI
      let parsedData;
      try {
        parsedData = JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Raw response:', aiResponse);
        throw new Error('Invalid JSON response from AI');
      }

      return new Response(JSON.stringify({ 
        success: true,
        data: parsedData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Default chat mode
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user', 
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in AI function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to get AI response",
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});