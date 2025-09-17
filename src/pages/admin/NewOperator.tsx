import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOperators } from '@/hooks/useOperators';
import { OperatorForm } from '@/components/admin/OperatorForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { OperatorFormData } from '@/lib/validations';
import { clearStableTempId } from '@/hooks/useStableTempId';
import { getTempExtensionData } from '@/hooks/useLocalStorageExtensions';
import { createOperatorAtomic } from '@/hooks/useAtomicOperatorCreation';
import { DataRecovery } from '@/components/admin/DataRecovery';
import { SafeModeProvider } from '@/components/admin/SafeModeProvider';

export default function NewOperator() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [recoveredData, setRecoveredData] = useState<any>(null);

  const handleSubmit = async (data: OperatorFormData) => {
    try {
      setIsLoading(true);
      
      // Get temporary extension data
      const tempId = localStorage.getItem('new-operator-temp-id');
      const tempData = tempId ? getTempExtensionData(tempId) : {
        bonuses: [],
        payments: [],
        features: [],
        security: null,
        faqs: []
      };
      
      console.log('🚀 Creating operator with atomic transaction');
      
      // Use atomic creation for all-or-nothing behavior
      const result = await createOperatorAtomic(data, tempData);
      
      if (result.success && result.operator) {
        // Clean up all temporary data
        if (tempId) {
          ['bonuses', 'payments', 'features', 'security', 'faqs'].forEach(type => {
            localStorage.removeItem(`temp-${type}-${tempId}`);
          });
          localStorage.removeItem(`temp-form-data-${tempId}`);
          clearStableTempId();
        }
        
        navigate('/admin/operators');
      } else {
        // Keep temporary data for recovery
        toast.error(`Creation failed: ${result.errors.join(', ')}`);
      }
      
    } catch (error) {
      console.error('Failed to create operator:', error);
      toast.error('Failed to create operator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSave = async (data: OperatorFormData) => {
    try {
      // Use the stable temp ID for consistency with extensions
      const tempId = localStorage.getItem('new-operator-temp-id');
      if (tempId) {
        // Use consistent key naming with extensions
        localStorage.setItem(`temp-form-data-${tempId}`, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
    }
  };

  const handleDataRecover = (data: any) => {
    setRecoveredData(data);
    toast.success('Data recovered! You can now review and submit.');
  };

  return (
    <SafeModeProvider>
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
            <p className="text-muted-foreground">Create a new gambling operator with atomic transactions</p>
          </div>
        </div>

        {/* Data Recovery Section */}
        <DataRecovery 
          operatorId="new-operator"
          onDataRecover={handleDataRecover}
        />

        <OperatorForm
          onSubmit={handleSubmit}
          onAutoSave={handleAutoSave}
          isLoading={isLoading}
          autoSaveEnabled={true}
          initialData={recoveredData}
        />
      </div>
    </SafeModeProvider>
  );
}