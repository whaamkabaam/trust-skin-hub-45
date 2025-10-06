import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive } from 'lucide-react';
import { OperatorFAQ } from '@/hooks/useOperatorExtensions';
import { toast } from '@/lib/toast';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';

interface FAQManagerProps {
  faqs: OperatorFAQ[];
  onSave: (faqs: OperatorFAQ[]) => void;
  operatorId: string;
  disabled?: boolean;
  onInteractionStart?: () => void;
}

const faqCategories = [
  { value: 'general', label: 'General' },
  { value: 'payments', label: 'Payments' },
  { value: 'bonuses', label: 'Bonuses' },
  { value: 'security', label: 'Security' },
  { value: 'support', label: 'Support' },
];

export function FAQManager({ faqs, onSave, operatorId, disabled = false, onInteractionStart }: FAQManagerProps) {
  // Check if this is a temporary operator (new operator)
  const isTemporaryOperator = operatorId.startsWith('temp-');
  
  // Use localStorage for temporary operators only - useOperatorExtensions handles all logic
  const localStorage = useLocalStorageExtensions(operatorId);
  
  // Always use props data (useOperatorExtensions manages localStorage internally)
  const effectiveFaqs = isTemporaryOperator ? localStorage.faqs : faqs;
  
  // Local state for immediate UI updates
  const [localFaqs, setLocalFaqs] = useState<OperatorFAQ[]>(effectiveFaqs);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalFaqs(effectiveFaqs);
  }, [effectiveFaqs]);
  
  // Debounce the local FAQs with 2 second delay
  const debouncedFaqs = useDebounce(localFaqs, 2000);
  
  // Auto-save when debounced value changes
  useEffect(() => {
    // Skip initial render
    if (JSON.stringify(debouncedFaqs) === JSON.stringify(effectiveFaqs)) {
      return;
    }
    
    if (isTemporaryOperator) {
      localStorage.saveFaqsToLocal(debouncedFaqs);
    } else {
      onSave(debouncedFaqs);
    }
  }, [debouncedFaqs]);

  const addFaq = () => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const newFaq: OperatorFAQ = {
      operator_id: operatorId,
      question: '',
      answer: '',
      category: 'general',
      order_number: localFaqs.length,
      is_featured: false,
    };
    
    const newFaqs = [...localFaqs, newFaq];
    setLocalFaqs(newFaqs);
  };

  const updateFaq = (index: number, updates: Partial<OperatorFAQ>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    // Update local state immediately for responsive UI
    const updated = localFaqs.map((faq, i) => 
      i === index ? { ...faq, ...updates } : faq
    );
    setLocalFaqs(updated);
  };

  const removeFaq = (index: number) => {
    const filtered = localFaqs.filter((_, i) => i !== index);
    setLocalFaqs(filtered);
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === localFaqs.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...localFaqs];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Update order numbers
    updated.forEach((faq, i) => {
      faq.order_number = i;
    });
    
    setLocalFaqs(updated);
  };

  const handleSave = () => {
    if (disabled) {
      toast.error('Cannot save while publishing is in progress');
      return;
    }
    
    try {
      if (isTemporaryOperator) {
        // Data is already saved to localStorage automatically
        toast.success('FAQs saved locally - will be saved to database when operator is created');
      } else {
        // No manual save needed - data is automatically saved via onSave calls
        toast.success('FAQs are automatically saved to database');
      }
    } catch (error) {
      console.error('Error saving FAQs:', error);
      toast.error('Failed to save FAQs');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Frequently Asked Questions
            {isTemporaryOperator ? (
              <HardDrive className="h-4 w-4 text-orange-500" />
            ) : (
              <Database className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
        </div>
        {isTemporaryOperator && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Data is being stored locally. Save the operator first to enable database storage.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {localFaqs.map((faq, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select
                  value={faq.category || 'general'}
                  onValueChange={(value) => updateFaq(index, { category: value })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {faqCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={faq.is_featured}
                    onCheckedChange={(checked) => updateFaq(index, { is_featured: checked })}
                  />
                  <Label>Featured</Label>
                  
                  <div className="flex gap-1">
                    <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={() => moveFaq(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveFaq(index, 'down')}
                      disabled={index === localFaqs.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFaq(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Question</Label>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(index, { question: e.target.value })}
                  placeholder="What is your question?"
                />
              </div>

              <div>
                <Label>Answer</Label>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, { answer: e.target.value })}
                  placeholder="Provide a detailed answer..."
                  rows={4}
                />
              </div>
            </div>
          </Card>
        ))}

        <div className="flex gap-2">
          <Button type="button" onClick={addFaq} variant="outline" disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
          <Button type="button" onClick={handleSave} disabled={disabled}>
            {isTemporaryOperator ? 'Save Locally' : 'Save FAQs'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}