import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive } from 'lucide-react';
import { OperatorFeature } from '@/hooks/useOperatorExtensions';
import { toast } from 'sonner';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  
  // Always use props data (useOperatorExtensions manages localStorage internally)
  const effectiveFeatures = isTemporaryOperator ? localStorage.features : features;

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
    const newFeatures = [...effectiveFeatures, newFeature];
    if (isTemporaryOperator) {
      localStorage.saveFeaturesToLocal(newFeatures);
    } else {
      onSave(newFeatures);
    }
  };

  const updateFeature = (index: number, updates: Partial<OperatorFeature>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const updated = effectiveFeatures.map((feature, i) => 
      i === index ? { ...feature, ...updates } : feature
    );
    
    if (isTemporaryOperator) {
      localStorage.saveFeaturesToLocal(updated);
    } else {
      onSave(updated);
    }
  };

  const removeFeature = (index: number) => {
    const filtered = effectiveFeatures.filter((_, i) => i !== index);
    
    if (isTemporaryOperator) {
      localStorage.saveFeaturesToLocal(filtered);
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
        toast.success('Features saved locally - will be saved to database when operator is created');
      } else {
        toast.success('Features are automatically saved to database');
      }
    } catch (error) {
      console.error('Error saving features:', error);
      toast.error('Failed to save features');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Features & Highlights
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
        {effectiveFeatures.map((feature, index) => (
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

        <div className="flex gap-2">
          <Button type="button" onClick={addFeature} variant="outline" disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
          <Button type="button" onClick={handleSave} disabled={disabled}>
            {isTemporaryOperator ? 'Save Locally' : 'Save Features'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}