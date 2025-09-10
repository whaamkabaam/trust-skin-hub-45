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
import { supabase } from '@/integrations/supabase/client';

export default function NewOperator() {
  const navigate = useNavigate();
  const { createOperator, autoSaveOperator } = useOperators();
  const [isLoading, setIsLoading] = useState(false);

  const migrateExtensionData = async (operatorId: string, tempData: any) => {
    const migrations = [];
    
    // Migrate bonuses
    if (tempData.bonuses?.length > 0) {
      const bonusesWithOperatorId = tempData.bonuses.map((bonus: any) => ({
        ...bonus,
        operator_id: operatorId
      }));
      migrations.push(
        supabase.from('operator_bonuses').insert(bonusesWithOperatorId)
      );
    }
    
    // Migrate payments
    if (tempData.payments?.length > 0) {
      const paymentsWithOperatorId = tempData.payments.map((payment: any) => ({
        ...payment,
        operator_id: operatorId
      }));
      migrations.push(
        supabase.from('operator_payments').insert(paymentsWithOperatorId)
      );
    }
    
    // Migrate features
    if (tempData.features?.length > 0) {
      const featuresWithOperatorId = tempData.features.map((feature: any) => ({
        ...feature,
        operator_id: operatorId
      }));
      migrations.push(
        supabase.from('operator_features').insert(featuresWithOperatorId)
      );
    }
    
    // Migrate security
    if (tempData.security) {
      migrations.push(
        supabase.from('operator_security').insert({
          ...tempData.security,
          operator_id: operatorId
        })
      );
    }
    
    // Migrate FAQs
    if (tempData.faqs?.length > 0) {
      const faqsWithOperatorId = tempData.faqs.map((faq: any) => ({
        ...faq,
        operator_id: operatorId
      }));
      migrations.push(
        supabase.from('operator_faqs').insert(faqsWithOperatorId)
      );
    }
    
    // Execute all migrations
    if (migrations.length > 0) {
      const results = await Promise.allSettled(migrations);
      const failed = results.filter(result => result.status === 'rejected');
      
      if (failed.length > 0) {
        console.error('Some extension migrations failed:', failed);
        toast.warning(`Operator created, but ${failed.length} extension(s) failed to migrate`);
      } else {
        toast.success('Operator and all extensions created successfully');
      }
    }
  };

  const handleSubmit = async (data: OperatorFormData) => {
    try {
      setIsLoading(true);
      
      // Create the operator first
      const newOperator = await createOperator(data);
      
      // Get temporary extension data and migrate to database
      const tempId = localStorage.getItem('new-operator-temp-id');
      if (tempId && newOperator?.id) {
        const tempData = getTempExtensionData(tempId);
        
        // Migrate all extension data to database
        console.log('Migrating temp extension data:', tempData);
        await migrateExtensionData(newOperator.id, tempData);
        
        // Clear temporary data after successful migration
        ['bonuses', 'payments', 'features', 'security', 'faqs'].forEach(type => {
          localStorage.removeItem(`temp-${type}-${tempId}`);
        });
        clearStableTempId();
      } else {
        toast.success('Operator created successfully');
      }
      
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
      // Use the stable temp ID for consistency with extensions
      const tempId = localStorage.getItem('new-operator-temp-id');
      if (tempId) {
        localStorage.setItem(`operator-draft-${tempId}`, JSON.stringify(data));
      }
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