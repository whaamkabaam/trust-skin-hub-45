import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStaticContent } from '@/hooks/useStaticContent';
import { toast } from 'sonner';

interface PublishingDebuggerProps {
  operatorId: string;
}

export function PublishingDebugger({ operatorId }: PublishingDebuggerProps) {
  const [isDebugging, setIsDebugging] = useState(false);
  const { publishStaticContent, generateStaticContent, loading, error } = useStaticContent();

  const testGeneration = async () => {
    setIsDebugging(true);
    try {
      const result = await generateStaticContent(operatorId);
      console.log('Generated content:', result);
      toast.success('Content generation successful - check console for details');
    } catch (err) {
      console.error('Generation failed:', err);
      toast.error('Content generation failed - check console');
    } finally {
      setIsDebugging(false);
    }
  };

  const testPublishing = async () => {
    setIsDebugging(true);
    try {
      const success = await publishStaticContent(operatorId);
      if (success) {
        toast.success('Publishing successful!');
      } else {
        toast.error('Publishing failed');
      }
    } catch (err) {
      console.error('Publishing failed:', err);
      toast.error('Publishing failed - check console');
    } finally {
      setIsDebugging(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            type="button"
            onClick={testGeneration}
            disabled={isDebugging || loading}
            variant="outline"
          >
            Test Generation
          </Button>
          <Button 
            type="button"
            onClick={testPublishing}
            disabled={isDebugging || loading}
          >
            Test Full Publishing
          </Button>
        </div>
        {error && (
          <div className="text-sm text-destructive">
            Error: {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}