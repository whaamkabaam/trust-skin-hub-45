import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, AlertCircle, Database, HardDrive, Loader2, Check, Clock } from 'lucide-react';
import { OperatorSecurity } from '@/hooks/useOperatorExtensions';
import { toast } from '@/lib/toast';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';

interface SecurityManagerProps {
  security: OperatorSecurity | null;
  onSave: (security: OperatorSecurity) => void;
  operatorId: string;
  disabled?: boolean;
  onInteractionStart?: () => void;
}

export function SecurityManager({ security, onSave, operatorId, disabled = false, onInteractionStart }: SecurityManagerProps) {
  const defaultSecurity = {
    operator_id: operatorId,
    ssl_enabled: false,
    ssl_provider: '',
    license_info: '',
    compliance_certifications: [] as string[], // Ensure always an array
    data_protection_info: '',
    responsible_gaming_info: '',
    provably_fair: false,
    provably_fair_description: '',
    complaints_platform: '',
    audit_info: '',
  };
  
  // Check if this is a temporary operator (new operator)
  const isTemporaryOperator = operatorId.startsWith('temp-');
  
  // Use localStorage for temporary operators only - useOperatorExtensions handles all logic
  const localStorage = useLocalStorageExtensions(operatorId);
  
  // Stabilize effectiveSecurity with useMemo to prevent unnecessary re-renders
  const effectiveSecurity = useMemo(() => {
    const data = isTemporaryOperator ? (localStorage.security || defaultSecurity) : (security || defaultSecurity);
    // Ensure compliance_certifications is always an array to prevent map errors
    if (!data.compliance_certifications || !Array.isArray(data.compliance_certifications)) {
      data.compliance_certifications = [];
    }
    return data;
  }, [isTemporaryOperator, localStorage.security, security, defaultSecurity]);

  // Local state for immediate UI updates
  const [localSecurity, setLocalSecurity] = useState<OperatorSecurity>(effectiveSecurity);
  
  // Dirty flag tracking
  const [isDirty, setIsDirty] = useState(false);
  const isInitialMount = useRef(true);
  
  // Save state tracking
  const [saveState, setSaveState] = useState<'idle' | 'waiting' | 'saving' | 'saved'>('idle');
  
  // Debounce the local security with 3 second delay
  const debouncedSecurity = useDebounce(localSecurity, 3000);
  const prevDebouncedSecurityRef = useRef(debouncedSecurity);
  
  // Create stable save function using useRef and useCallback
  const performSaveRef = useRef<(data: OperatorSecurity) => Promise<void>>();
  
  useEffect(() => {
    performSaveRef.current = async (data: OperatorSecurity) => {
      if (isTemporaryOperator) {
        localStorage.saveSecurityToLocal(data);
      } else {
        await onSave(data);
      }
    };
  }, [isTemporaryOperator, localStorage, onSave]);
  
  const stableSave = useCallback(async (data: OperatorSecurity) => {
    if (performSaveRef.current) {
      await performSaveRef.current(data);
    }
  }, []);
  
  // Update local state when prop changes (from external updates)
  useEffect(() => {
    // Deep equality check: only sync if props changed from a different source
    const propsMatchLastSave = JSON.stringify(effectiveSecurity) === JSON.stringify(prevDebouncedSecurityRef.current);
    
    // Skip sync if user is actively typing (isDirty)
    // OR if props match what we last saved (prevents overwrite during save)
    if (isDirty || propsMatchLastSave) {
      return;
    }
    
    setLocalSecurity(effectiveSecurity);
    setIsDirty(false);
    setSaveState('idle');
  }, [effectiveSecurity]);
  
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
    prevDebouncedSecurityRef.current = debouncedSecurity;
    
    const performSave = async () => {
      try {
        await stableSave(debouncedSecurity);
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
        prevDebouncedSecurityRef.current = effectiveSecurity;
      }
    };
    
    performSave();
  }, [debouncedSecurity, isDirty, stableSave, effectiveSecurity]);
  
  // Show waiting state when there are pending changes
  useEffect(() => {
    if (isDirty && saveState === 'idle') {
      setSaveState('waiting');
    }
  }, [isDirty, saveState]);

  const updateSecurity = (updates: Partial<OperatorSecurity>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    // Update local state immediately for responsive UI
    setLocalSecurity({ ...localSecurity, ...updates });
    setIsDirty(true);
  };

  const addCertification = () => {
    updateSecurity({
      compliance_certifications: [...localSecurity.compliance_certifications, '']
    });
  };

  const updateCertification = (index: number, value: string) => {
    const updated = localSecurity.compliance_certifications.map((cert, i) => 
      i === index ? value : cert
    );
    updateSecurity({ compliance_certifications: updated });
  };

  const removeCertification = (index: number) => {
    const updated = localSecurity.compliance_certifications.filter((_, i) => i !== index);
    updateSecurity({ compliance_certifications: updated });
  };

  const handleSave = () => {
    if (disabled) {
      toast.error('Cannot save while publishing is in progress');
      return;
    }
    
    try {
      if (isTemporaryOperator) {
        // Data is already saved to localStorage automatically
        toast.success('Security settings saved locally - will be saved to database when operator is created');
      } else {
        // No manual save needed - data is automatically saved via onSave calls
        toast.success('Security settings are automatically saved to database');
      }
    } catch (error) {
      console.error('Error saving security:', error);
      toast.error('Failed to save security settings');
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
            Security & Compliance
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
      <CardContent className="space-y-6">
        {/* SSL Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localSecurity.ssl_enabled}
              onCheckedChange={(checked) => updateSecurity({ ssl_enabled: checked })}
            />
            <Label>SSL Security Enabled</Label>
          </div>
          
          {localSecurity.ssl_enabled && (
            <div>
              <Label>SSL Provider</Label>
              <Input
                value={localSecurity.ssl_provider || ''}
                onChange={(e) => updateSecurity({ ssl_provider: e.target.value })}
                placeholder="e.g., CloudFlare, Let's Encrypt"
              />
            </div>
          )}
        </div>

        {/* Licensing */}
        <div>
          <Label>License Information</Label>
          <Textarea
            value={localSecurity.license_info || ''}
            onChange={(e) => updateSecurity({ license_info: e.target.value })}
            placeholder="Licensing information and regulatory details..."
            rows={3}
          />
        </div>

        {/* Compliance Certifications */}
        <div className="space-y-4">
          <Label>Compliance Certifications</Label>
          {localSecurity.compliance_certifications.map((cert, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={cert}
                onChange={(e) => updateCertification(index, e.target.value)}
                placeholder="e.g., ISO 27001, SOC 2"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeCertification(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addCertification} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>

        {/* Provably Fair */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={localSecurity.provably_fair}
              onCheckedChange={(checked) => updateSecurity({ provably_fair: checked })}
            />
            <Label>Provably Fair Gaming</Label>
          </div>
          
          {localSecurity.provably_fair && (
            <div>
              <Label>Provably Fair Description</Label>
              <Textarea
                value={localSecurity.provably_fair_description || ''}
                onChange={(e) => updateSecurity({ provably_fair_description: e.target.value })}
                placeholder="Explain the provably fair system..."
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Data Protection */}
        <div>
          <Label>Data Protection Information</Label>
          <Textarea
            value={localSecurity.data_protection_info || ''}
            onChange={(e) => updateSecurity({ data_protection_info: e.target.value })}
            placeholder="GDPR compliance, data handling practices..."
            rows={3}
          />
        </div>

        {/* Responsible Gaming */}
        <div>
          <Label>Responsible Gaming Information</Label>
          <Textarea
            value={localSecurity.responsible_gaming_info || ''}
            onChange={(e) => updateSecurity({ responsible_gaming_info: e.target.value })}
            placeholder="Responsible gaming measures and self-exclusion options..."
            rows={3}
          />
        </div>

        {/* Complaints Platform */}
        <div>
          <Label>Complaints Platform</Label>
          <Input
            value={localSecurity.complaints_platform || ''}
            onChange={(e) => updateSecurity({ complaints_platform: e.target.value })}
            placeholder="e.g., ADR, Independent arbitration service"
          />
        </div>

        {/* Audit Information */}
        <div>
          <Label>Audit Information</Label>
          <Textarea
            value={localSecurity.audit_info || ''}
            onChange={(e) => updateSecurity({ audit_info: e.target.value })}
            placeholder="Third-party audits, security assessments..."
            rows={3}
          />
        </div>

        <Button type="button" onClick={handleSave} className="w-full" disabled={disabled}>
          {isTemporaryOperator ? 'Save Locally' : 'Save Security Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}