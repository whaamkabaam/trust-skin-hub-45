import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StableRichTextEditor } from './StableRichTextEditor';
import { Plus, Trash2, Save, ChevronDown, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { TabErrorBoundary } from './TabErrorBoundary';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ContentSection {
  id?: string;
  section_key: string;
  heading: string;
  rich_text_content: string;
  order_number: number;
}

interface MasterContentEditorProps {
  operatorId: string;
  sections: ContentSection[];
  onSectionsChange: (sections: ContentSection[]) => void;
  disabled?: boolean;
  onSave?: () => Promise<void>;
  saveState?: 'idle' | 'saving' | 'saved' | 'error';
}

// Fixed sections that map to frontend review sections
const FIXED_SECTIONS = [
  { key: 'overview', label: 'Overview', defaultHeading: 'Overview', description: 'Main introduction and overview of the operator' },
  { key: 'company_background', label: 'Company Background', defaultHeading: 'Company Background', description: 'History and background information' },
  { key: 'bonuses_summary', label: 'Bonuses Overview', defaultHeading: 'Bonuses & Promotions', description: 'General bonus information and overview' },
  { key: 'security_overview', label: 'Security Overview', defaultHeading: 'Security & Safety', description: 'General security and safety information' },
  { key: 'licensing', label: 'Licensing & Regulation', defaultHeading: 'Licensing & Regulation', description: 'Licensing information and regulatory details' },
  { key: 'provably_fair', label: 'Provably Fair System', defaultHeading: 'Provably Fair Gaming', description: 'How the provably fair system works' },
  { key: 'data_protection', label: 'Data Protection', defaultHeading: 'Data Protection & Privacy', description: 'GDPR compliance and data handling practices' },
  { key: 'responsible_gaming', label: 'Responsible Gaming', defaultHeading: 'Responsible Gaming', description: 'Responsible gaming measures and self-exclusion options' },
  { key: 'complaints', label: 'Complaints Platform', defaultHeading: 'Complaints & Dispute Resolution', description: 'How to file complaints and resolve disputes' },
  { key: 'audit', label: 'Audit Information', defaultHeading: 'Audits & Certifications', description: 'Third-party audits and security assessments' },
  { key: 'final_verdict', label: 'Final Verdict', defaultHeading: 'Our Final Verdict', description: 'Comprehensive conclusion and final thoughts' },
];

export function MasterContentEditor({ 
  operatorId,
  sections,
  onSectionsChange,
  disabled = false,
  onSave,
  saveState = 'idle'
}: MasterContentEditorProps) {
  const [selectedValue, setSelectedValue] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  // Separate fixed and custom sections
  const { fixedSections, customSections } = useMemo(() => {
    const fixed: ContentSection[] = [];
    const custom: ContentSection[] = [];
    
    sections.forEach(section => {
      if (FIXED_SECTIONS.some(fs => fs.key === section.section_key)) {
        fixed.push(section);
      } else {
        custom.push(section);
      }
    });
    
    return { fixedSections: fixed, customSections: custom };
  }, [sections]);

  // Available fixed sections that haven't been added yet
  const availableFixedSections = useMemo(() => {
    const usedKeys = new Set(fixedSections.map(s => s.section_key));
    return FIXED_SECTIONS.filter(template => !usedKeys.has(template.key));
  }, [fixedSections]);

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const addFixedSection = useCallback((sectionKey: string) => {
    if (disabled) return;
    
    const template = FIXED_SECTIONS.find(t => t.key === sectionKey);
    if (!template) return;

    const newSection: ContentSection = {
      section_key: template.key,
      heading: template.defaultHeading,
      rich_text_content: '',
      order_number: sections.length,
    };

    const newSections = [...sections, newSection];
    onSectionsChange(newSections);
    
    // Auto-open the new section
    setOpenSections(prev => new Set([...prev, template.key]));
    setSelectedValue('');
    
    toast.success(`Added "${template.label}" section`);
  }, [sections, onSectionsChange, disabled]);

  const addCustomSection = useCallback(() => {
    if (disabled) return;
    
    const customKey = `custom_${Date.now()}`;
    const newSection: ContentSection = {
      section_key: customKey,
      heading: 'Custom Section',
      rich_text_content: '',
      order_number: sections.length,
    };

    const newSections = [...sections, newSection];
    onSectionsChange(newSections);
    
    // Auto-open the new section
    setOpenSections(prev => new Set([...prev, customKey]));
    
    toast.success('Added custom section');
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
      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  }, [onSave]);

  const getSectionTemplate = (sectionKey: string) => {
    return FIXED_SECTIONS.find(t => t.key === sectionKey);
  };

  const renderSectionCard = (section: ContentSection, index: number, isCustom: boolean) => {
    const template = getSectionTemplate(section.section_key);
    const isOpen = openSections.has(section.section_key);
    const isEmpty = !section.rich_text_content || section.rich_text_content === '<p><br></p>';
    
    return (
      <Card 
        key={`section-${index}-${section.section_key}`} 
        className={`border-primary/20 transition-all ${isEmpty ? 'bg-muted/30' : 'bg-gradient-to-br from-primary/5 to-transparent'}`}
      >
        <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.section_key)}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left hover:opacity-70 transition-opacity">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {isCustom ? section.heading : (template?.label || section.section_key)}
                    </CardTitle>
                    {isEmpty && (
                      <Badge variant="outline" className="text-xs">Empty</Badge>
                    )}
                    {!isEmpty && (
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Content Added
                      </Badge>
                    )}
                  </div>
                  {template && (
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  )}
                </div>
              </CollapsibleTrigger>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(index)}
                disabled={disabled}
                className="text-destructive hover:text-destructive ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {isCustom && (
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
              )}
              
              <div>
                <Label htmlFor={`content-${index}`}>
                  {isCustom ? 'Content' : `${template?.label} Content`}
                </Label>
                <div className="mt-1">
                  <StableRichTextEditor
                    value={section.rich_text_content}
                    onChange={(value) => updateSection(index, 'rich_text_content', value)}
                    placeholder="Enter content..."
                    disabled={disabled}
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <TabErrorBoundary tabName="Review Content">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Master Review Content Editor</h3>
            <p className="text-sm text-muted-foreground">
              Manage all textual content for the operator review in one place
            </p>
          </div>
          
          <div className="flex gap-2">
            {availableFixedSections.length > 0 && (
              <Select value={selectedValue} onValueChange={addFixedSection} disabled={disabled}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add Section" />
                </SelectTrigger>
                <SelectContent>
                  {availableFixedSections.map((template) => (
                    <SelectItem key={template.key} value={template.key}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomSection}
              disabled={disabled}
            >
              <Plus className="h-4 w-4 mr-2" />
              Custom Section
            </Button>
            
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
                No content sections added yet. Add sections to build your operator review content.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Fixed Sections */}
            {fixedSections.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Review Sections
                  </h4>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-3">
                  {fixedSections.map((section, idx) => {
                    const globalIndex = sections.findIndex(s => s.section_key === section.section_key);
                    return renderSectionCard(section, globalIndex, false);
                  })}
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {customSections.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Custom Sections
                  </h4>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-3">
                  {customSections.map((section, idx) => {
                    const globalIndex = sections.findIndex(s => s.section_key === section.section_key);
                    return renderSectionCard(section, globalIndex, true);
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {operatorId.startsWith('temp-') && sections.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardContent className="p-4 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Content sections will be saved when you save the operator. 
                They cannot be saved independently until the operator exists in the database.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TabErrorBoundary>
  );
}
