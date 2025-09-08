import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { OperatorBonus } from '@/hooks/useOperatorExtensions';
import { toast } from 'sonner';

interface BonusManagerProps {
  bonuses: OperatorBonus[];
  onSave: (bonuses: OperatorBonus[]) => void;
  operatorId: string;
  disabled?: boolean;
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

export function BonusManager({ bonuses, onSave, operatorId, disabled = false }: BonusManagerProps) {
  const [localBonuses, setLocalBonuses] = useState<OperatorBonus[]>(bonuses);

  const addBonus = () => {
    const newBonus: OperatorBonus = {
      operator_id: operatorId,
      bonus_type: 'welcome',
      title: '',
      description: '',
      value: '',
      terms: '',
      is_active: true,
      order_number: localBonuses.length,
    };
    setLocalBonuses([...localBonuses, newBonus]);
  };

  const updateBonus = (index: number, updates: Partial<OperatorBonus>) => {
    const updated = localBonuses.map((bonus, i) => 
      i === index ? { ...bonus, ...updates } : bonus
    );
    setLocalBonuses(updated);
  };

  const removeBonus = (index: number) => {
    setLocalBonuses(localBonuses.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (disabled) {
      toast.error('Cannot save while publishing is in progress');
      return;
    }
    
    if (typeof onSave === 'function') {
      onSave(localBonuses);
    } else {
      toast.error('Save function not available');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bonuses & Promotions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {localBonuses.map((bonus, index) => (
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
          <Button onClick={addBonus} variant="outline" disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bonus
          </Button>
          <Button onClick={handleSave} disabled={disabled}>
            Save Bonuses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}