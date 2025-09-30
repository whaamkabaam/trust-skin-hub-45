import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMysteryBoxDetail } from '@/hooks/useMysteryBoxDetail';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const getVolatilityRisk = (volatility: number) => {
  if (volatility <= 50) return 'Low';
  if (volatility <= 100) return 'Medium';
  if (volatility <= 200) return 'High';
  return 'Extreme';
};

const MysteryBoxDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { mysteryBox, loading, error } = useMysteryBoxDetail(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !mysteryBox) {
    return <Navigate to="/mystery-boxes" replace />;
  }

  const volatility = mysteryBox.profit_rate ? (1 - mysteryBox.profit_rate) * 100 : 50;

  // Get items from mystery box data
  const items = mysteryBox?.rarity_mix?.items || [];
  const highlights = mysteryBox?.highlights || [];
  const stats = mysteryBox?.stats || {};
  
  const jackpotItems = highlights?.filter((h: any) => h.type === 'jackpot') || [];
  const commonItems = items?.filter((item: any) => item.rarity === 'common' || item.drop_rate > 10) || [];
  const allItems = items || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back to Hub */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/mystery-boxes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Link>
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            <Home className="w-4 h-4" />
          </Link>
          <span>/</span>
          <Link to="/mystery-boxes" className="hover:text-foreground">Mystery Boxes</Link>
          <span>/</span>
          <span className="text-foreground">{mysteryBox.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-4">{mysteryBox.name}</h1>
        
        {/* Operator */}
        {mysteryBox.operator && (
          <div className="flex items-center justify-center gap-3 mb-8">
            <img 
              src={mysteryBox.operator.logo_url || "https://placehold.co/100x100/1a1f2e/white?text=Logo"} 
              alt={mysteryBox.operator.name} 
              className="w-8 h-8 rounded object-cover"
            />
            <span className="font-semibold text-purple-600">{mysteryBox.operator.name}</span>
            {mysteryBox.operator.tracking_link && (
              <>
                <ExternalLink className="w-4 h-4" />
                <Button variant="outline" size="sm" asChild>
                  <a href={mysteryBox.operator.tracking_link} target="_blank" rel="noopener noreferrer">
                    Visit Site
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to={`/operators/${mysteryBox.operator.slug}`}>
                <Star className="w-4 h-4 mr-2" />
                Read Review
              </Link>
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Image and Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mystery Box Image */}
            <div className="flex justify-center">
              <img 
                src={mysteryBox.image_url || "https://placehold.co/600x400/1a1f2e/white?text=Mystery+Box"} 
                alt={mysteryBox.name}
                className="w-80 h-auto rounded-lg"
              />
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">${mysteryBox.price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Mystery Box Price</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mysteryBox.expected_value ? `${mysteryBox.expected_value.toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Value</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {getVolatilityRisk(volatility)} ({volatility.toFixed(0)}%)
                  </div>
                  <div className="text-sm text-muted-foreground">Risk</div>
                </CardContent>
              </Card>
            </div>

            {/* All Tags */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Tags & Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {mysteryBox.verified && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
                  )}
                  {mysteryBox.provably_fair && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">Provably Fair</Badge>
                  )}
                  {mysteryBox.game && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">{mysteryBox.game}</Badge>
                  )}
                  {mysteryBox.box_type && (
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">{mysteryBox.box_type}</Badge>
                  )}
                  {mysteryBox.categories.map((cat) => (
                    <Badge key={cat.id} className="bg-purple-100 text-purple-700 border-purple-200">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    ${mysteryBox.min_price?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Minimum Value</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mysteryBox.profit_rate ? `${(mysteryBox.profit_rate * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Profit Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* All Items Table */}
            {allItems.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold mb-4">All Items (by Drop Rate & Value)</h3>
                <div className="space-y-2">
                  {allItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="font-medium">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-purple-600">
                          {item.drop_rate || item.dropRate || 0}%
                        </Badge>
                        <span className="font-bold text-green-600">
                          ${(item.value || item.price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No items data available yet. Items will be added soon.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Jackpot Items */}
            {jackpotItems.length > 0 && (
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-800 dark:text-purple-200">Jackpot Items</h3>
                  </div>

                  {/* Top Jackpot Items */}
                  <div className="space-y-2">
                    {jackpotItems.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-200 rounded flex items-center justify-center">
                            <span className="text-xs">🎁</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{item.name || item.title}</div>
                            <div className="text-xs text-purple-600">Drop Rate: {item.drop_rate || item.dropRate || 0}%</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-green-600">${item.value || item.price || 0}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Common Items */}
            {commonItems.length > 0 && (
              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-orange-200 rounded flex items-center justify-center">
                      <span className="text-xs">⚠️</span>
                    </div>
                    <h3 className="font-bold text-orange-800 dark:text-orange-200">Common Items</h3>
                  </div>

                  {/* Common Items List */}
                  <div className="space-y-2">
                    {commonItems.slice(0, 6).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-200 rounded flex items-center justify-center">
                            <span className="text-xs">📦</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-orange-600">Drop Rate: {item.drop_rate || item.dropRate || 0}%</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-green-600">${item.value || item.price || 0}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar Cases */}
            <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Similar Cases</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center">
                        <span className="text-xs text-white">📦</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Trash & Treasure Box</div>
                        <div className="text-xs text-muted-foreground">Similar parody theme</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold">$0.25</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded flex items-center justify-center">
                        <span className="text-xs text-white">🎁</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Budget Mystery</div>
                        <div className="text-xs text-muted-foreground">Low cost option</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold">$0.15</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-xs text-white">🎲</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Novelty Collection</div>
                        <div className="text-xs text-muted-foreground">Fun themed items</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold">$0.50</div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Similar Cases
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MysteryBoxDetail;