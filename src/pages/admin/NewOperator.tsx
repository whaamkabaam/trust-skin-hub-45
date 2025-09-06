import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOperators } from '@/hooks/useOperators';
import { OperatorForm } from '@/components/admin/OperatorForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { OperatorFormData } from '@/lib/validations';

export default function NewOperator() {
  const navigate = useNavigate();
  const { createOperator } = useOperators();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: OperatorFormData) => {
    try {
      setIsLoading(true);
      await createOperator(data);
      navigate('/admin/operators');
    } catch (error) {
      console.error('Failed to create operator:', error);
    } finally {
      setIsLoading(false);
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
        isLoading={isLoading}
      />
    </div>
  );
}