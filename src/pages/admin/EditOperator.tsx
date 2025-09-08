import { useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOperators, useOperator } from '@/hooks/useOperators';
import { OperatorForm } from '@/components/admin/OperatorForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { OperatorFormData } from '@/lib/validations';

export default function EditOperator() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateOperator, autoSaveOperator } = useOperators();
  const { operator, loading: operatorLoading } = useOperator(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Stable reference to operator data during publishing operations
  const stableOperatorRef = useRef<typeof operator>(null);
  const stableOperator = useMemo(() => {
    if (isPublishing && stableOperatorRef.current) {
      return stableOperatorRef.current;
    }
    if (operator) {
      stableOperatorRef.current = operator;
    }
    return operator;
  }, [operator, isPublishing]);

  const handleSubmit = async (data: OperatorFormData) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // Set publishing state if this is a publish operation
      if (data.published === true) {
        setIsPublishing(true);
      }
      
      await updateOperator(id, data);
      toast.success('Operator updated successfully');
      navigate('/admin/operators');
    } catch (error) {
      console.error('Failed to update operator:', error);
      toast.error('Failed to update operator');
    } finally {
      setIsLoading(false);
      setIsPublishing(false);
    }
  };

  const handleAutoSave = async (data: OperatorFormData) => {
    if (id) {
      await autoSaveOperator(id, data);
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
        isLoading={isLoading || isPublishing}
        autoSaveEnabled={true}
        publishingState={isPublishing}
      />
    </div>
  );
}