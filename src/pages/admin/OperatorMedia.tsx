import { useParams, useNavigate } from 'react-router-dom';
import { useOperator } from '@/hooks/useOperators';
import { MediaAssetManager } from '@/components/admin/MediaAssetManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function OperatorMedia() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { operator, loading } = useOperator(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading operator...</p>
        </div>
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Operator not found</h2>
        <p className="text-muted-foreground mb-4">The operator you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin/operators')}>
          Back to Operators
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/admin/operators/${id}`)}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Media Management</h1>
          <p className="text-muted-foreground">Managing media assets for {operator.name}</p>
        </div>
      </div>

      <MediaAssetManager operatorId={id!} />
    </div>
  );
}