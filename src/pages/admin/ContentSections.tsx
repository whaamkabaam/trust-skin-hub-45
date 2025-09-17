import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentSectionManager, type ContentSection } from '@/components/admin/ContentSectionManager';
import { useOperators } from '@/hooks/useOperators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export default function ContentSections() {
  const { operators } = useOperators();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(false);

  // Load sections when operator is selected
  const handleOperatorChange = async (operatorId: string) => {
    setSelectedOperatorId(operatorId);
    if (operatorId) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('content_sections')
          .select('*')
          .eq('operator_id', operatorId)
          .order('order_number');

        if (error) throw error;
        setSections(data || []);
      } catch (error) {
        console.error('Error loading sections:', error);
        toast.error('Failed to load content sections');
      } finally {
        setLoading(false);
      }
    } else {
      setSections([]);
    }
  };

  const handleSectionsChange = (newSections: ContentSection[]) => {
    setSections(newSections);
  };

  const handleSave = async () => {
    if (!selectedOperatorId) return;
    
    try {
      // Delete existing sections
      await supabase
        .from('content_sections')
        .delete()
        .eq('operator_id', selectedOperatorId);

      // Insert new sections
      if (sections.length > 0) {
        const sectionsToInsert = sections.map((section, index) => ({
          operator_id: selectedOperatorId,
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Sections</h1>
          <p className="text-muted-foreground">Manage content sections for operators</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedOperatorId} onValueChange={handleOperatorChange}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose an operator to manage content..." />
            </SelectTrigger>
            <SelectContent>
              {operators.length === 0 ? (
                <SelectItem value="none" disabled>No operators available</SelectItem>
              ) : (
                operators.map(operator => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedOperatorId && (
        <ContentSectionManager 
          operatorId={selectedOperatorId}
          sections={sections}
          onSectionsChange={handleSectionsChange}
          onSave={handleSave}
          disabled={loading}
        />
      )}
    </div>
  );
}