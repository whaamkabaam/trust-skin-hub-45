import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package } from 'lucide-react';
import { useMysteryBoxesFromProviders } from '@/hooks/useMysteryBoxesFromProviders';
import { SEOHead } from '@/components/SEOHead';
import type { MysteryBox } from '@/types';

interface MysteryBoxFormData {
  name: string;
  slug: string;
  price: number;
  expected_value: number | null;
  min_price: number | null;
  image_url: string;
  game: string;
  box_type: string;
  odds_disclosed: string;
  verified: boolean;
  provably_fair: boolean;
  operator_id: string | null;
  categories: string[];
  highlights: Array<{ name: string; icon?: string; rarity: string }>;
  site_name: string;
}

const MysteryBoxes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<MysteryBox | null>(null);
  const [deleteBoxId, setDeleteBoxId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MysteryBoxFormData>({
    name: '',
    slug: '',
    price: 0,
    expected_value: null,
    min_price: null,
    image_url: '',
    game: '',
    box_type: 'digital',
    odds_disclosed: 'Yes',
    verified: false,
    provably_fair: false,
    operator_id: null,
    categories: [],
    highlights: [],
    site_name: ''
  });

  const { mysteryBoxes, loading, totalCount } = useMysteryBoxesFromProviders();
  const [providerFilter, setProviderFilter] = useState<string>('');

  const filteredBoxes = mysteryBoxes.filter(box => {
    const matchesSearch = box.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.site_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvider = !providerFilter || box.site_name === providerFilter;
    
    return matchesSearch && matchesProvider;
  });

  const providers = Array.from(new Set(mysteryBoxes.map(box => box.site_name).filter(Boolean)));

  // Read-only view - no create/edit/delete since data comes from providers






  return (
    <>
      <SEOHead 
        title="Mystery Boxes Management | Admin Dashboard"
        description="Manage mystery boxes, create new boxes, and organize box collections."
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mystery Boxes from Providers</h1>
            <p className="text-muted-foreground mt-2">
              Viewing {totalCount} mystery boxes from provider data (read-only)
            </p>
          </div>
          
          <Badge variant="secondary" className="text-sm">
            <Package className="h-4 w-4 mr-2" />
            Provider Data
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mystery boxes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider} value={provider!}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mystery Boxes ({filteredBoxes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading mystery boxes...</div>
            ) : filteredBoxes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No mystery boxes match your search.' : 'No mystery boxes found. Create your first one!'}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Expected Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBoxes.map((box) => (
                      <TableRow key={box.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {box.image_url && (
                              <img src={box.image_url} alt={box.name} className="w-10 h-10 rounded object-cover" />
                            )}
                            <div>
                              <div className="font-medium">{box.name}</div>
                              <div className="text-sm text-muted-foreground">{box.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{box.site_name}</Badge>
                        </TableCell>
                        <TableCell>
                          {box.categories?.[0]?.name || 'Uncategorized'}
                        </TableCell>
                        <TableCell>${box.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {box.expected_value ? (
                            <div className="flex flex-col">
                              <span className="font-medium">${box.expected_value.toFixed(2)}</span>
                              <span className={`text-xs ${box.profit_rate && box.profit_rate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {box.profit_rate?.toFixed(1)}% ROI
                              </span>
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {box.verified && <Badge variant="secondary">Verified</Badge>}
                            {box.provably_fair && <Badge variant="outline">Fair</Badge>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MysteryBoxes;