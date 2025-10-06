import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive, Loader2, Check, Clock } from 'lucide-react';
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
  
  // Phase 3: Dirty flag tracking instead of JSON.stringify
  const [isDirty, setIsDirty] = useState(false);
  const isInitialMount = useRef(true);
  
  // Phase 4: Save state tracking
  const [saveState, setSaveState] = useState<'idle' | 'waiting' | 'saving' | 'saved'>('idle');
  
  // Update local state when prop changes (from external updates)
  useEffect(() => {
    setLocalFaqs(effectiveFaqs);
    setIsDirty(false);
    setSaveState('idle');
  }, [effectiveFaqs]);
  
  // Debounce the local FAQs with 2 second delay
  const debouncedFaqs = useDebounce(localFaqs, 2000);
  
  // Phase 2: Fixed dependencies - Auto-save when debounced value changes
  useEffect(() => {
    // Skip initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Skip if not dirty
    if (!isDirty) {
      return;
    }
    
    // Set saving state
    setSaveState('saving');
    
    const performSave = async () => {
      try {
        if (isTemporaryOperator) {
          localStorage.saveFaqsToLocal(debouncedFaqs);
        } else {
          await onSave(debouncedFaqs);
        }
        setIsDirty(false);
        setSaveState('saved');
        
        // Reset to idle after showing success
        setTimeout(() => {
          setSaveState('idle');
        }, 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveState('idle');
      }
    };
    
    performSave();
  }, [debouncedFaqs, isDirty, isTemporaryOperator, localStorage, onSave]);
  
  // Show waiting state when there are pending changes
  useEffect(() => {
    if (isDirty && saveState === 'idle') {
      setSaveState('waiting');
    }
  }, [isDirty, saveState]);

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
    setIsDirty(true);
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
    setIsDirty(true);
  };

  const removeFaq = (index: number) => {
    const filtered = localFaqs.filter((_, i) => i !== index);
    setLocalFaqs(filtered);
    setIsDirty(true);
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
    setIsDirty(true);
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
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {isTemporaryOperator ? (
              <HardDrive className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Database className="h-5 w-5 text-muted-foreground" />
            )}
            Frequently Asked Questions
          </div>
          {/* Phase 4: Visual save state indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {saveState === 'waiting' && (
              <>
                <Clock className="h-4 w-4" />
                <span>Waiting...</span>
              </>
            )}
            {saveState === 'saving' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveState === 'saved' && (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Saved</span>
              </>
            )}
          </div>
        </CardTitle>
        {isTemporaryOperator && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              FAQs are stored locally until you save this operator.
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