import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive } from 'lucide-react';
import { OperatorFAQ } from '@/hooks/useOperatorExtensions';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  
  // Always use props data - useOperatorExtensions manages ALL localStorage logic
  const effectiveFaqs = faqs;

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
      order_number: effectiveFaqs.length,
      is_featured: false,
    };
    
    const newFaqs = [...effectiveFaqs, newFaq];
    onSave(newFaqs);
  };

  const updateFaq = (index: number, updates: Partial<OperatorFAQ>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const updated = effectiveFaqs.map((faq, i) => 
      i === index ? { ...faq, ...updates } : faq
    );
    
    onSave(updated);
  };

  const removeFaq = (index: number) => {
    const filtered = effectiveFaqs.filter((_, i) => i !== index);
    onSave(filtered);
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === effectiveFaqs.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...effectiveFaqs];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Update order numbers
    updated.forEach((faq, i) => {
      faq.order_number = i;
    });
    
    onSave(updated);
  };

  const handleSave = () => {
    if (disabled) {
      toast.error('Cannot save while publishing is in progress');
      return;
    }
    
    try {
      toast.success('FAQs saved successfully');
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
        {effectiveFaqs.map((faq, index) => (
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
                      disabled={index === effectiveFaqs.length - 1}
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
            Save FAQs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}