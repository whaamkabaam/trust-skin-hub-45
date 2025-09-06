import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

export default function SEOManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Manager</h1>
          <p className="text-muted-foreground">Manage SEO metadata and optimization</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New SEO Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Optimization
          </CardTitle>
          <CardDescription>
            Manage meta titles, descriptions, and structured data for better search rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>SEO management coming soon</p>
            <p className="text-sm">Optimize metadata for better search visibility</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}