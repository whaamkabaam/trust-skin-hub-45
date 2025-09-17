import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useStaticContent } from '@/hooks/useStaticContent';
import { useOperators } from '@/hooks/useOperators';
import { toast } from '@/lib/toast';
import { formatDistanceToNow } from 'date-fns';
import { PublishingErrorBoundary } from '@/components/admin/PublishingErrorBoundary';

export function PublishingDashboard() {
  const { operators, loading } = useOperators();
  const { publishStaticContent, loading: publishLoading } = useStaticContent();
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handlePublish = async (operatorId: string, operatorName: string) => {
    setPublishingId(operatorId);
    
    try {
      console.log('Starting publishing process for operator:', operatorId);
      const success = await publishStaticContent(operatorId);
      
      if (success) {
        toast.success(`${operatorName} published successfully!`);
        
        // Small delay to ensure state is properly updated
        setTimeout(() => {
          console.log('Publishing completed successfully for operator:', operatorId);
        }, 100);
      } else {
        toast.error(`Failed to publish ${operatorName}`);
      }
    } catch (error) {
      console.error('Publishing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error publishing ${operatorName}: ${errorMessage}`);
    } finally {
      // Ensure we always clear the publishing state
      setTimeout(() => {
        setPublishingId(null);
      }, 200);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading operators...</div>
        </CardContent>
      </Card>
    );
  }

  const publishedOperators = operators?.filter(op => op.published) || [];
  const unpublishedOperators = operators?.filter(op => !op.published) || [];

  return (
    <PublishingErrorBoundary onRetry={() => window.location.reload()}>
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publishing Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{publishedOperators.length}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{unpublishedOperators.length}</div>
              <div className="text-sm text-muted-foreground">Unpublished</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{operators?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Operators</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Operators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Published Operators
          </CardTitle>
        </CardHeader>
        <CardContent>
          {publishedOperators.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No operators published yet
            </div>
          ) : (
            <div className="space-y-3">
              {publishedOperators.map((operator) => (
                <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {operator.logo_url && (
                      <img 
                        src={operator.logo_url} 
                        alt={operator.name} 
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{operator.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Published {operator.published_at ? 
                          formatDistanceToNow(new Date(operator.published_at), { addSuffix: true }) : 
                          'unknown'
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      Live
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePublish(operator.id, operator.name)}
                      disabled={publishingId === operator.id || publishLoading}
                    >
                      {publishingId === operator.id ? 'Publishing...' : 'Re-publish'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unpublished Operators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-orange-600" />
            Unpublished Operators
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unpublishedOperators.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              All operators are published
            </div>
          ) : (
            <div className="space-y-3">
              {unpublishedOperators.map((operator) => (
                <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {operator.logo_url && (
                      <img 
                        src={operator.logo_url} 
                        alt={operator.name} 
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{operator.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Draft • Not published
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-orange-700 bg-orange-100">
                      Draft
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handlePublish(operator.id, operator.name)}
                      disabled={publishingId === operator.id || publishLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {publishingId === operator.id ? 'Publishing...' : 'Publish'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </PublishingErrorBoundary>
  );
}