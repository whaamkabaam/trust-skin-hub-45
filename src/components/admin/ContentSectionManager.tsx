import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { TabErrorBoundary } from './TabErrorBoundary';

interface ContentSection {
  id?: string;
  section_key: string;
  heading: string;
  rich_text_content: string;
  order_number: number;
}

interface ContentSectionManagerProps {
  operatorId: string;
  initialSections?: ContentSection[];
  onSectionsChange?: (sections: ContentSection[]) => void;
  disabled?: boolean;
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

export function ContentSectionManager({ 
  operatorId, 
  initialSections = [], 
  onSectionsChange,
  disabled = false 
}: ContentSectionManagerProps) {
  const [sections, setSections] = useState<ContentSection[]>(initialSections);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize sections from props or fetch from database
  useEffect(() => {
    if (initialSections.length > 0) {
      setSections(initialSections);
    } else if (operatorId && !operatorId.startsWith('temp-')) {
      fetchSections();
    }
  }, [operatorId, initialSections]);

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

  // Notify parent component of changes
  const updateSections = useCallback((newSections: ContentSection[]) => {
    setSections(newSections);
    onSectionsChange?.(newSections);
  }, [onSectionsChange]);

  const addSection = (sectionKey: string) => {
    if (disabled) return;
    
    const template = SECTION_TEMPLATES.find(t => t.key === sectionKey);
    if (!template) return;

    const newSection: ContentSection = {
      section_key: template.key,
      heading: template.defaultHeading,
      rich_text_content: '',
      order_number: sections.length,
    };

    const newSections = [...sections, newSection];
    updateSections(newSections);
  };

  const updateSection = (index: number, field: keyof ContentSection, value: string | number) => {
    if (disabled) return;
    
    const newSections = sections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    );
    updateSections(newSections);
  };

  const removeSection = (index: number) => {
    if (disabled) return;
    
    const newSections = sections.filter((_, i) => i !== index);
    updateSections(newSections);
  };

  const saveSections = async () => {
    if (disabled || operatorId.startsWith('temp-')) {
      toast.warning('Please save the operator first before saving content sections');
      return;
    }

    try {
      setSaving(true);
      
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
      
      // Refresh to get IDs for existing operators
      if (!operatorId.startsWith('temp-')) {
        fetchSections();
      }
    } catch (err) {
      console.error('Error saving sections:', err);
      toast.error('Failed to save content sections');
    } finally {
      setSaving(false);
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
    <TabErrorBoundary tabName="Content Sections">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Content Sections</h3>
          <div className="flex items-center space-x-2">
            <Select onValueChange={addSection} disabled={disabled}>
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
            <Button 
              type="button" 
              onClick={saveSections} 
              disabled={saving || disabled || operatorId.startsWith('temp-')}
            >
              {saving ? 'Saving...' : 'Save All'}
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
                        disabled={disabled}
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
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(index)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TabErrorBoundary tabName={`Content Section ${index + 1}`}>
                  <RichTextEditor
                    value={section.rich_text_content}
                    onChange={(value) => updateSection(index, 'rich_text_content', value)}
                    placeholder="Section content..."
                  />
                </TabErrorBoundary>
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
              {operatorId.startsWith('temp-') && (
                <p className="text-sm text-amber-600 mt-2">
                  Save the operator first to enable content section saving.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </TabErrorBoundary>
  );
}