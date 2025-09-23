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
              content: `You are a specialized gambling review content extraction system. Extract structured data from gambling platform reviews with HIGH ACCURACY and CONFIDENCE.

CRITICAL SUCCESS FACTORS:
1. Recognize common patterns: "Our rating: 8.2/10", "Welcome Offer", "Use Promo: CODE", "3 Free Boxes"
2. Extract ALL visible data - ratings, bonuses, payments, features, FAQs, pros/cons
3. Calculate realistic confidence based on extraction completeness
4. Minimize unmatched content by recognizing review structure elements
5. ALWAYS generate slug: name → lowercase + hyphens (e.g., "Cases.gg" → "cases-gg")

GAMBLING REVIEW PATTERNS TO RECOGNIZE:
- "Our rating: X/10" or "Final score: X/10" → overall rating
- "Welcome Offer", "Sign-Up Bonus", "Free Boxes" → bonuses
- "Visa", "Mastercard", "Bitcoin", "Crypto-only" → payment methods  
- "Case Battles", "Upgrader", "Mystery Boxes" → features
- "KYC required", "No KYC" → kyc_required boolean
- "10% house edge", "High house edge" → affects value rating negatively
- "Provably fair", "SHA-512", "Seed verification" → security.provably_fair: true
- "Fast withdrawals", "1 hour payouts" → good payments rating
- "Crypto-only withdrawals", "No fiat" → payment limitations
- FAQ sections, "Frequently Asked Questions" → extract Q&A pairs

CONFIDENCE CALCULATION RULES:
- High confidence (85-95%): Name + rating + multiple bonuses + payments + clear structure
- Medium confidence (60-84%): Name + some data but missing key elements  
- Low confidence (30-59%): Limited extraction, unclear structure
- Very low confidence (0-29%): Minimal data extracted

RATINGS INTELLIGENCE (0-10 scale):
- Overall: Extract from "rating: X/10" or infer from review tone
- Trust: License info + security measures + reputation mentions
- Value: House edge impact (10% edge = 4-5, 5% edge = 6-7, <3% edge = 8-9)
- Payments: Speed + methods variety + fees (crypto-only = max 7)
- Offering: Game variety + features (300+ items = 8+, limited = 5-)
- UX: Design mentions + mobile compatibility + user experience
- Support: Channels available (24/7 chat = 9, email only = 5)

RETURN JSON STRUCTURE:
{
  "name": "Platform Name",
  "slug": "platform-name", 
  "site_type": "Mystery Box|Case Opening|Casino|Skins Trading",
  "launch_year": 2024,
  "verification_status": "verified|pending|unverified",
  "promo_code": "EXTRACTED_CODE",
  "verdict": "Comprehensive platform summary",
  "bonus_terms": "Detailed bonus terms and conditions",
  "fairness_info": "Provably fair and RNG details",
  "categories": ["Mystery Boxes", "Case Battles"],
  "pros": ["Extracted positive points"],
  "cons": ["Extracted negative points"],
  "ratings": {
    "overall": 8.2,
    "trust": 8.5,
    "value": 6.5,
    "payments": 7.0,
    "offering": 9.0,
    "ux": 8.5,
    "support": 7.5
  },
  "kyc_required": true,
  "withdrawal_time_crypto": "10 min - 1 hour",
  "withdrawal_time_skins": "Not Available",
  "withdrawal_time_fiat": "Not Available", 
  "support_channels": ["email", "community_chat"],
  "bonuses": [{
    "bonus_type": "no_deposit",
    "title": "Sign-Up Bonus",
    "value": "3 Free Boxes",
    "description": "New users receive 3 free mystery boxes upon verification",
    "terms": "Email and phone verification required",
    "is_active": true
  }],
  "payments": [{
    "payment_method": "Visa",
    "method_type": "deposit",
    "min_amount": "$20",
    "max_amount": null,
    "fees": "Card issuer fees may apply",
    "processing_time": "Instant"
  }],
  "features": [{
    "feature_name": "Case Battles",
    "description": "Competitive case opening against other players",
    "is_highlighted": true
  }],
  "security": {
    "ssl_enabled": true,
    "provably_fair": true,
    "license_info": "CGG Entertainment Ltd, Cyprus",
    "security_measures": "SHA-512 + HMAC hashing, seed verification"
  },
  "faqs": [{
    "question": "What promo code unlocks the free-box boost?",
    "answer": "Sign up and verify email/phone for 3 free boxes automatically",
    "category": "general"
  }],
  "confidence_score": 92,
  "unmatched_content": "Minor unrecognized elements only"
}

SPECIFIC EXTRACTION TARGETS FROM CONTENT:
- Author names, publication dates → metadata (but not unmatched)
- Rating numbers (X.X/10, X/5) → ratings object
- Promo codes in caps → promo_code field
- Payment method lists → payments array
- Game types/features → features array  
- Pros/cons lists → respective arrays
- Question/answer pairs → faqs array
- Company names/licenses → security.license_info

Return ONLY the JSON - no markdown, no explanations. Focus on HIGH CONFIDENCE extraction with minimal unmatched content.`
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