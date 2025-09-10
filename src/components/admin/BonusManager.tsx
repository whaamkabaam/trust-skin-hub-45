import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive } from 'lucide-react';
import { OperatorBonus } from '@/hooks/useOperatorExtensions';
import { toast } from 'sonner';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BonusManagerProps {
  bonuses: OperatorBonus[];
  onSave: (bonuses: OperatorBonus[]) => void;
  operatorId: string;
  disabled?: boolean;
  onInteractionStart?: () => void;
}

const bonusTypes = [
  { value: 'welcome', label: 'Welcome Bonus' },
  { value: 'daily', label: 'Daily Bonus' },
  { value: 'cashback', label: 'Cashback/Rakeback' },
  { value: 'vip', label: 'VIP Program' },
  { value: 'referral', label: 'Referral Program' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'freeplay', label: 'Free Play' },
];

export function BonusManager({ bonuses, onSave, operatorId, disabled = false, onInteractionStart }: BonusManagerProps) {
  // Check if this is a temporary operator (new operator)
  const isTemporaryOperator = operatorId.startsWith('temp-');
  
  // Use localStorage for temporary operators only
  const localStorage = useLocalStorageExtensions(operatorId);
  
  // For temp operators, use localStorage. For existing operators, use props directly
  const effectiveBonuses = isTemporaryOperator ? localStorage.bonuses : bonuses;
  const effectiveSave = isTemporaryOperator ? localStorage.saveBonusesToLocal : onSave;

  const addBonus = () => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const newBonus: OperatorBonus = {
      operator_id: operatorId,
      bonus_type: 'welcome',
      title: '',
      description: '',
      value: '',
      terms: '',
      is_active: true,
      order_number: effectiveBonuses.length,
    };
    const newBonuses = [...effectiveBonuses, newBonus];
    if (isTemporaryOperator) {
      localStorage.saveBonusesToLocal(newBonuses);
    } else {
      onSave(newBonuses);
    }
  };

  const updateBonus = (index: number, updates: Partial<OperatorBonus>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const updated = effectiveBonuses.map((bonus, i) => 
      i === index ? { ...bonus, ...updates } : bonus
    );
    
    if (isTemporaryOperator) {
      localStorage.saveBonusesToLocal(updated);
    } else {
      onSave(updated);
    }
  };

  const removeBonus = (index: number) => {
    const filtered = effectiveBonuses.filter((_, i) => i !== index);
    
    if (isTemporaryOperator) {
      localStorage.saveBonusesToLocal(filtered);
    } else {
      onSave(filtered);
    }
  };

  const handleSave = () => {
    if (disabled) {
      toast.error('Cannot save while publishing is in progress');
      return;
    }
    
    try {
      if (isTemporaryOperator) {
        // Data is already saved to localStorage automatically
        toast.success('Bonuses saved locally - will be saved to database when operator is created');
      } else {
        // No manual save needed - data is automatically saved via onSave calls
        toast.success('Bonuses are automatically saved to database');
      }
    } catch (error) {
      console.error('Error saving bonuses:', error);
      toast.error('Failed to save bonuses');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Bonuses & Promotions
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
        {effectiveBonuses.map((bonus, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select
                  value={bonus.bonus_type}
                  onValueChange={(value) => updateBonus(index, { bonus_type: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bonusTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={bonus.is_active}
                    onCheckedChange={(checked) => updateBonus(index, { is_active: checked })}
                  />
                  <Label>Active</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeBonus(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={bonus.title}
                    onChange={(e) => updateBonus(index, { title: e.target.value })}
                    placeholder="e.g., Welcome Bonus"
                  />
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    value={bonus.value || ''}
                    onChange={(e) => updateBonus(index, { value: e.target.value })}
                    placeholder="e.g., 5%, $10, 100 coins"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={bonus.description || ''}
                  onChange={(e) => updateBonus(index, { description: e.target.value })}
                  placeholder="Describe the bonus..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={bonus.terms || ''}
                  onChange={(e) => updateBonus(index, { terms: e.target.value })}
                  placeholder="Terms and conditions..."
                  rows={3}
                />
              </div>
            </div>
          </Card>
        ))}

        <div className="flex gap-2">
          <Button type="button" onClick={addBonus} variant="outline" disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bonus
          </Button>
          <Button type="button" onClick={handleSave} disabled={disabled}>
            {isTemporaryOperator ? 'Save Locally' : 'Save Bonuses'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}