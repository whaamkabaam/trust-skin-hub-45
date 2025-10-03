import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportResult {
  success: boolean;
  rowsProcessed: number;
  rowsInserted: number;
  rowsSkipped: number;
  errors: Array<{ row: number; error: string }>;
  categoryMappings: Record<string, string>;
}

const CATEGORY_MAPPING: Record<string, string> = {
  'CS:GO': 'weapons',
  'CS2': 'weapons',
  'CSGO': 'weapons',
  'Weapons': 'weapons',
  'Apple': 'apple',
  'iPhone': 'apple',
  'iPad': 'apple',
  'MacBook': 'apple',
  'Knives': 'knives',
  'Knife': 'knives',
  'Gloves': 'gloves',
  'Mixed': 'mixed',
  'Various': 'mixed',
  'Tech': 'tech',
  'Electronics': 'tech',
  'Stickers': 'stickers',
  'Premium': 'premium',
};

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function safeJSONParse(str: string, fallback: any = null): any {
  if (!str || str === 'null' || str === 'undefined' || str === '') return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('JSON parse error for:', str.substring(0, 100), e);
    return fallback;
  }
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = parseLine(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });
    rows.push(row);
  }
  
  return rows;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const provider = formData.get('provider') as string;
    const skipDuplicates = formData.get('skipDuplicates') === 'true';

    if (!file || !provider) {
      throw new Error('Missing file or provider');
    }

    const csvText = await file.text();
    const rows = parseCSV(csvText);

    const result: ImportResult = {
      success: true,
      rowsProcessed: 0,
      rowsInserted: 0,
      rowsSkipped: 0,
      errors: [],
      categoryMappings: {},
    };

    // Get category IDs mapping
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug');
    
    const categorySlugToId: Record<string, string> = {};
    categories?.forEach(cat => {
      categorySlugToId[cat.slug] = cat.id;
    });

    const tableName = provider.toLowerCase();
    const batchSize = 100;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      for (const row of batch) {
        result.rowsProcessed++;
        
        try {
          // Map CSV row to database structure
          const boxData = {
            id: parseInt(row.id || '0'),
            box_name: row.box_name || row.name,
            box_price: parseFloat(row.box_price || row.price || '0'),
            box_image: row.box_image || row.image,
            box_url: row.box_url || row.url,
            expected_value_percent: parseFloat(row.expected_value_percent || '0'),
            floor_rate_percent: parseFloat(row.floor_rate_percent || '0'),
            standard_deviation_percent: parseFloat(row.standard_deviation_percent || '0'),
            volatility_bucket: row.volatility_bucket || 'Medium',
            category: row.category,
            tags: safeJSONParse(row.tags, []),
            jackpot_items: safeJSONParse(row.jackpot_items, []),
            unwanted_items: safeJSONParse(row.unwanted_items, []),
            all_items: safeJSONParse(row.all_items, []),
            data_source: 'csv_import',
            last_updated: new Date().toISOString(),
          };

          // Check for duplicates
          if (skipDuplicates) {
            const { data: existing } = await supabase
              .from(tableName)
              .select('id')
              .eq('box_name', boxData.box_name)
              .single();
            
            if (existing) {
              result.rowsSkipped++;
              continue;
            }
          }

          // Insert box
          const { data: insertedBox, error: insertError } = await supabase
            .from(tableName)
            .insert(boxData)
            .select('id')
            .single();

          if (insertError) throw insertError;

          // Map category and create junction table entry
          const categorySlug = CATEGORY_MAPPING[row.category];
          if (categorySlug && categorySlugToId[categorySlug]) {
            result.categoryMappings[row.category] = categorySlug;
            
            // Note: mystery_box_categories is for the main mystery_boxes table
            // For provider tables, we just store the category text for now
          }

          result.rowsInserted++;
        } catch (error) {
          result.errors.push({
            row: result.rowsProcessed,
            error: error.message,
          });
        }
      }
    }

    result.success = result.errors.length === 0;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
