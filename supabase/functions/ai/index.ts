import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  console.log('AI function called with method:', req.method);

  try {
    const { message, mode = 'chat' } = await req.json();

    if (mode === 'operator-parse') {
      // AI-powered operator data extraction from editorial reviews
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
              content: `You are an advanced operator data extractor specialized in parsing gambling platform editorial reviews.

EXTRACT STRUCTURED OPERATOR DATA:

1. BASIC INFO:
   - Platform name, type (casino, case_opening, sports_betting, poker)
   - Launch year, company background
   - Editorial verdict/conclusion
   - Professional ratings (convert to 1-10 scale)
   - Categories, pros/cons lists

2. BONUSES & PROMOTIONS:
   - Welcome offers, deposit bonuses, free plays
   - Bonus types, values, terms and conditions
   - Promo codes

3. PAYMENT METHODS:
   - Deposit/withdrawal options
   - Processing times, fees, limits
   - Cryptocurrency and fiat support

4. SECURITY & TRUST:
   - SSL certificates, licenses
   - Provably fair systems
   - KYC requirements, compliance info

5. FEATURES:
   - Platform features, game modes
   - Special tools and services
   - Highlighted capabilities

6. RATINGS (convert all to 1-10 scale):
   - Overall rating
   - Trust, UX, Support, Payments, Offering, Value

Return ONLY raw JSON:
{
  "basic_info": {
    "name": "string or null",
    "site_type": "casino|case_opening|sports_betting|poker|null", 
    "launch_year": "number or null",
    "company_background": "string or null",
    "verdict": "string or null",
    "categories": ["array"],
    "pros": ["array"],
    "cons": ["array"]
  },
  "ratings": {
    "overall": "number 1-10 or null",
    "trust": "number 1-10 or null",
    "ux": "number 1-10 or null", 
    "support": "number 1-10 or null",
    "payments": "number 1-10 or null",
    "offering": "number 1-10 or null",
    "value": "number 1-10 or null"
  },
  "bonuses": [
    {
      "bonus_type": "welcome|deposit|free_play|cashback",
      "title": "string",
      "description": "string or null",
      "value": "string or null",
      "terms": "string or null"
    }
  ],
  "payments": [
    {
      "payment_method": "string",
      "method_type": "deposit|withdrawal",
      "processing_time": "string or null",
      "minimum_amount": "number or null",
      "maximum_amount": "number or null", 
      "fee_percentage": "number or null"
    }
  ],
  "security": {
    "ssl_enabled": "boolean or null",
    "ssl_provider": "string or null",
    "license_info": "string or null",
    "provably_fair": "boolean or null",
    "provably_fair_description": "string or null",
    "responsible_gaming_info": "string or null",
    "data_protection_info": "string or null",
    "compliance_certifications": ["array"]
  },
  "features": [
    {
      "feature_type": "string",
      "feature_name": "string", 
      "description": "string or null",
      "is_highlighted": "boolean"
    }
  ],
  "faqs": [
    {
      "question": "string",
      "answer": "string",
      "category": "string or null",
      "is_featured": "boolean"
    }
  ],
  "unmatched_content": ["array"],
  "confidence_scores": {
    "basic_info": "number 0-100",
    "bonuses": "number 0-100", 
    "payments": "number 0-100",
    "security": "number 0-100",
    "overall": "number 0-100"
  }
}`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.1,
          max_completion_tokens: 8000
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

      // Parse the JSON response from AI - strip markdown if present
      let parsedData;
      try {
        let cleanResponse = aiResponse.trim();
        
        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json\n')) {
          cleanResponse = cleanResponse.slice(8);
        }
        if (cleanResponse.startsWith('```\n')) {
          cleanResponse = cleanResponse.slice(4);
        }
        if (cleanResponse.endsWith('\n```')) {
          cleanResponse = cleanResponse.slice(0, -4);
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.slice(0, -3);
        }
        
        parsedData = JSON.parse(cleanResponse);
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
    } else if (mode === 'parse') {
      // AI-powered content parsing for operator/review data with advanced preprocessing
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
              content: `You are an advanced content parser for extracting gambling platform reviews and operator data.

FOCUS AREAS:
1. REVIEW CONTENT: User experiences, ratings, testimonials, personal opinions
2. OPERATOR INFO: Platform name, company details, features, trust indicators
3. METADATA: Publication dates, authors, ratings

REVIEW EXTRACTION PRIORITY:
- Look for first-person experiences: "I tried...", "My experience...", "After using..."
- Extract user ratings and convert to 1-5 scale
- Prioritize personal opinions over editorial content
- Identify pros/cons from user perspective

OPERATOR DATA:
- Platform name and type (casino, case_opening, sports_betting, poker)
- Company background and establishment year
- Features, bonuses, payment methods
- Trust indicators and security features

Return ONLY raw JSON (no markdown):
{
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
    "verification_status": "opener|verified|unverified|null",
    "pros": ["array"],
    "cons": ["array"],
    "author": "string or null"
  },
  "operator_info": {
    "name": "string or null",
    "site_type": "casino|case_opening|sports_betting|poker|null",
    "rating": "number 1-5 or null",
    "establishment_year": "number or null",
    "company_background": "string or null",
    "welcome_bonus": "string or null",
    "payment_methods": ["array"],
    "trust_indicators": ["array"],
    "features": ["array"],
    "verdict": "string or null",
    "pros": ["array"],
    "cons": ["array"]
  },
  "metadata": {
    "publication_date": "string or null",
    "author": "string or null",
    "last_updated": "string or null"
  },
  "unmatched_content": ["array"],
  "confidence_scores": {
    "review": "number 0-100",
    "operator": "number 0-100",
    "overall": "number 0-100",
    "filtering_effectiveness": "number 0-100"
  }
}`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.1,
          max_completion_tokens: 8000
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

      // Parse the JSON response from AI - strip markdown if present
      let parsedData;
      try {
        let cleanResponse = aiResponse.trim();
        
        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json\n')) {
          cleanResponse = cleanResponse.slice(8); // Remove '```json\n'
        }
        if (cleanResponse.startsWith('```\n')) {
          cleanResponse = cleanResponse.slice(4); // Remove '```\n'
        }
        if (cleanResponse.endsWith('\n```')) {
          cleanResponse = cleanResponse.slice(0, -4); // Remove '\n```'
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.slice(0, -3); // Remove '```'
        }
        
        parsedData = JSON.parse(cleanResponse);
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