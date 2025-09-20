import { useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOperators, useOperator } from '@/hooks/useOperators';
import { OperatorForm } from '@/components/admin/OperatorForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { usePublishingState } from '@/hooks/usePublishingState';
import { PublishingErrorBoundary } from '@/components/admin/PublishingErrorBoundary';
import { usePublishingQueue } from '@/hooks/usePublishingQueue';
import type { OperatorFormData } from '@/lib/validations';

export default function EditOperator() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateOperator, autoSaveOperator } = useOperators();
  const { operator, loading: operatorLoading } = useOperator(id);
  const [isLoading, setIsLoading] = useState(false);
  const { isPublishing: globalIsPublishing, operatorId: publishingOperatorId } = usePublishingState();
  
  // Check if this specific operator is being published globally
  const isThisOperatorPublishing = globalIsPublishing && publishingOperatorId === id;
  
  // Stable reference to operator data during publishing operations
  const stableOperatorRef = useRef<typeof operator>(null);
  const stableOperator = useMemo(() => {
    if (isThisOperatorPublishing && stableOperatorRef.current) {
      return stableOperatorRef.current;
    }
    if (operator) {
      stableOperatorRef.current = operator;
    }
    return operator;
  }, [operator, isThisOperatorPublishing]);

  const handleSubmit = async (data: OperatorFormData) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // Set stable reference before publishing
      if (data.published === true) {
        stableOperatorRef.current = operator;
      }
      
      await updateOperator(id, data);
      
      // Only show success toast if not publishing (updateOperator shows its own toast)
      if (data.published !== true) {
        toast.success('Operator updated successfully');
      }
      
      // Add delay before navigation to allow state cleanup
      setTimeout(() => {
        navigate('/admin/operators');
      }, data.published === true ? 300 : 100);
    } catch (error) {
      console.error('Failed to update operator:', error);
      toast.error('Failed to update operator');
    } finally {
      setIsLoading(false);
    }
  };

  // Stable reset handler to prevent stale closures
  const handleReset = () => {
    try {
      const { clearPublishing } = usePublishingState.getState();
      clearPublishing();
      // Add small delay to allow state cleanup
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Reset failed:', error);
      // Fallback: force reload without state cleanup
      window.location.reload();
    }
  };

  const handleAutoSave = async (data: OperatorFormData) => {
    if (!id) return;
    
    try {
      // Auto-save should NEVER trigger publishing
      await autoSaveOperator(id, data);
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error toast for auto-save failures
    }
  };

  if (operatorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading operator...</p>
        </div>
      </div>
    );
  }

  if (!stableOperator) {
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
    <PublishingErrorBoundary 
      operatorId={id} 
      onReset={handleReset}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/operators')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Operator</h1>
            <p className="text-muted-foreground">Editing {stableOperator.name}</p>
          </div>
        </div>

        <OperatorForm
          initialData={stableOperator}
          onSubmit={handleSubmit}
          onAutoSave={handleAutoSave}
          isLoading={isLoading || isThisOperatorPublishing}
          autoSaveEnabled={true}
          publishingState={isThisOperatorPublishing}
        />
      </div>
    </PublishingErrorBoundary>
  );
}