import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import type { OperatorFormData } from '@/lib/validations';
import { useStaticContent } from './useStaticContent';

type Operator = Tables<'operators'>;

export function useOperators() {
  const queryClient = useQueryClient();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publishStaticContent } = useStaticContent();

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperators(data || []);
    } catch (err) {
      console.error('Error fetching operators:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch operators');
      toast.error('Failed to fetch operators');
    } finally {
      setLoading(false);
    }
  };

  const createOperator = async (data: OperatorFormData) => {
    try {
      const { data: newOperator, error } = await supabase
        .from('operators')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      
      // Optimistic update
      setOperators(prev => [newOperator, ...prev]);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['public-operators'] });
      
      toast.success('Operator created successfully');
      return newOperator;
    } catch (err) {
      console.error('Error creating operator:', err);
      toast.error('Failed to create operator');
      throw err;
    }
  };

  const updateOperator = async (id: string, data: Partial<OperatorFormData>) => {
    try {
      // Consolidate all database updates in a single transaction
      let updateData: any = { 
        ...data, 
        updated_at: new Date().toISOString()
      };
      
      // If publishing, add publishing fields
      if (data.published === true) {
        updateData = {
          ...updateData,
          published: true,
          published_at: new Date().toISOString(),
          publish_status: 'published'
        };
        
        // Generate static content first (without updating operator record)
        const published = await publishStaticContent(id);
        if (!published) {
          throw new Error('Static content generation failed');
        }
      }

      // Single database update with all changes
      const { data: updatedOperator, error } = await supabase
        .from('operators')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Show appropriate success message
      if (data.published === true) {
        toast.success('Operator published successfully with optimized content');
      } else {
        toast.success('Operator updated successfully');
      }
      
      // Optimistic update
      setOperators(prev => 
        prev.map(op => op.id === id ? updatedOperator : op)
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['public-operators'] });
      queryClient.invalidateQueries({ queryKey: ['operator', id] });
      
      return updatedOperator;
    } catch (err) {
      console.error('Error updating operator:', err);
      toast.error('Failed to update operator');
      throw err;
    }
  };

  const deleteOperator = async (id: string) => {
    try {
      const { error } = await supabase
        .from('operators')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update
      setOperators(prev => prev.filter(op => op.id !== id));
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['public-operators'] });
      queryClient.invalidateQueries({ queryKey: ['operator', id] });
      
      toast.success('Operator deleted successfully');
    } catch (err) {
      console.error('Error deleting operator:', err);
      toast.error('Failed to delete operator');
      throw err;
    }
  };

  const autoSaveOperator = async (id: string, data: Partial<OperatorFormData>) => {
    try {
      // Clean the data same way as form submission
      const cleanedData = {
        ...data,
        categories: data.categories?.filter(c => c.trim() !== '') || [],
        pros: data.pros?.filter(p => p.trim() !== '') || [],
        cons: data.cons?.filter(c => c.trim() !== '') || [],
        supported_countries: data.supported_countries?.filter(c => c.trim() !== '') || [],
        // Convert empty strings to null for timestamp fields
        scheduled_publish_at: data.scheduled_publish_at === '' ? null : data.scheduled_publish_at,
      };

      const { error } = await supabase
        .from('operators')
        .update({
          ...cleanedData,
          draft_data: cleanedData as any,
          last_auto_saved_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (err) {
      console.error('Auto-save failed:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  return {
    operators,
    loading,
    error,
    createOperator,
    updateOperator,
    deleteOperator,
    autoSaveOperator,
    refetch: fetchOperators,
  };
}

export function useOperator(id: string | undefined) {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pauseRefetch, setPauseRefetch] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchOperator = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('operators')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setOperator(data);
      } catch (err) {
        console.error('Error fetching operator:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch operator');
        toast.error('Failed to fetch operator');
      } finally {
        setLoading(false);
      }
    };

    if (!pauseRefetch) {
      fetchOperator();
    }
  }, [id, pauseRefetch]);

  return { 
    operator, 
    loading, 
    error,
    pauseRefetch: () => setPauseRefetch(true),
    resumeRefetch: () => setPauseRefetch(false)
  };
}