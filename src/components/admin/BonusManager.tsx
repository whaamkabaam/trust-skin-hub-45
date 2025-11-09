import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive, Loader2, Check, Clock } from 'lucide-react';
import { OperatorBonus } from '@/hooks/useOperatorExtensions';
import { toast } from 'sonner';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';

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
  
  // Use localStorage for temporary operators only - useOperatorExtensions handles all logic
  const localStorage = useLocalStorageExtensions(operatorId);
  
  // Stabilize effectiveBonuses with useMemo to prevent unnecessary re-renders
  const effectiveBonuses = useMemo(() => {
    return isTemporaryOperator ? localStorage.bonuses : bonuses;
  }, [isTemporaryOperator, localStorage.bonuses, bonuses]);

  // Local state for immediate UI updates
  const [localBonuses, setLocalBonuses] = useState<OperatorBonus[]>(effectiveBonuses);
  
  // Dirty flag tracking
  const [isDirty, setIsDirty] = useState(false);
  const isInitialMount = useRef(true);
  
  // Save state tracking
  const [saveState, setSaveState] = useState<'idle' | 'waiting' | 'saving' | 'saved'>('idle');
  
  // Debounce the local bonuses with 3 second delay
  const debouncedBonuses = useDebounce(localBonuses, 3000);
  const prevDebouncedBonusesRef = useRef(debouncedBonuses);
  
  // Create stable save function using useRef and useCallback
  const performSaveRef = useRef<(data: OperatorBonus[]) => Promise<void>>();
  
  useEffect(() => {
    performSaveRef.current = async (data: OperatorBonus[]) => {
      if (isTemporaryOperator) {
        localStorage.saveBonusesToLocal(data);
      } else {
        await onSave(data);
      }
    };
  }, [isTemporaryOperator, localStorage, onSave]);
  
  const stableSave = useCallback(async (data: OperatorBonus[]) => {
    if (performSaveRef.current) {
      await performSaveRef.current(data);
    }
  }, []);
  
  // Update local state when prop changes (from external updates)
  useEffect(() => {
    // Deep equality check: only sync if props changed from a different source
    const propsMatchLastSave = JSON.stringify(effectiveBonuses) === JSON.stringify(prevDebouncedBonusesRef.current);
    
    // Skip sync if user is actively typing (isDirty)
    // OR if props match what we last saved (prevents overwrite during save)
    if (isDirty || propsMatchLastSave) {
      return;
    }
    
    setLocalBonuses(effectiveBonuses);
    setIsDirty(false);
    setSaveState('idle');
  }, [effectiveBonuses]);
  
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
    
    // Set saving state
    setSaveState('saving');
    
    // Update ref BEFORE save to prevent race condition
    prevDebouncedBonusesRef.current = debouncedBonuses;
    
    const performSave = async () => {
      try {
        await stableSave(debouncedBonuses);
        setIsDirty(false);
        setSaveState('saved');
        
        // Reset to idle after showing success
        setTimeout(() => {
          setSaveState('idle');
        }, 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveState('idle');
        // Revert ref on error
        prevDebouncedBonusesRef.current = effectiveBonuses;
      }
    };
    
    performSave();
  }, [debouncedBonuses, isDirty, stableSave]); // Removed effectiveBonuses - not needed
  
  // Show waiting state when there are pending changes
  useEffect(() => {
    if (isDirty && saveState === 'idle') {
      setSaveState('waiting');
    }
  }, [isDirty, saveState]);

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
      order_number: localBonuses.length,
    };
    const newBonuses = [...localBonuses, newBonus];
    setLocalBonuses(newBonuses);
    setIsDirty(true);
  };

  const updateBonus = (index: number, updates: Partial<OperatorBonus>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    // Update local state immediately for responsive UI
    const updated = localBonuses.map((bonus, i) => 
      i === index ? { ...bonus, ...updates } : bonus
    );
    setLocalBonuses(updated);
    setIsDirty(true);
  };

  const removeBonus = (index: number) => {
    const filtered = localBonuses.filter((_, i) => i !== index);
    setLocalBonuses(filtered);
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
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {isTemporaryOperator ? (
              <HardDrive className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Database className="h-5 w-5 text-muted-foreground" />
            )}
            Bonuses & Promotions
          </div>
          {/* Visual save state indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saveState === 'waiting' && (
            <>
              <Clock className="h-3 w-3" />
              <span>Waiting...</span>
            </>
          )}
          {saveState === 'saving' && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveState === 'saved' && (
            <>
              <Check className="h-3 w-3 text-green-600" />
              <span className="text-green-600">Saved</span>
            </>
          )}
        </div>
        </CardTitle>
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