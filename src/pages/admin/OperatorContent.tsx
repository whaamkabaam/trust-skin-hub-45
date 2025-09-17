import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOperator } from '@/hooks/useOperators';
import { ContentSectionManager, type ContentSection } from '@/components/admin/ContentSectionManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export default function OperatorContent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { operator, loading } = useOperator(id);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  // Load sections when operator is loaded
  useEffect(() => {
    const loadSections = async () => {
      if (id && !id.startsWith('temp-')) {
        setSectionsLoading(true);
        try {
          const { data, error } = await supabase
            .from('content_sections')
            .select('*')
            .eq('operator_id', id)
            .order('order_number');

          if (error) throw error;
          setSections(data || []);
        } catch (error) {
          console.error('Error loading sections:', error);
          toast.error('Failed to load content sections');
        } finally {
          setSectionsLoading(false);
        }
      }
    };

    loadSections();
  }, [id]);

  const handleSectionsChange = useCallback((newSections: ContentSection[]) => {
    setSections(newSections);
  }, []);

  const handleSave = useCallback(async () => {
    if (!id || id.startsWith('temp-')) return;
    
    try {
      // Delete existing sections
      await supabase
        .from('content_sections')
        .delete()
        .eq('operator_id', id);

      // Insert new sections
      if (sections.length > 0) {
        const sectionsToInsert = sections.map((section, index) => ({
          operator_id: id,
          section_key: section.section_key,
          heading: section.heading,
          rich_text_content: section.rich_text_content,
          order_number: index,
        }));

        const { error } = await supabase
          .from('content_sections')
          .insert(sectionsToInsert);

        if (error) throw error;
      }
      
      toast.success('Content sections saved successfully');
    } catch (error) {
      console.error('Error saving sections:', error);
      toast.error('Failed to save content sections');
      throw error;
    }
  }, [id, sections]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading operator...</p>
        </div>
      </div>
    );
  }

  if (!operator) {
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
          onClick={() => navigate(`/admin/operators/${id}`)}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Managing content for {operator.name}</p>
        </div>
      </div>

      <ContentSectionManager 
        operatorId={id!}
        sections={sections}
        onSectionsChange={handleSectionsChange}
        onSave={handleSave}
        disabled={sectionsLoading}
      />
    </div>
  );
}