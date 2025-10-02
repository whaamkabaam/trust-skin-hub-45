import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StableRichTextEditor } from './StableRichTextEditor';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { toast } from '@/lib/toast';
import { TabErrorBoundary } from './TabErrorBoundary';

export interface ContentSection {
  id?: string;
  section_key: string;
  heading: string;
  rich_text_content: string;
  order_number: number;
}

interface ContentSectionManagerProps {
  operatorId: string;
  sections: ContentSection[];
  onSectionsChange: (sections: ContentSection[]) => void;
  disabled?: boolean;
  onSave?: () => Promise<void>;
  saveState?: 'idle' | 'saving' | 'saved' | 'error';
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
  sections,
  onSectionsChange,
  disabled = false,
  onSave,
  saveState = 'idle'
}: ContentSectionManagerProps) {
  const [selectedValue, setSelectedValue] = useState('');

  // Memoize available section options to prevent re-renders
  const availableSections = useMemo(() => {
    const usedKeys = new Set(sections.map(s => s.section_key));
    return SECTION_TEMPLATES.filter(template => !usedKeys.has(template.key));
  }, [sections]);

  const addSection = useCallback((sectionKey: string) => {
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
    onSectionsChange(newSections);
    
    // Reset select value to show placeholder again
    setSelectedValue('');
    
    // Show success toast with section name
    toast.success(`Added "${template.label}" section`);
  }, [sections, onSectionsChange, disabled]);

  const updateSection = useCallback((index: number, field: keyof ContentSection, value: string | number) => {
    if (disabled) return;
    
    const newSections = sections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    );
    onSectionsChange(newSections);
  }, [sections, onSectionsChange, disabled]);

  const removeSection = useCallback((index: number) => {
    if (disabled) return;
    
    const newSections = sections.filter((_, i) => i !== index)
      .map((section, i) => ({ ...section, order_number: i }));
    onSectionsChange(newSections);
  }, [sections, onSectionsChange, disabled]);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    
    try {
      await onSave();
      toast.success('Content sections saved successfully');
    } catch (error) {
      console.error('Error saving content sections:', error);
      toast.error('Failed to save content sections');
    }
  }, [onSave]);

  return (
    <TabErrorBoundary tabName="Content Sections">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Content Sections</h3>
            <p className="text-sm text-muted-foreground">
              Add custom content sections to provide detailed information about the operator
            </p>
          </div>
          
          <div className="flex gap-2">
            {availableSections.length > 0 && (
              <Select value={selectedValue} onValueChange={addSection} disabled={disabled}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add Section" />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((template) => (
                    <SelectItem key={template.key} value={template.key}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {onSave && sections.length > 0 && (
              <Button
                onClick={handleSave}
                disabled={disabled || saveState === 'saving' || operatorId.startsWith('temp-')}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveState === 'saving' ? 'Saving...' : 'Save All'}
              </Button>
            )}
          </div>
        </div>

        {sections.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                No content sections added yet. Use the dropdown above to add your first section.
              </p>
              {availableSections.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  All available section templates have been used.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sections.map((section, index) => {
              const template = SECTION_TEMPLATES.find(t => t.key === section.section_key);
              
              return (
                <Card key={`section-${index}-${section.section_key}`} className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {template?.label || section.section_key}
                            {index === sections.length - 1 && (
                              <Badge variant="secondary" className="text-xs">New</Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(index)}
                        disabled={disabled}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`heading-${index}`}>Section Heading</Label>
                      <Input
                        id={`heading-${index}`}
                        value={section.heading}
                        onChange={(e) => updateSection(index, 'heading', e.target.value)}
                        placeholder="Section heading..."
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`content-${index}`}>Content</Label>
                      <div className="mt-1">
                        <StableRichTextEditor
                          value={section.rich_text_content}
                          onChange={(value) => updateSection(index, 'rich_text_content', value)}
                          placeholder="Enter section content..."
                          disabled={disabled}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {operatorId.startsWith('temp-') && sections.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 Content sections will be saved when you save the operator. 
                They cannot be saved independently until the operator exists in the database.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TabErrorBoundary>
  );
}