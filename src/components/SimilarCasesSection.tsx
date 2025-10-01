import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/LazyImage';

interface SimilarCasesSectionProps {
  currentBoxId: string;
  operatorId?: string;
  game?: string | null;
  price: number;
}

interface SimilarBox {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  game: string | null;
}

export function SimilarCasesSection({ currentBoxId, operatorId, game, price }: SimilarCasesSectionProps) {
  const [similarBoxes, setSimilarBoxes] = useState<SimilarBox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarBoxes = async () => {
      try {
        setLoading(true);
        
        // Build query to find similar boxes
        let query = supabase
          .from('mystery_boxes')
          .select('id, name, slug, image_url, price, game')
          .eq('is_active', true)
          .neq('id', currentBoxId)
          .limit(3);

        // Prioritize boxes from same operator
        if (operatorId) {
          const { data: operatorBoxes } = await query.eq('operator_id', operatorId);
          
          if (operatorBoxes && operatorBoxes.length >= 3) {
            setSimilarBoxes(operatorBoxes);
            setLoading(false);
            return;
          }
        }

        // Fallback: Find boxes with similar price range (±50%)
        const minPrice = price * 0.5;
        const maxPrice = price * 1.5;
        
        query = supabase
          .from('mystery_boxes')
          .select('id, name, slug, image_url, price, game')
          .eq('is_active', true)
          .neq('id', currentBoxId)
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .limit(3);

        // If same game exists, filter by it
        if (game) {
          query = query.eq('game', game);
        }

        const { data, error } = await query;

        if (error) throw error;

        setSimilarBoxes(data || []);
      } catch (error) {
        console.error('Error fetching similar boxes:', error);
        setSimilarBoxes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarBoxes();
  }, [currentBoxId, operatorId, game, price]);

  if (loading) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200">
        <CardContent className="p-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Similar Cases</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="space-y-1">
                    <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="w-16 h-2 bg-gray-300 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarBoxes.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200">
      <CardContent className="p-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Similar Cases</h3>
        
        <div className="space-y-3">
          {similarBoxes.map(box => (
            <Link 
              key={box.id} 
              to={`/mystery-boxes/${box.slug}`}
              className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded hover:bg-white/70 dark:hover:bg-black/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                {box.image_url ? (
                  <LazyImage
                    src={box.image_url}
                    alt={box.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center">
                    <span className="text-xs text-white">📦</span>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium">{box.name}</div>
                  {box.game && (
                    <div className="text-xs text-muted-foreground">{box.game}</div>
                  )}
                </div>
              </div>
              <div className="text-sm font-bold">${box.price.toFixed(2)}</div>
            </Link>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <Link to="/mystery-boxes">View All Cases</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
