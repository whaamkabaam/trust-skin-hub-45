import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOperators, useOperator } from '@/hooks/useOperators';
import { OperatorForm } from '@/components/admin/OperatorForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { OperatorFormData } from '@/lib/validations';
import { clearStableTempId } from '@/hooks/useStableTempId';
import { getTempExtensionData } from '@/hooks/useLocalStorageExtensions';

export default function NewOperator() {
  const navigate = useNavigate();
  const { createOperator, autoSaveOperator } = useOperators();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: OperatorFormData) => {
    try {
      setIsLoading(true);
      
      // Create the operator first
      const newOperator = await createOperator(data);
      
      // Get temporary extension data and migrate to database
      const tempId = localStorage.getItem('new-operator-temp-id');
      if (tempId && newOperator?.id) {
        const tempData = getTempExtensionData(tempId);
        
        // TODO: Add logic to save extension data to database
        // This would require calling the appropriate save functions from useOperatorExtensions
        console.log('Migrating temp extension data:', tempData);
        
        // Clear temporary data after successful migration
        ['bonuses', 'payments', 'features', 'security', 'faqs'].forEach(type => {
          localStorage.removeItem(`temp-${type}-${tempId}`);
        });
        clearStableTempId();
      }
      
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
      // For new operators, we create a draft with a temporary ID
      // This allows users to come back and continue editing
      const draftId = 'draft-' + Date.now();
      localStorage.setItem(`operator-draft-${draftId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
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