import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface PaymentMethodFormData {
  name: string;
  slug: string;
  logo_url?: string;
  description_rich?: string;
  display_order?: number;
  is_featured?: boolean;
}

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching payment methods",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createPaymentMethod = useCallback(async (methodData: PaymentMethodFormData) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert([methodData])
        .select()
        .single();

      if (error) throw error;

      setPaymentMethods(prev => [...prev, data]);
      toast({
        title: "Payment method created",
        description: `${methodData.name} has been created successfully.`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating payment method",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const updatePaymentMethod = useCallback(async (id: string, methodData: Partial<PaymentMethodFormData>) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .update(methodData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPaymentMethods(prev => prev.map(method => method.id === id ? data : method));
      toast({
        title: "Payment method updated",
        description: "Payment method has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating payment method",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const deletePaymentMethod = useCallback(async (id: string) => {
    try {
      // Check if payment method is in use
      const { count, error: countError } = await supabase
        .from('operator_payment_methods')
        .select('*', { count: 'exact', head: true })
        .eq('payment_method_id', id);

      if (countError) throw countError;

      if (count && count > 0) {
        toast({
          title: "Cannot delete payment method",
          description: `This payment method is being used by ${count} operator(s). Remove these associations first.`,
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      toast({
        title: "Payment method deleted",
        description: "Payment method has been deleted successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting payment method",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return {
    paymentMethods,
    loading,
    fetchPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  };
}