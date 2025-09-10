import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, AlertCircle, Database, HardDrive } from 'lucide-react';
import { OperatorSecurity } from '@/hooks/useOperatorExtensions';
import { toast } from '@/lib/toast';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    compliance_certifications: [],
    data_protection_info: '',
    responsible_gaming_info: '',
    provably_fair: false,
    provably_fair_description: '',
    complaints_platform: '',
    audit_info: '',
  };
  
  // Check if this is a temporary operator (new operator)
  const isTemporaryOperator = operatorId.startsWith('temp-');
  
  // Use localStorage for temporary operators only
  const localStorage = useLocalStorageExtensions(operatorId);
  
  // For temp operators, use localStorage. For existing operators, use props directly
  const effectiveSecurity = isTemporaryOperator ? (localStorage.security || defaultSecurity) : (security || defaultSecurity);
  const effectiveSave = isTemporaryOperator ? localStorage.saveSecurityToLocal : onSave;

  const updateSecurity = (updates: Partial<OperatorSecurity>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const updatedSecurity = { ...effectiveSecurity, ...updates };
    
    if (isTemporaryOperator) {
      localStorage.saveSecurityToLocal(updatedSecurity);
    } else {
      onSave(updatedSecurity);
    }
  };

  const addCertification = () => {
    updateSecurity({
      compliance_certifications: [...effectiveSecurity.compliance_certifications, '']
    });
  };

  const updateCertification = (index: number, value: string) => {
    const updated = effectiveSecurity.compliance_certifications.map((cert, i) => 
      i === index ? value : cert
    );
    updateSecurity({ compliance_certifications: updated });
  };

  const removeCertification = (index: number) => {
    const updated = effectiveSecurity.compliance_certifications.filter((_, i) => i !== index);
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Security & Compliance
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
      <CardContent className="space-y-6">
        {/* SSL Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={effectiveSecurity.ssl_enabled}
              onCheckedChange={(checked) => updateSecurity({ ssl_enabled: checked })}
            />
            <Label>SSL Security Enabled</Label>
          </div>
          
          {effectiveSecurity.ssl_enabled && (
            <div>
              <Label>SSL Provider</Label>
              <Input
                value={effectiveSecurity.ssl_provider || ''}
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
            value={effectiveSecurity.license_info || ''}
            onChange={(e) => updateSecurity({ license_info: e.target.value })}
            placeholder="Licensing information and regulatory details..."
            rows={3}
          />
        </div>

        {/* Compliance Certifications */}
        <div className="space-y-4">
          <Label>Compliance Certifications</Label>
          {effectiveSecurity.compliance_certifications.map((cert, index) => (
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
              checked={effectiveSecurity.provably_fair}
              onCheckedChange={(checked) => updateSecurity({ provably_fair: checked })}
            />
            <Label>Provably Fair Gaming</Label>
          </div>
          
          {effectiveSecurity.provably_fair && (
            <div>
              <Label>Provably Fair Description</Label>
              <Textarea
                value={effectiveSecurity.provably_fair_description || ''}
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
            value={effectiveSecurity.data_protection_info || ''}
            onChange={(e) => updateSecurity({ data_protection_info: e.target.value })}
            placeholder="GDPR compliance, data handling practices..."
            rows={3}
          />
        </div>

        {/* Responsible Gaming */}
        <div>
          <Label>Responsible Gaming Information</Label>
          <Textarea
            value={effectiveSecurity.responsible_gaming_info || ''}
            onChange={(e) => updateSecurity({ responsible_gaming_info: e.target.value })}
            placeholder="Responsible gaming measures and self-exclusion options..."
            rows={3}
          />
        </div>

        {/* Complaints Platform */}
        <div>
          <Label>Complaints Platform</Label>
          <Input
            value={effectiveSecurity.complaints_platform || ''}
            onChange={(e) => updateSecurity({ complaints_platform: e.target.value })}
            placeholder="e.g., ADR, Independent arbitration service"
          />
        </div>

        {/* Audit Information */}
        <div>
          <Label>Audit Information</Label>
          <Textarea
            value={effectiveSecurity.audit_info || ''}
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