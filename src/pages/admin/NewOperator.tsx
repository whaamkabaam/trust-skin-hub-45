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

  const cleanDataForInsert = (item: any) => {
    const { id, created_at, updated_at, ...cleanItem } = item;
    return cleanItem;
  };

  // Transform AI-extracted data to match database schema
  const transformPaymentForDatabase = (payment: any) => {
    const cleanPayment = cleanDataForInsert(payment);
    
    // Map AI fields to database fields
    const transformed = {
      ...cleanPayment,
      // Handle fee transformation - convert "fees" to fee_percentage and fee_fixed
      fee_percentage: cleanPayment.fee_percentage || (typeof cleanPayment.fees === 'string' && cleanPayment.fees.includes('%') ? parseFloat(cleanPayment.fees) || 0 : 0),
      fee_fixed: cleanPayment.fee_fixed || (typeof cleanPayment.fees === 'number' ? cleanPayment.fees : 0),
      // Ensure numeric fields are properly typed
      minimum_amount: cleanPayment.minimum_amount || cleanPayment.min_amount || null,
      maximum_amount: cleanPayment.maximum_amount || cleanPayment.max_amount || null
    };
    
    // Remove the old "fees" field if it exists
    delete transformed.fees;
    delete transformed.min_amount;
    delete transformed.max_amount;
    
    return transformed;
  };

  const transformFeatureForDatabase = (feature: any) => {
    const cleanFeature = cleanDataForInsert(feature);
    
    // Ensure feature_type is present (required by database)
    const transformed = {
      ...cleanFeature,
      feature_type: cleanFeature.feature_type || 'gameplay' // Default to 'gameplay' if not specified
    };
    
    return transformed;
  };

  const transformSecurityForDatabase = (security: any) => {
    const cleanSecurity = cleanDataForInsert(security);
    
    // Remove fields that don't exist in database schema
    const transformed = { ...cleanSecurity };
    delete transformed.security_measures; // This field doesn't exist in DB
    
    // Ensure compliance_certifications is an array
    if (!transformed.compliance_certifications || !Array.isArray(transformed.compliance_certifications)) {
      transformed.compliance_certifications = [];
    }
    
    return transformed;
  };

  const migrateExtensionData = async (operatorId: string, tempData: any) => {
    const migrations = [];
    const migrationResults: { type: string; success: boolean; error?: any }[] = [];
    
    try {
      // Migrate bonuses
      if (tempData.bonuses?.length > 0) {
        const cleanBonuses = tempData.bonuses.map((bonus: any) => ({
          ...cleanDataForInsert(bonus),
          operator_id: operatorId
        }));
        
        const bonusResult = await supabase.from('operator_bonuses').insert(cleanBonuses);
        migrationResults.push({
          type: 'bonuses',
          success: !bonusResult.error,
          error: bonusResult.error
        });
        
        if (bonusResult.error) {
          console.error('Bonus migration failed:', bonusResult.error);
        }
      }
      
      // Migrate payments with proper transformation
      if (tempData.payments?.length > 0) {
        const cleanPayments = tempData.payments.map((payment: any) => ({
          ...transformPaymentForDatabase(payment),
          operator_id: operatorId
        }));
        
        const paymentResult = await supabase.from('operator_payments').insert(cleanPayments);
        migrationResults.push({
          type: 'payments',
          success: !paymentResult.error,
          error: paymentResult.error
        });
        
        if (paymentResult.error) {
          console.error('Payment migration failed:', paymentResult.error);
        }
      }
      
      // Migrate features with proper transformation
      if (tempData.features?.length > 0) {
        const cleanFeatures = tempData.features.map((feature: any) => ({
          ...transformFeatureForDatabase(feature),
          operator_id: operatorId
        }));
        
        const featureResult = await supabase.from('operator_features').insert(cleanFeatures);
        migrationResults.push({
          type: 'features',
          success: !featureResult.error,
          error: featureResult.error
        });
        
        if (featureResult.error) {
          console.error('Feature migration failed:', featureResult.error);
        }
      }
      
      // Migrate security with proper transformation
      if (tempData.security) {
        const cleanSecurity = {
          ...transformSecurityForDatabase(tempData.security),
          operator_id: operatorId
        };
        
        const securityResult = await supabase.from('operator_security').insert(cleanSecurity);
        migrationResults.push({
          type: 'security',
          success: !securityResult.error,
          error: securityResult.error
        });
        
        if (securityResult.error) {
          console.error('Security migration failed:', securityResult.error);
        }
      }
      
      // Migrate FAQs
      if (tempData.faqs?.length > 0) {
        const cleanFaqs = tempData.faqs.map((faq: any) => ({
          ...cleanDataForInsert(faq),
          operator_id: operatorId
        }));
        
        const faqResult = await supabase.from('operator_faqs').insert(cleanFaqs);
        migrationResults.push({
          type: 'faqs',
          success: !faqResult.error,
          error: faqResult.error
        });
        
        if (faqResult.error) {
          console.error('FAQ migration failed:', faqResult.error);
        }
      }
      
      // Analyze results
      const failedMigrations = migrationResults.filter(result => !result.success);
      
      if (failedMigrations.length > 0) {
        console.error('Some extension migrations failed:', failedMigrations);
        toast.warning(`Operator created, but ${failedMigrations.length} extension(s) failed to migrate`);
        
        // Don't clear localStorage if migrations failed (for recovery)
        return false;
      } else if (migrationResults.length > 0) {
        toast.success('Operator and all extensions created successfully');
      } else {
        toast.success('Operator created successfully');
      }
      
      return true;
    } catch (error) {
      console.error('Critical error during extension migration:', error);
      toast.error('Extension migration failed - data preserved for recovery');
      return false;
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
        
        // Check if there's any extension data to migrate
        const hasExtensionData = tempData.bonuses.length > 0 || 
                               tempData.payments.length > 0 || 
                               tempData.features.length > 0 || 
                               tempData.security || 
                               tempData.faqs.length > 0;
        
        if (hasExtensionData) {
          console.log('Migrating temp extension data:', tempData);
          const migrationSuccess = await migrateExtensionData(newOperator.id, tempData);
          
          // Only clear temporary data after successful migration
          if (migrationSuccess) {
            ['bonuses', 'payments', 'features', 'security', 'faqs'].forEach(type => {
              localStorage.removeItem(`temp-${type}-${tempId}`);
            });
            // Also clear auto-save draft
            localStorage.removeItem(`temp-form-data-${tempId}`);
            clearStableTempId();
          } else {
            // Keep data for recovery, but still navigate
            toast.info('Operator created - extension data preserved for recovery');
          }
        } else {
          // No extension data, just clean up
          clearStableTempId();
          toast.success('Operator created successfully');
        }
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
        // Use consistent key naming with extensions
        localStorage.setItem(`temp-form-data-${tempId}`, JSON.stringify(data));
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