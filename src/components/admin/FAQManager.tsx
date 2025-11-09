import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  
  // Stabilize effectiveFaqs with useMemo to prevent unnecessary re-renders
  const effectiveFaqs = useMemo(() => {
    return isTemporaryOperator ? localStorage.faqs : faqs;
  }, [isTemporaryOperator, localStorage.faqs, faqs]);
  
  // Local state for immediate UI updates
  const [localFaqs, setLocalFaqs] = useState<OperatorFAQ[]>(effectiveFaqs);
  
  // Phase 3: Dirty flag tracking instead of JSON.stringify
  const [isDirty, setIsDirty] = useState(false);
  const isInitialMount = useRef(true);
  
  // Phase 4: Save state tracking
  const [saveState, setSaveState] = useState<'idle' | 'waiting' | 'saving' | 'saved'>('idle');
  
  // Debounce the local FAQs with 5 second delay
  const debouncedFaqs = useDebounce(localFaqs, 5000);
  const prevDebouncedFaqsRef = useRef(debouncedFaqs);
  
  // Create stable save function using useRef and useCallback
  const performSaveRef = useRef<(data: OperatorFAQ[]) => Promise<void>>();
  
  useEffect(() => {
    performSaveRef.current = async (data: OperatorFAQ[]) => {
      if (isTemporaryOperator) {
        localStorage.saveFaqsToLocal(data);
      } else {
        await onSave(data);
      }
    };
  }, [isTemporaryOperator, localStorage, onSave]);
  
  const stableSave = useCallback(async (data: OperatorFAQ[]) => {
    if (performSaveRef.current) {
      await performSaveRef.current(data);
    }
  }, []);
  
  // Update local state when prop changes (from external updates)
  useEffect(() => {
    // Deep equality check: only sync if props changed from a different source
    const propsMatchLastSave = JSON.stringify(effectiveFaqs) === JSON.stringify(prevDebouncedFaqsRef.current);
    
    // Skip sync if user is actively typing (isDirty)
    // OR if props match what we last saved (prevents overwrite during save)
    if (isDirty || propsMatchLastSave) {
      return;
    }
    
    setLocalFaqs(effectiveFaqs);
    setIsDirty(false);
    setSaveState('idle');
  }, [effectiveFaqs]);
  
  // Auto-save when debounced value changes
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
    
    // Deep equality check - don't save if content hasn't actually changed
    const currentJson = JSON.stringify(debouncedFaqs);
    const previousJson = JSON.stringify(prevDebouncedFaqsRef.current);
    
    if (currentJson === previousJson) {
      console.log('⏭️ Skipping auto-save - no actual changes detected');
      return;
    }
    
    console.log('🔄 Auto-save triggered for FAQs');
    setSaveState('saving');
    
    // Update ref BEFORE save to prevent race condition
    prevDebouncedFaqsRef.current = debouncedFaqs;
    
    const performSave = async () => {
      try {
        await stableSave(debouncedFaqs);
        setIsDirty(false);
        setSaveState('saved');
        console.log('✅ Auto-save completed successfully');
        
        toast.success(operatorId.startsWith('temp-')
          ? 'FAQs auto-saved locally' 
          : 'FAQs auto-saved'
        );
        
        // Reset to idle after showing success
        setTimeout(() => {
          setSaveState('idle');
        }, 2000);
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
        setSaveState('idle');
        prevDebouncedFaqsRef.current = effectiveFaqs;
        toast.error('Auto-save failed. Please try manual save.');
      }
    };
    
    performSave();
  }, [debouncedFaqs, isDirty, stableSave, operatorId]);
  
  // Save on unmount (tab switch)
  useEffect(() => {
    return () => {
      if (isDirty && performSaveRef.current) {
        console.log('💾 Saving FAQs on unmount...');
        performSaveRef.current(localFaqs).catch(error => {
          console.error('Save on unmount failed:', error);
        });
      }
    };
  }, []); // Empty deps - cleanup uses current ref values

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
    setSaveState('waiting'); // Set waiting state immediately
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
    setSaveState('waiting'); // Set waiting state immediately
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

  const handleManualSave = async () => {
    if (disabled) {
      toast.error('Cannot save while publishing is in progress');
      return;
    }
    
    console.log('💾 Manual save triggered for FAQs');
    setSaveState('saving');
    
    try {
      await stableSave(localFaqs);
      prevDebouncedFaqsRef.current = localFaqs;
      setIsDirty(false);
      setSaveState('saved');
      
      toast.success(isTemporaryOperator 
        ? 'FAQs saved locally' 
        : 'FAQs saved to database'
      );
      
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error('❌ Manual save failed:', error);
      setSaveState('idle');
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
          <div className="flex items-center gap-2">
            {saveState === 'waiting' && (
              <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded">
                <Clock className="h-4 w-4" />
                <span>Waiting to save...</span>
              </div>
            )}
            {saveState === 'saving' && (
              <div className="flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            {saveState === 'saved' && (
              <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded">
                <Check className="h-4 w-4" />
                <span>Saved!</span>
              </div>
            )}
            {isDirty && saveState === 'idle' && (
              <div className="flex items-center gap-1.5 text-sm text-orange-600 bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded">
                <AlertCircle className="h-4 w-4" />
                <span>Unsaved changes</span>
              </div>
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

        <div className="flex gap-2 items-center">
          <Button type="button" onClick={addFaq} variant="outline" disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
          <Button 
            type="button" 
            onClick={handleManualSave} 
            className="flex-1" 
            disabled={disabled || saveState === 'saving'}
            variant={isDirty ? "default" : "outline"}
          >
            {saveState === 'saving' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {isDirty ? 'Save Changes' : 'All Changes Saved'}
              </>
            )}
          </Button>
          {isDirty && saveState === 'waiting' && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Auto-saves in 5s
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}