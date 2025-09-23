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
              content: `You are an expert data extraction specialist for gambling/gaming platforms. Your task is to analyze content about gambling operators and extract structured data.

CRITICAL INSTRUCTIONS:
1. Extract ALL available information, even if partially mentioned
2. Use smart inference based on context and industry knowledge
3. Generate proper bonus objects with complete details
4. For ratings, use 0-10 scale where higher = better. Consider all factors mentioned.
5. Extract all FAQs, payment methods, and features mentioned
6. Return valid JSON with no markdown formatting or explanations
7. ALWAYS generate a slug from the name (lowercase, hyphenated)
8. Be comprehensive - extract everything possible

ANALYSIS GUIDELINES:
- House edge: 10% = value: 4, trust: 6; 5% = value: 7, trust: 8; <3% = value: 9, trust: 9
- Provably fair = trust: 9+, security.provably_fair: true
- No KYC = kyc_required: false, ux: 7+, trust: 8+
- Fast payouts (1-24h) = payments: 8+; Slow (3+ days) = payments: 5-
- Large game variety = offering: 8+; Limited = offering: 5-
- 24/7 support = support: 9; Email only = support: 5
- SSL + License = trust: 8+; Basic security = trust: 6

STRICT JSON SCHEMA (return exactly this structure):
{
  "name": "string (exact operator name)",
  "slug": "string (auto-generated from name: lowercase, hyphens)", 
  "site_type": "string (Case Site, Mystery Box, Skin Trading, etc)",
  "launch_year": number,
  "verification_status": "verified|pending|unverified",
  "promo_code": "string (extract any promo code mentioned)",
  "verdict": "string (comprehensive summary of the platform)",
  "bonus_terms": "string (detailed bonus terms and conditions)",
  "fairness_info": "string (fairness, RNG, provably fair details)",
  "categories": ["string array of gaming categories"],
  "pros": ["string array of positive aspects"],
  "cons": ["string array of negative aspects"],
  "ratings": {
    "overall": number (0-10, weighted average),
    "trust": number (0-10, security + reputation),
    "value": number (0-10, house edge + bonuses),
    "payments": number (0-10, speed + methods + fees),
    "offering": number (0-10, games + features variety),
    "ux": number (0-10, usability + design),
    "support": number (0-10, channels + quality)
  },
  "kyc_required": boolean,
  "withdrawal_time_crypto": "string (e.g., '1-24 hours', 'Instant')",
  "withdrawal_time_skins": "string",
  "withdrawal_time_fiat": "string",
  "support_channels": ["live_chat", "email", "discord", "telegram"],
  "bonuses": [{
    "bonus_type": "welcome|deposit|loyalty|referral|no_deposit",
    "title": "string (e.g., 'Welcome Bonus')",
    "value": "string (e.g., '$10 Free + 3 Cases')",
    "description": "string (detailed description)",
    "terms": "string (terms and conditions)",
    "is_active": true
  }],
  "payments": [{
    "payment_method": "string (Visa, Bitcoin, PayPal, etc)",
    "method_type": "deposit|withdrawal|both",
    "min_amount": "string (e.g., '$10')",
    "max_amount": "string (e.g., '$10,000')",
    "fees": "string (e.g., '0%', '2.5%')",
    "processing_time": "string (e.g., 'Instant', '1-3 days')"
  }],
  "features": [{
    "feature_name": "string (e.g., 'Case Battles', 'Upgrader')",
    "description": "string (feature description)",
    "is_highlighted": boolean
  }],
  "security": {
    "ssl_enabled": boolean,
    "provably_fair": boolean,
    "license_info": "string (licensing details)",
    "security_measures": "string (security overview)"
  },
  "faqs": [{
    "question": "string",
    "answer": "string",
    "category": "general|payments|security|support"
  }],
  "confidence_score": number (0-100, how confident you are in the extraction),
  "unmatched_content": "string (important content that couldn't be categorized)"
}

REAL EXAMPLES:
- "Cases.gg launched 2024" → name: "Cases.gg", slug: "cases-gg", launch_year: 2024
- "10% house edge" → value: 4, trust: 6, cons: ["10% house edge affects profitability"]
- "Free $10 + 3 Cases" → bonus: {title: "Welcome Bonus", value: "$10 + 3 Cases", bonus_type: "welcome"}
- "Crypto-only withdrawals" → cons: ["Crypto-only withdrawals"], payments methods focus on crypto
- "300+ boxes" → offering: 8+, pros: ["Large variety with 300+ boxes"]
- "Case Battles & Upgrader" → features: multiple entries, pros: ["Interactive features like Case Battles"]

Analyze the following content and return ONLY the JSON object (no explanations):`
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