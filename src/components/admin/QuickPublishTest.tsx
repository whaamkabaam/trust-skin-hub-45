import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStaticContent } from '@/hooks/useStaticContent';
import { toast } from 'sonner';
import { Play, CheckCircle, AlertCircle } from 'lucide-react';

export function QuickPublishTest() {
  const { publishStaticContent, loading, error } = useStaticContent();
  const [published, setPublished] = useState(false);
  
  const casesggId = 'c198abe3-57cb-4ce1-80b6-8cc5a148d198';

  const testPublish = async () => {
    console.log('Testing publishing for casesgg...');
    const result = await publishStaticContent(casesggId);
    
    if (result) {
      setPublished(true);
      toast.success('Successfully published casesgg static content!');
    } else {
      toast.error('Failed to publish static content. Check console for details.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Quick Publish Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Test the publishing system with the casesgg operator
        </p>
        
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {published && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            Static content published successfully!
          </div>
        )}
        
        <Button 
          type="button"
          onClick={testPublish} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Publishing...' : 'Test Publish casesgg'}
        </Button>
      </CardContent>
    </Card>
  );
}