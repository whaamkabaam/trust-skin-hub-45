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

    if (mode === 'parse') {
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
              content: `You are an advanced content parser specialized in extracting structured data from gambling platform reviews and operator information. You excel at filtering noise and focusing on meaningful content.

PREPROCESSING INTELLIGENCE:
- Ignore common web navigation elements (Skip to content, Home, About, etc.)
- Filter out copyright notices, age restrictions, and legal disclaimers
- Skip empty content, single characters, or pure whitespace
- Ignore common UI elements like buttons (Subscribe, Follow, Share, etc.)
- Focus on substantial text blocks with meaningful information

ENHANCED PARSING PRIORITIES:
1. RATINGS & SCORES: Extract numerical ratings, convert to 1-5 scale
2. OPERATOR DETAILS: Name, establishment year, company info, legitimacy indicators
3. REVIEW CONTENT: User experiences, opinions, detailed feedback
4. TRUST SIGNALS: Trustpilot scores, SSL certificates, licensing info
5. FEATURES: Bonuses, payment methods, platform features, delivery info
6. PROS/CONS: Positive and negative points from user perspective

AUTO-CATEGORIZATION RULES:
- Ratings: "8.0/10", "Our rating:", "Trustpilot 4.5/5" → operator.rating or review.rating
- Dates: "Published: June 3, 2025", "Established 2025" → metadata.dates
- Authors: "Andrej Gjorgievski", "Project Lead" → review.author or metadata.author  
- Company: "Registered in Cyprus", "Operating for 5+ years" → operator.company_background
- Bonuses: "Welcome Offer", "Free spins" → operator.welcome_bonus
- Features: "Number of boxes: 7", "Delivery: 5-7 days" → operator.features
- Trust: "SSL cert", "KYC on wins", "Provably Fair" → operator.trust_indicators
- Payments: "Visa/Mastercard", "Crypto TBA" → operator.payment_methods

Return ONLY raw JSON (no markdown) with this enhanced structure:

{
  "review_data": {
    "rating": "number 1-5 or null",
    "title": "string or null",
    "content": "string or null (substantial user feedback)",
    "subscores": {
      "trust": "number 1-5 or null",
      "fees": "number 1-5 or null",
      "ux": "number 1-5 or null", 
      "support": "number 1-5 or null"
    },
    "username": "string or null",
    "verification_status": "opener|verified|unverified|null",
    "pros": ["meaningful positive points"],
    "cons": ["meaningful negative points"],
    "author": "string or null (reviewer name)"
  },
  "operator_info": {
    "name": "string or null (platform name)",
    "site_type": "casino|case_opening|sports_betting|poker|null",
    "rating": "number 1-5 or null (overall/editorial rating)",
    "establishment_year": "number or null",
    "company_background": "string or null",
    "welcome_bonus": "string or null", 
    "payment_methods": ["array of payment options"],
    "trust_indicators": ["array of trust/security features"],
    "features": ["array of platform features"],
    "verdict": "string or null (editorial conclusion)",
    "pros": ["platform advantages"],
    "cons": ["platform disadvantages"]
  },
  "metadata": {
    "publication_date": "string or null",
    "author": "string or null (article author)",
    "last_updated": "string or null"
  },
  "unmatched_content": ["Only genuinely ambiguous content after smart filtering"],
  "confidence_scores": {
    "review": "number 0-100",
    "operator": "number 0-100", 
    "overall": "number 0-100",
    "filtering_effectiveness": "number 0-100"
  }
}

CRITICAL SUCCESS METRICS:
- Reduce unmatched_content to <10% of original through smart categorization
- Extract 90%+ of ratings, dates, author info, company details automatically  
- Focus unmatched_content only on truly ambiguous text requiring human judgment
- Provide high confidence scores for successful auto-categorization`
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