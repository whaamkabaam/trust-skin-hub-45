import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StableRichTextEditor } from './StableRichTextEditor';
import { Plus, Trash2, Save, ChevronDown, ChevronRight, FileText, AlertCircle, GripVertical } from 'lucide-react';
import { toast } from '@/lib/toast';
import { TabErrorBoundary } from './TabErrorBoundary';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Primary intro sections (shown at top of review page)
const PRIMARY_INTRO_SECTIONS = [
  { key: 'overview', label: 'Overview', defaultHeading: 'Overview', description: 'Main introduction - appears in "What is [Site]?" section', frontendSection: '"What is [Site]?"' },
  { key: 'company_background', label: 'Company Background', defaultHeading: 'Company Background', description: 'History and background - appears in "What is [Site]?" section', frontendSection: '"What is [Site]?"' },
];

// Page sections (shown at specific positions throughout review page)
const PAGE_SECTIONS = [
  { key: 'bonuses_summary', label: 'Bonuses Overview', defaultHeading: 'Bonuses & Promotions', description: 'Bonus information - appears in "Bonuses & Promos" section', frontendSection: '"Bonuses & Promos"' },
  { key: 'security_overview', label: 'Security Overview', defaultHeading: 'Security & Safety', description: 'Security information - appears in "Fairness & Security" section', frontendSection: '"Fairness & Security"' },
  { key: 'licensing', label: 'Licensing & Regulation', defaultHeading: 'Licensing & Regulation', description: 'Licensing details - appears in "Fairness & Security" section', frontendSection: '"Fairness & Security"' },
  { key: 'provably_fair', label: 'Provably Fair System', defaultHeading: 'Provably Fair Gaming', description: 'Provably fair system - appears in "Fairness & Security" section', frontendSection: '"Fairness & Security"' },
  { key: 'data_protection', label: 'Data Protection', defaultHeading: 'Data Protection & Privacy', description: 'Data handling - appears in "Fairness & Security" section', frontendSection: '"Fairness & Security"' },
  { key: 'responsible_gaming', label: 'Responsible Gaming', defaultHeading: 'Responsible Gaming', description: 'Responsible gaming - appears in "Fairness & Security" section', frontendSection: '"Fairness & Security"' },
  { key: 'complaints', label: 'Complaints Platform', defaultHeading: 'Complaints & Dispute Resolution', description: 'Dispute resolution - appears in "Fairness & Security" section', frontendSection: '"Fairness & Security"' },
  { key: 'audit', label: 'Audit Information', defaultHeading: 'Audits & Certifications', description: 'Audits and certifications - appears in "Fairness & Security" section', frontendSection: '"Fairness & Security"' },
  { key: 'final_verdict', label: 'Final Verdict', defaultHeading: 'Our Final Verdict', description: 'Final thoughts - appears in "Verdict" section at end of page', frontendSection: '"Verdict"' },
];

// All fixed sections combined
const FIXED_SECTIONS = [...PRIMARY_INTRO_SECTIONS, ...PAGE_SECTIONS];

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

  // Separate sections into intro, custom, and page sections
  const { primaryIntroSections, customSections, pageSections } = useMemo(() => {
    const intro: ContentSection[] = [];
    const custom: ContentSection[] = [];
    const page: ContentSection[] = [];
    
    sections.forEach(section => {
      if (PRIMARY_INTRO_SECTIONS.some(fs => fs.key === section.section_key)) {
        intro.push(section);
      } else if (PAGE_SECTIONS.some(fs => fs.key === section.section_key)) {
        page.push(section);
      } else {
        custom.push(section);
      }
    });
    
    return { 
      primaryIntroSections: intro, 
      customSections: custom, 
      pageSections: page 
    };
  }, [sections]);

  // Available fixed sections that haven't been added yet
  const availableFixedSections = useMemo(() => {
    const usedKeys = new Set([...primaryIntroSections, ...pageSections].map(s => s.section_key));
    return FIXED_SECTIONS.filter(template => !usedKeys.has(template.key));
  }, [primaryIntroSections, pageSections]);

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

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = customSections.findIndex(s => s.section_key === active.id);
      const newIndex = customSections.findIndex(s => s.section_key === over.id);
      
      // Reorder custom sections
      const reorderedCustomSections = arrayMove(customSections, oldIndex, newIndex);
      
      // Rebuild full sections array with updated order_numbers
      const newSections = [
        ...primaryIntroSections,
        ...reorderedCustomSections.map((s, i) => ({ 
          ...s, 
          order_number: primaryIntroSections.length + i 
        })),
        ...pageSections.map((s, i) => ({
          ...s,
          order_number: primaryIntroSections.length + reorderedCustomSections.length + i
        }))
      ];
      
      onSectionsChange(newSections);
    }
  };

  // Sortable wrapper for custom sections
  function SortableSectionCard({ 
    section, 
    globalIndex, 
    renderCard 
  }: { 
    section: ContentSection; 
    globalIndex: number;
    renderCard: () => React.ReactNode;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: section.section_key
    });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };
    
    return (
      <div ref={setNodeRef} style={style}>
        <div className="flex items-start gap-2">
          <button
            className="mt-4 p-2 cursor-grab hover:bg-accent rounded active:cursor-grabbing flex-shrink-0"
            {...attributes}
            {...listeners}
            type="button"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex-1">
            {renderCard()}
          </div>
        </div>
      </div>
    );
  }

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
          <div className="space-y-8">
            {/* Primary Intro Sections */}
            {primaryIntroSections.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    📌 Primary Intro
                  </h4>
                  <Badge variant="secondary" className="text-xs">Appears at top of page</Badge>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-3 border-l-2 border-primary/30 pl-4">
                  {primaryIntroSections.map((section) => {
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
                  <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    ✨ Custom Sections
                  </h4>
                  <Badge variant="secondary" className="text-xs">Appears after intro</Badge>
                  {customSections.length > 1 && (
                    <Badge variant="outline" className="text-xs">Drag to reorder</Badge>
                  )}
                  <div className="h-px flex-1 bg-border" />
                </div>
                <p className="text-xs text-muted-foreground px-1">
                  💡 These sections appear right after the intro on the review page
                </p>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={customSections.map(s => s.section_key)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 border-l-2 border-amber-500/30 pl-4">
                      {customSections.map((section) => {
                        const globalIndex = sections.findIndex(s => s.section_key === section.section_key);
                        return (
                          <SortableSectionCard
                            key={section.section_key}
                            section={section}
                            globalIndex={globalIndex}
                            renderCard={() => renderSectionCard(section, globalIndex, true)}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* Page Sections */}
            {pageSections.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    📋 Page Sections
                  </h4>
                  <Badge variant="outline" className="text-xs">Fixed positions</Badge>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <p className="text-xs text-muted-foreground px-1">
                  💡 These are displayed at their designated sections throughout the review page
                </p>
                <div className="space-y-3 border-l-2 border-border pl-4">
                  {pageSections.map((section) => {
                    const globalIndex = sections.findIndex(s => s.section_key === section.section_key);
                    return renderSectionCard(section, globalIndex, false);
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

        {/* Bottom Save Button */}
        {onSave && sections.length > 0 && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={disabled || saveState === 'saving' || operatorId.startsWith('temp-')}
              className="min-w-[120px]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveState === 'saving' ? 'Saving...' : 'Save All Content'}
            </Button>
          </div>
        )}
      </div>
    </TabErrorBoundary>
  );
}
