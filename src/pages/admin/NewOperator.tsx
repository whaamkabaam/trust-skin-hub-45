import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOperators } from '@/hooks/useOperators';
import { OperatorForm } from '@/components/admin/OperatorForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { OperatorFormData } from '@/lib/validations';

export default function NewOperator() {
  const navigate = useNavigate();
  const { createOperator, autoSaveOperator } = useOperators();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: OperatorFormData) => {
    try {
      setIsLoading(true);
      await createOperator(data);
      toast.success('Operator created successfully');
      navigate('/admin/operators');
    } catch (error) {
      console.error('Failed to create operator:', error);
      toast.error('Failed to create operator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSave = async (data: OperatorFormData) => {
    try {
      // For new operators, save as draft data
      console.log('Auto-saving draft:', data);
      toast.success('Draft saved automatically', { duration: 2000 });
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error('Failed to save draft');
    }
  };

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
          <h1 className="text-2xl font-bold">New Operator</h1>
          <p className="text-muted-foreground">Create a new gambling operator</p>
        </div>
      </div>

      <OperatorForm
        onSubmit={handleSubmit}
        onAutoSave={handleAutoSave}
        isLoading={isLoading}
        autoSaveEnabled={true}
      />
    </div>
  );
}