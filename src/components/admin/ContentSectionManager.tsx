import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentSection {
  id?: string;
  section_key: string;
  heading: string;
  rich_text_content: string;
  order_number: number;
}

interface ContentSectionManagerProps {
  operatorId: string;
}

const SECTION_TEMPLATES = [
  { key: 'overview', label: 'Overview', defaultHeading: 'Overview' },
  { key: 'bonuses', label: 'Bonuses & Promotions', defaultHeading: 'Bonuses & Promotions' },
  { key: 'games', label: 'Games & Features', defaultHeading: 'Games & Features' },
  { key: 'payments', label: 'Payment Methods', defaultHeading: 'Payment Methods' },
  { key: 'support', label: 'Customer Support', defaultHeading: 'Customer Support' },
  { key: 'security', label: 'Security & Licensing', defaultHeading: 'Security & Licensing' },
  { key: 'mobile', label: 'Mobile Experience', defaultHeading: 'Mobile Experience' },
  { key: 'responsible', label: 'Responsible Gaming', defaultHeading: 'Responsible Gaming' },
];

export function ContentSectionManager({ operatorId }: ContentSectionManagerProps) {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, [operatorId]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('operator_id', operatorId)
        .order('order_number');

      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      console.error('Error fetching sections:', err);
      toast.error('Failed to fetch content sections');
    } finally {
      setLoading(false);
    }
  };

  const addSection = (sectionKey: string) => {
    const template = SECTION_TEMPLATES.find(t => t.key === sectionKey);
    if (!template) return;

    const newSection: ContentSection = {
      section_key: template.key,
      heading: template.defaultHeading,
      rich_text_content: '',
      order_number: sections.length,
    };

    setSections(prev => [...prev, newSection]);
  };

  const updateSection = (index: number, field: keyof ContentSection, value: string | number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const saveSections = async () => {
    try {
      setLoading(true);
      
      // Delete existing sections for this operator
      await supabase
        .from('content_sections')
        .delete()
        .eq('operator_id', operatorId);

      // Insert new sections
      if (sections.length > 0) {
        const sectionsToInsert = sections.map((section, index) => ({
          operator_id: operatorId,
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
      fetchSections(); // Refresh to get IDs
    } catch (err) {
      console.error('Error saving sections:', err);
      toast.error('Failed to save content sections');
    } finally {
      setLoading(false);
    }
  };

  if (loading && sections.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Content Sections</h3>
        <div className="flex items-center space-x-2">
          <Select onValueChange={addSection}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add section..." />
            </SelectTrigger>
            <SelectContent>
              {SECTION_TEMPLATES.map(template => (
                <SelectItem key={template.key} value={template.key}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={saveSections} disabled={loading}>
            {loading ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label>Section Type</Label>
                    <Select
                      value={section.section_key}
                      onValueChange={(value) => updateSection(index, 'section_key', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTION_TEMPLATES.map(template => (
                          <SelectItem key={template.key} value={template.key}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Heading</Label>
                    <Input
                      value={section.heading}
                      onChange={(e) => updateSection(index, 'heading', e.target.value)}
                      placeholder="Section heading..."
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSection(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={section.rich_text_content}
                onChange={(value) => updateSection(index, 'rich_text_content', value)}
                placeholder="Section content..."
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {sections.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No content sections added yet.</p>
            <p className="text-sm text-muted-foreground">
              Use the dropdown above to add content sections for this operator.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}