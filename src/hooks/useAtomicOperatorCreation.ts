import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { OperatorFormData } from '@/lib/validations';

interface ExtensionData {
  bonuses: any[];
  payments: any[];
  features: any[];
  security: any;
  faqs: any[];
}

interface AtomicOperatorResult {
  operator: any;
  success: boolean;
  errors: string[];
}

/**
 * Atomically creates an operator with all extension data
 * Either everything succeeds or everything fails (with rollback)
 */
export async function createOperatorAtomic(
  operatorData: OperatorFormData,
  extensionData: ExtensionData
): Promise<AtomicOperatorResult> {
  const errors: string[] = [];
  let createdOperator: any = null;

  try {
    console.log('🚀 Starting atomic operator creation');
    
    // Start transaction-like behavior
    // Step 1: Create the operator
    const { data: operator, error: operatorError } = await supabase
      .from('operators')
      .insert(operatorData)
      .select()
      .single();

    if (operatorError) {
      console.error('Operator creation failed:', operatorError);
      throw new Error(`Failed to create operator: ${operatorError.message}`);
    }

    createdOperator = operator;
    console.log('✅ Operator created:', operator.id);

    // Step 2: Create all extensions atomically
    const extensionPromises: Promise<any>[] = [];
    
    // Bonuses
    if (extensionData.bonuses?.length > 0) {
      const cleanBonuses = extensionData.bonuses.map(bonus => ({
        ...bonus,
        operator_id: operator.id,
        id: undefined, // Remove temp ID
        created_at: undefined,
        updated_at: undefined
      }));
      
      extensionPromises.push(
        supabase.from('operator_bonuses').insert(cleanBonuses)
          .then(result => ({ type: 'bonuses', result })) as Promise<any>
      );
    }

    // Payments
    if (extensionData.payments?.length > 0) {
      const cleanPayments = extensionData.payments.map(payment => ({
        ...payment,
        operator_id: operator.id,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));
      
      extensionPromises.push(
        supabase.from('operator_payments').insert(cleanPayments)
          .then(result => ({ type: 'payments', result })) as Promise<any>
      );
    }

    // Features
    if (extensionData.features?.length > 0) {
      const cleanFeatures = extensionData.features.map(feature => ({
        ...feature,
        operator_id: operator.id,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));
      
      extensionPromises.push(
        supabase.from('operator_features').insert(cleanFeatures)
          .then(result => ({ type: 'features', result })) as Promise<any>
      );
    }

    // Security
    if (extensionData.security) {
      const cleanSecurity = {
        ...extensionData.security,
        operator_id: operator.id,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      };
      
      extensionPromises.push(
        supabase.from('operator_security').insert(cleanSecurity)
          .then(result => ({ type: 'security', result })) as Promise<any>
      );
    }

    // FAQs
    if (extensionData.faqs?.length > 0) {
      const cleanFaqs = extensionData.faqs.map(faq => ({
        ...faq,
        operator_id: operator.id,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));
      
      extensionPromises.push(
        supabase.from('operator_faqs').insert(cleanFaqs)
          .then(result => ({ type: 'faqs', result })) as Promise<any>
      );
    }

    // Wait for all extensions to complete
    if (extensionPromises.length > 0) {
      console.log(`📦 Creating ${extensionPromises.length} extension types`);
      const extensionResults = await Promise.allSettled(extensionPromises);
      
      // Check for failures
      const failures = extensionResults
        .map((result, index) => ({ result, index }))
        .filter(({ result }) => result.status === 'rejected')
        .map(({ result, index }) => {
          const reason = (result as PromiseRejectedResult).reason;
          return `Extension ${index}: ${reason?.message || reason}`;
        });

      if (failures.length > 0) {
        throw new Error(`Extension creation failed: ${failures.join(', ')}`);
      }

      console.log('✅ All extensions created successfully');
    }

    toast.success('Operator and all extensions created successfully!');
    
    return {
      operator: createdOperator,
      success: true,
      errors: []
    };

  } catch (error) {
    console.error('💥 Atomic creation failed:', error);
    errors.push(error instanceof Error ? error.message : String(error));

    // Rollback: Delete the operator if it was created
    if (createdOperator) {
      console.log('🔄 Rolling back operator creation');
      try {
        await supabase.from('operators').delete().eq('id', createdOperator.id);
        toast.warning('Creation failed - all changes have been rolled back');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        toast.error('Creation and rollback both failed - manual cleanup may be needed');
      }
    } else {
      toast.error('Failed to create operator');
    }

    return {
      operator: null,
      success: false,
      errors
    };
  }
}