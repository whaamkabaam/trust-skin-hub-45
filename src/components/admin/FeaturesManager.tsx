import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive, Loader2, Check, Clock } from 'lucide-react';
import { OperatorFeature } from '@/hooks/useOperatorExtensions';
import { toast } from 'sonner';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';

interface FeaturesManagerProps {
  features: OperatorFeature[];
  onSave: (features: OperatorFeature[]) => void;
  operatorId: string;
  disabled?: boolean;
  onInteractionStart?: () => void;
}

const featureTypes = [
  { value: 'gameplay', label: 'Gameplay Feature' },
  { value: 'technical', label: 'Technical Feature' },
  { value: 'security', label: 'Security Feature' },
  { value: 'social', label: 'Social Feature' },
  { value: 'promotion', label: 'Promotional Feature' },
  { value: 'payment', label: 'Payment Feature' },
];

export function FeaturesManager({ features, onSave, operatorId, disabled = false, onInteractionStart }: FeaturesManagerProps) {
  // Check if this is a temporary operator (new operator)
  const isTemporaryOperator = operatorId.startsWith('temp-');
  
  // Use localStorage for temporary operators only - useOperatorExtensions handles all logic
  const localStorage = useLocalStorageExtensions(operatorId);
  
  // Stabilize effectiveFeatures with useMemo to prevent unnecessary re-renders
  const effectiveFeatures = useMemo(() => {
    return isTemporaryOperator ? localStorage.features : features;
  }, [isTemporaryOperator, localStorage.features, features]);

  // Local state for immediate UI updates
  const [localFeatures, setLocalFeatures] = useState<OperatorFeature[]>(effectiveFeatures);
  
  // Dirty flag tracking
  const [isDirty, setIsDirty] = useState(false);
  const isInitialMount = useRef(true);
  
  // Save state tracking
  const [saveState, setSaveState] = useState<'idle' | 'waiting' | 'saving' | 'saved'>('idle');
  
  // Debounce the local features with 5 second delay
  const debouncedFeatures = useDebounce(localFeatures, 5000);
  const prevDebouncedFeaturesRef = useRef(debouncedFeatures);
  
  // Create stable save function using useRef and useCallback
  const performSaveRef = useRef<(data: OperatorFeature[]) => Promise<void>>();
  
  useEffect(() => {
    performSaveRef.current = async (data: OperatorFeature[]) => {
      if (isTemporaryOperator) {
        localStorage.saveFeaturesToLocal(data);
      } else {
        await onSave(data);
      }
    };
  }, [isTemporaryOperator, localStorage, onSave]);
  
  const stableSave = useCallback(async (data: OperatorFeature[]) => {
    if (performSaveRef.current) {
      await performSaveRef.current(data);
    }
  }, []);
  
  // Update local state when prop changes (from external updates)
  useEffect(() => {
    // Deep equality check: only sync if props changed from a different source
    const propsMatchLastSave = JSON.stringify(effectiveFeatures) === JSON.stringify(prevDebouncedFeaturesRef.current);
    
    // Skip sync if user is actively typing (isDirty)
    // OR if props match what we last saved (prevents overwrite during save)
    if (isDirty || propsMatchLastSave) {
      return;
    }
    
    setLocalFeatures(effectiveFeatures);
    setIsDirty(false);
    setSaveState('idle');
  }, [effectiveFeatures]);
  
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
    const currentJson = JSON.stringify(debouncedFeatures);
    const previousJson = JSON.stringify(prevDebouncedFeaturesRef.current);
    
    if (currentJson === previousJson) {
      console.log('⏭️ Skipping auto-save - no actual changes detected');
      return;
    }
    
    console.log('🔄 Auto-save triggered for features');
    setSaveState('saving');
    
    // Update ref BEFORE save to prevent race condition
    prevDebouncedFeaturesRef.current = debouncedFeatures;
    
    const performSave = async () => {
      try {
        await stableSave(debouncedFeatures);
        setIsDirty(false);
        setSaveState('saved');
        console.log('✅ Auto-save completed successfully');
        
        toast.success(operatorId.startsWith('temp-')
          ? 'Features auto-saved locally' 
          : 'Features auto-saved'
        );
        
        // Reset to idle after showing success
        setTimeout(() => {
          setSaveState('idle');
        }, 2000);
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
        setSaveState('idle');
        prevDebouncedFeaturesRef.current = effectiveFeatures;
        toast.error('Auto-save failed. Please try manual save.');
      }
    };
    
    performSave();
  }, [debouncedFeatures, isDirty, stableSave, operatorId]);
  
  // Save on unmount (tab switch)
  useEffect(() => {
    return () => {
      if (isDirty && performSaveRef.current) {
        console.log('💾 Saving features on unmount...');
        performSaveRef.current(localFeatures).catch(error => {
          console.error('Save on unmount failed:', error);
        });
      }
    };
  }, []); // Empty deps - cleanup uses current ref values

  const addFeature = () => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const newFeature: OperatorFeature = {
      operator_id: operatorId,
      feature_type: 'gameplay',
      feature_name: '',
      description: '',
      is_highlighted: false,
    };
    const newFeatures = [...localFeatures, newFeature];
    setLocalFeatures(newFeatures);
    setIsDirty(true);
    setSaveState('waiting'); // Set waiting state immediately
  };

  const updateFeature = (index: number, updates: Partial<OperatorFeature>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    // Update local state immediately for responsive UI
    const updated = localFeatures.map((feature, i) => 
      i === index ? { ...feature, ...updates } : feature
    );
    setLocalFeatures(updated);
    setIsDirty(true);
    setSaveState('waiting'); // Set waiting state immediately
  };

  const removeFeature = (index: number) => {
    const filtered = localFeatures.filter((_, i) => i !== index);
    setLocalFeatures(filtered);
    setIsDirty(true);
  };

  const handleManualSave = async () => {
    if (disabled) {
      toast.error('Cannot save while publishing is in progress');
      return;
    }
    
    console.log('💾 Manual save triggered for features');
    setSaveState('saving');
    
    try {
      await stableSave(localFeatures);
      prevDebouncedFeaturesRef.current = localFeatures;
      setIsDirty(false);
      setSaveState('saved');
      
      toast.success(isTemporaryOperator 
        ? 'Features saved locally' 
        : 'Features saved to database'
      );
      
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error('❌ Manual save failed:', error);
      setSaveState('idle');
      toast.error('Failed to save features');
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
            Features & Highlights
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
              Data is being stored locally. Save the operator first to enable database storage.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {localFeatures.map((feature, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select
                  value={feature.feature_type}
                  onValueChange={(value) => updateFeature(index, { feature_type: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {featureTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={feature.is_highlighted}
                    onCheckedChange={(checked) => updateFeature(index, { is_highlighted: checked })}
                  />
                  <Label>Highlight</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Feature Name</Label>
                <Input
                  value={feature.feature_name}
                  onChange={(e) => updateFeature(index, { feature_name: e.target.value })}
                  placeholder="e.g., Live Chat Support"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={feature.description || ''}
                  onChange={(e) => updateFeature(index, { description: e.target.value })}
                  placeholder="Describe the feature..."
                  rows={2}
                />
              </div>
            </div>
          </Card>
        ))}

        <div className="flex gap-2 items-center">
          <Button type="button" onClick={addFeature} variant="outline" disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
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