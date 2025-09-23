import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Plus, X, ArrowRight, CheckSquare, Zap, Filter } from 'lucide-react';
import { getBulkAssignmentSuggestions } from '@/lib/auto-assignment-rules';

interface EnhancedUnmatchedContentManagerProps {
  content: string[];
  onAssign: (content: string, field: string) => void;
  onBulkAssign?: (assignments: Array<{ content: string; field: string }>) => void;
}

interface Assignment {
  content: string;
  field: string;
  subField?: string;
}

// Enhanced field options with categories
const FIELD_CATEGORIES = {
  'Operator Info': [
    { value: 'operator.name', label: 'Operator Name' },
    { value: 'operator.rating', label: 'Overall Rating' },
    { value: 'operator.verdict', label: 'Editorial Verdict' },
    { value: 'operator.establishment_year', label: 'Establishment Year' },
    { value: 'operator.company_background', label: 'Company Background' },
    { value: 'operator.welcome_bonus', label: 'Welcome Bonus' },
    { value: 'operator.pros', label: 'Pros (add to list)' },
    { value: 'operator.cons', label: 'Cons (add to list)' }
  ],
  'Review Data': [
    { value: 'review.title', label: 'Review Title' },
    { value: 'review.content', label: 'Review Content' },
    { value: 'review.username', label: 'Reviewer Username' },
    { value: 'review.author', label: 'Review Author' },
    { value: 'review.rating', label: 'User Rating' },
    { value: 'review.pros', label: 'User Pros' },
    { value: 'review.cons', label: 'User Cons' }
  ],
  'Platform Features': [
    { value: 'operator.payment_methods', label: 'Payment Methods' },
    { value: 'operator.trust_indicators', label: 'Trust & Security' },
    { value: 'operator.features', label: 'Platform Features' },
    { value: 'extensions.bonus', label: 'Bonus Information' },
    { value: 'extensions.payment', label: 'Payment Details' },
    { value: 'extensions.security', label: 'Security Features' },
    { value: 'extensions.faq', label: 'FAQ Content' }
  ],
  'Metadata': [
    { value: 'metadata.publication_date', label: 'Publication Date' },
    { value: 'metadata.author', label: 'Article Author' },
    { value: 'metadata.last_updated', label: 'Last Updated' }
  ],
  'Other': [
    { value: 'ignore', label: 'Ignore this content' },
    { value: 'custom', label: 'Custom field...' }
  ]
};

export function EnhancedUnmatchedContentManager({ 
  content, 
  onAssign, 
  onBulkAssign 
}: EnhancedUnmatchedContentManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkField, setBulkField] = useState<string>('');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState(() => getBulkAssignmentSuggestions(content));

  const handleAssignment = (contentItem: string, field: string, customField?: string) => {
    const finalField = field === 'custom' && customField ? customField : field;
    
    if (field === 'ignore') {
      // Just remove from unmatched, don't assign anywhere
      return;
    }

    const newAssignment: Assignment = {
      content: contentItem,
      field: finalField
    };

    setAssignments(prev => [...prev, newAssignment]);
    onAssign(contentItem, finalField);
  };

  const handleBulkAssignment = () => {
    if (!bulkField || selectedItems.size === 0) return;
    
    const bulkAssignments = Array.from(selectedItems).map(content => ({
      content,
      field: bulkField
    }));

    if (onBulkAssign) {
      onBulkAssign(bulkAssignments);
    } else {
      // Fallback to individual assignments
      bulkAssignments.forEach(assignment => {
        handleAssignment(assignment.content, assignment.field);
      });
    }

    // Clear selections
    setSelectedItems(new Set());
    setBulkField('');
  };

  const applySuggestion = (field: string, suggestedContent: string[]) => {
    const assignments = suggestedContent.map(content => ({ content, field }));
    
    if (onBulkAssign) {
      onBulkAssign(assignments);
    } else {
      assignments.forEach(assignment => {
        handleAssignment(assignment.content, assignment.field);
      });
    }
  };

  const toggleItemSelection = (item: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(item)) {
      newSelection.delete(item);
    } else {
      newSelection.add(item);
    }
    setSelectedItems(newSelection);
  };

  const removeAssignment = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Excellent! All content has been automatically categorized!</p>
            <p className="text-sm">The enhanced AI system successfully processed everything.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Smart Suggestions */}
      {Object.keys(suggestions).length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Smart Suggestions
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                {showSuggestions ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
            <CardDescription>
              AI detected these patterns and suggests auto-assignment
            </CardDescription>
          </CardHeader>
          {showSuggestions && (
            <CardContent>
              <div className="space-y-2">
                {Object.entries(suggestions).map(([field, items]) => (
                  <div key={field} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <Badge variant="outline" className="mr-2">{field}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {items.length} item{items.length > 1 ? 's' : ''} detected
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applySuggestion(field, items)}
                    >
                      Apply All
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Bulk Operations */}
      {selectedItems.size > 0 && (
        <Card className="border-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-secondary" />
              Bulk Assignment ({selectedItems.size} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Select value={bulkField} onValueChange={setBulkField}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select field for all selected items..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FIELD_CATEGORIES).map(([category, fields]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                        {category}
                      </div>
                      {fields.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                size="sm" 
                onClick={handleBulkAssignment}
                disabled={!bulkField}
              >
                <Plus className="h-3 w-3 mr-1" />
                Assign All
              </Button>

              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedItems(new Set())}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unmatched Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4 text-warning" />
            Remaining Unmatched ({content.length} items)
          </CardTitle>
          <CardDescription>
            Content that needs manual review - likely ambiguous or context-specific
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {content.map((item, index) => (
                <UnmatchedContentItem
                  key={index}
                  content={item}
                  isSelected={selectedItems.has(item)}
                  onToggleSelect={() => toggleItemSelection(item)}
                  onAssign={(field, customField) => handleAssignment(item, field, customField)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Manual Assignments Summary */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Manual Assignments ({assignments.length})</CardTitle>
            <CardDescription>
              Content that has been manually categorized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <div className="flex-1 text-sm">
                      <span className="text-muted-foreground">"{assignment.content.substring(0, 50)}..."</span>
                      <ArrowRight className="h-3 w-3 mx-2 inline" />
                      <Badge variant="outline">{assignment.field}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAssignment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface UnmatchedContentItemProps {
  content: string;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAssign: (field: string, customField?: string) => void;
}

function UnmatchedContentItem({ 
  content, 
  isSelected, 
  onToggleSelect, 
  onAssign 
}: UnmatchedContentItemProps) {
  const [selectedField, setSelectedField] = useState<string>('');
  const [customField, setCustomField] = useState<string>('');
  const [showCustom, setShowCustom] = useState(false);

  const handleFieldChange = (value: string) => {
    setSelectedField(value);
    setShowCustom(value === 'custom');
  };

  const handleAssign = () => {
    if (!selectedField) return;
    
    if (selectedField === 'custom' && !customField.trim()) {
      return;
    }

    onAssign(selectedField, customField);
    setSelectedField('');
    setCustomField('');
    setShowCustom(false);
  };

  return (
    <div className={`border rounded-lg p-3 space-y-3 transition-colors ${
      isSelected ? 'border-primary bg-primary/5' : 'border-border'
    }`}>
      <div className="flex items-start gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          className="mt-1"
        />
        <div className="flex-1 text-sm">
          <span className="font-medium">Content:</span>
          <p className="mt-1 text-muted-foreground leading-relaxed">"{content}"</p>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Select value={selectedField} onValueChange={handleFieldChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Assign to field..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FIELD_CATEGORIES).map(([category, fields]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                    {category}
                  </div>
                  {fields.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            size="sm" 
            onClick={handleAssign}
            disabled={!selectedField || (selectedField === 'custom' && !customField.trim())}
          >
            <Plus className="h-3 w-3 mr-1" />
            Assign
          </Button>
        </div>

        {showCustom && (
          <Input
            placeholder="Enter custom field name..."
            value={customField}
            onChange={(e) => setCustomField(e.target.value)}
            className="text-sm"
          />
        )}
      </div>
    </div>
  );
}