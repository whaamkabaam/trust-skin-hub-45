import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Plus, X, ArrowRight } from 'lucide-react';

interface UnmatchedContentManagerProps {
  content: string[];
  onAssign: (content: string, field: string) => void;
}

interface Assignment {
  content: string;
  field: string;
  subField?: string;
}

// Common field options for assignment
const FIELD_OPTIONS = [
  { value: 'operator.name', label: 'Operator Name' },
  { value: 'operator.verdict', label: 'Verdict' },
  { value: 'operator.bonus_terms', label: 'Bonus Terms' },
  { value: 'operator.company_background', label: 'Company Background' },
  { value: 'operator.pros', label: 'Pros (add to list)' },
  { value: 'operator.cons', label: 'Cons (add to list)' },
  { value: 'review.title', label: 'Review Title' },
  { value: 'review.content', label: 'Review Content' },
  { value: 'review.username', label: 'Reviewer Username' },
  { value: 'extensions.bonus', label: 'Bonus Information' },
  { value: 'extensions.payment', label: 'Payment Method' },
  { value: 'extensions.feature', label: 'Feature' },
  { value: 'extensions.faq', label: 'FAQ' },
  { value: 'ignore', label: 'Ignore this content' },
  { value: 'custom', label: 'Custom field...' }
];

export function UnmatchedContentManager({ content, onAssign }: UnmatchedContentManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

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

  const removeAssignment = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>All content has been successfully matched!</p>
            <p className="text-sm">No manual assignment needed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            Unmatched Content ({content.length} items)
          </CardTitle>
          <CardDescription>
            The AI couldn't categorize these text segments. Assign them manually or ignore them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4 pr-4">
              {content.map((item, index) => (
                <UnmatchedContentItem
                  key={index}
                  content={item}
                  onAssign={(field, customField) => handleAssignment(item, field, customField)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Assignments ({assignments.length})</CardTitle>
            <CardDescription>
              Content that has been manually assigned to fields
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
  onAssign: (field: string, customField?: string) => void;
}

function UnmatchedContentItem({ content, onAssign }: UnmatchedContentItemProps) {
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
    <div className="border rounded-lg p-3 space-y-3">
      <div className="text-sm">
        <span className="font-medium">Content:</span>
        <p className="mt-1 text-muted-foreground leading-relaxed">"{content}"</p>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Select value={selectedField} onValueChange={handleFieldChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Assign to field..." />
            </SelectTrigger>
            <SelectContent>
              {FIELD_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
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