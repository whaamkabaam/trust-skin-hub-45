import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { OperatorSecurity } from '@/hooks/useOperatorExtensions';
import { toast } from '@/lib/toast';

interface SecurityManagerProps {
  security: OperatorSecurity | null;
  onSave: (security: OperatorSecurity) => void;
  operatorId: string;
}

export function SecurityManager({ security, onSave, operatorId }: SecurityManagerProps) {
  const [localSecurity, setLocalSecurity] = useState<OperatorSecurity>(
    security || {
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
    }
  );

  const updateSecurity = (updates: Partial<OperatorSecurity>) => {
    setLocalSecurity(prev => ({ ...prev, ...updates }));
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
    if (typeof onSave === 'function') {
      onSave(localSecurity);
    } else {
      toast.error('Save function not available');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Compliance</CardTitle>
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
          <Button onClick={addCertification} variant="outline" size="sm">
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

        <Button onClick={handleSave} className="w-full">
          Save Security Settings
        </Button>
      </CardContent>
    </Card>
  );
}