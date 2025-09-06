import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOperators } from '@/hooks/useOperators';
import { useSEO } from '@/hooks/useSEO';
import { Search, Globe, Eye, Code, CheckCircle, AlertCircle } from 'lucide-react';

export default function SEOManager() {
  const { operators } = useOperators();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
  });

  const { metadata, loading, saveSEO, generateStructuredData } = useSEO(selectedOperatorId);
  const selectedOperator = operators.find(op => op.id === selectedOperatorId);

  // Update form when metadata loads
  useState(() => {
    if (metadata && metadata.schema_data) {
      setFormData({
        meta_title: metadata.meta_title || '',
        meta_description: metadata.meta_description || '',
        og_title: metadata.schema_data?.og?.title || '',
        og_description: metadata.schema_data?.og?.description || '',
        og_image: metadata.schema_data?.og?.image || '',
        twitter_title: metadata.schema_data?.twitter?.title || '',
        twitter_description: metadata.schema_data?.twitter?.description || '',
        twitter_image: metadata.schema_data?.twitter?.image || '',
        canonical_url: metadata.schema_data?.canonical_url || '',
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperatorId) return;
    await saveSEO(formData);
  };

  const getCharacterCount = (text: string, limit: number) => {
    const isOverLimit = text.length > limit;
    return (
      <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
        {text.length}/{limit} {isOverLimit && '(over limit)'}
      </span>
    );
  };

  const structuredData = selectedOperator ? 
    generateStructuredData(selectedOperator.name, selectedOperator) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Manager</h1>
          <p className="text-muted-foreground">Manage SEO metadata and optimization</p>
        </div>
      </div>

      {/* Operator Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedOperatorId} onValueChange={setSelectedOperatorId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose an operator to manage SEO..." />
            </SelectTrigger>
            <SelectContent>
              {operators.map(operator => (
                <SelectItem key={operator.id} value={operator.id}>
                  <div className="flex items-center gap-2">
                    {operator.logo_url && (
                      <img src={operator.logo_url} alt="" className="w-4 h-4 rounded" />
                    )}
                    {operator.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedOperatorId && (
        <>
          {/* SEO Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Basic SEO Metadata
                </CardTitle>
                <CardDescription>
                  Essential meta tags for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="Enter meta title (55-60 characters optimal)"
                    className="mt-1"
                  />
                  {getCharacterCount(formData.meta_title, 60)}
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="Enter meta description (150-160 characters optimal)"
                    className="mt-1"
                    rows={3}
                  />
                  {getCharacterCount(formData.meta_description, 160)}
                </div>
                <div>
                  <Label htmlFor="canonical_url">Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    value={formData.canonical_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                    placeholder="https://example.com/operator-name"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Open Graph */}
            <Card>
              <CardHeader>
                <CardTitle>Open Graph (Facebook/LinkedIn)</CardTitle>
                <CardDescription>
                  Social media sharing metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="og_title">OG Title</Label>
                  <Input
                    id="og_title"
                    value={formData.og_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                    placeholder="Leave empty to use meta title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="og_description">OG Description</Label>
                  <Textarea
                    id="og_description"
                    value={formData.og_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                    placeholder="Leave empty to use meta description"
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="og_image">OG Image URL</Label>
                  <Input
                    id="og_image"
                    value={formData.og_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Twitter */}
            <Card>
              <CardHeader>
                <CardTitle>Twitter Card</CardTitle>
                <CardDescription>
                  Twitter-specific sharing metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twitter_title">Twitter Title</Label>
                  <Input
                    id="twitter_title"
                    value={formData.twitter_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                    placeholder="Leave empty to use meta title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter_description">Twitter Description</Label>
                  <Textarea
                    id="twitter_description"
                    value={formData.twitter_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                    placeholder="Leave empty to use meta description"
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter_image">Twitter Image URL</Label>
                  <Input
                    id="twitter_image"
                    value={formData.twitter_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_image: e.target.value }))}
                    placeholder="Leave empty to use OG image"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save SEO Metadata'}
              </Button>
            </div>
          </form>

          {/* SEO Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Search Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="text-sm text-blue-600 mb-1">
                  {formData.canonical_url || 'https://example.com/operator-name'}
                </div>
                <div className="text-lg text-blue-800 font-medium mb-1">
                  {formData.meta_title || selectedOperator?.name || 'Page Title'}
                </div>
                <div className="text-sm text-gray-600">
                  {formData.meta_description || 'Page description will appear here...'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Structured Data */}
          {structuredData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Structured Data (JSON-LD)
                </CardTitle>
                <CardDescription>
                  Generated schema.org markup for search engines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(structuredData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* SEO Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {formData.meta_title.length >= 30 && formData.meta_title.length <= 60 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    Meta title length: {formData.meta_title.length}/60 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.meta_description.length >= 120 && formData.meta_description.length <= 160 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    Meta description length: {formData.meta_description.length}/160 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.og_image || selectedOperator?.logo_url ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">Social sharing image</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.canonical_url ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">Canonical URL specified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}