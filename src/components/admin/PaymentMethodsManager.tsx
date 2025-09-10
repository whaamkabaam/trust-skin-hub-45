import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Database, HardDrive } from 'lucide-react';
import { OperatorPayment } from '@/hooks/useOperatorExtensions';
import { toast } from 'sonner';
import { useLocalStorageExtensions } from '@/hooks/useLocalStorageExtensions';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentMethodsManagerProps {
  payments: OperatorPayment[];
  onSave: (payments: OperatorPayment[]) => void;
  operatorId: string;
  disabled?: boolean;
  onInteractionStart?: () => void;
}

const paymentMethods = [
  'crypto', 'bitcoin', 'ethereum', 'litecoin', 'dogecoin',
  'skins', 'cs2_skins', 'dota2_skins', 'tf2_skins',
  'credit_card', 'debit_card', 'paypal', 'skrill', 'neteller',
  'bank_transfer', 'paysafecard', 'google_pay', 'apple_pay'
];

export function PaymentMethodsManager({ payments, onSave, operatorId, disabled = false, onInteractionStart }: PaymentMethodsManagerProps) {
  // Check if this is a temporary operator (new operator)
  const isTemporaryOperator = operatorId.startsWith('temp-');
  
  // Use localStorage for temporary operators only
  const localStorage = useLocalStorageExtensions(operatorId);
  
  // For temp operators, use localStorage. For existing operators, use props directly
  const effectivePayments = isTemporaryOperator ? localStorage.payments : payments;
  const effectiveSave = isTemporaryOperator ? localStorage.savePaymentsToLocal : onSave;

  const addPayment = (type: 'deposit' | 'withdrawal') => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const newPayment: OperatorPayment = {
      operator_id: operatorId,
      method_type: type,
      payment_method: 'crypto',
      minimum_amount: 0,
      maximum_amount: undefined,
      fee_percentage: 0,
      fee_fixed: 0,
      processing_time: 'Instant',
      is_available: true,
    };
    const newPayments = [...effectivePayments, newPayment];
    if (isTemporaryOperator) {
      localStorage.savePaymentsToLocal(newPayments);
    } else {
      onSave(newPayments);
    }
  };

  const updatePayment = (index: number, updates: Partial<OperatorPayment>) => {
    // Notify parent that user is interacting with extensions
    if (onInteractionStart) {
      onInteractionStart();
    }
    
    const updated = effectivePayments.map((payment, i) => 
      i === index ? { ...payment, ...updates } : payment
    );
    
    if (isTemporaryOperator) {
      localStorage.savePaymentsToLocal(updated);
    } else {
      onSave(updated);
    }
  };

  const removePayment = (index: number) => {
    const filtered = effectivePayments.filter((_, i) => i !== index);
    
    if (isTemporaryOperator) {
      localStorage.savePaymentsToLocal(filtered);
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
        toast.success('Payments saved locally - will be saved to database when operator is created');
      } else {
        // No manual save needed - data is automatically saved via onSave calls
        toast.success('Payment methods are automatically saved to database');
      }
    } catch (error) {
      console.error('Error saving payments:', error);
      toast.error('Failed to save payments');
    }
  };

  const depositMethods = effectivePayments.filter(p => p.method_type === 'deposit');
  const withdrawalMethods = effectivePayments.filter(p => p.method_type === 'withdrawal');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Payment Methods
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
        {/* Deposit Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Deposit Methods</h3>
            <Button type="button" onClick={() => addPayment('deposit')} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Deposit Method
            </Button>
          </div>

          <div className="space-y-4">
            {depositMethods.map((payment, index) => {
              const globalIndex = effectivePayments.indexOf(payment);
              return (
                <Card key={globalIndex} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Payment Method</Label>
                      <Select
                        value={payment.payment_method}
                        onValueChange={(value) => updatePayment(globalIndex, { payment_method: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Min Amount</Label>
                      <Input
                        type="number"
                        value={payment.minimum_amount || ''}
                        onChange={(e) => updatePayment(globalIndex, { 
                          minimum_amount: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                      />
                    </div>

                    <div>
                      <Label>Max Amount</Label>
                      <Input
                        type="number"
                        value={payment.maximum_amount || ''}
                        onChange={(e) => updatePayment(globalIndex, { 
                          maximum_amount: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                      />
                    </div>

                    <div>
                      <Label>Fee %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={payment.fee_percentage || ''}
                        onChange={(e) => updatePayment(globalIndex, { 
                          fee_percentage: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                      />
                    </div>

                    <div>
                      <Label>Fixed Fee</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={payment.fee_fixed || ''}
                        onChange={(e) => updatePayment(globalIndex, { 
                          fee_fixed: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={payment.is_available}
                          onCheckedChange={(checked) => updatePayment(globalIndex, { is_available: checked })}
                        />
                        <Label>Available</Label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePayment(globalIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Withdrawal Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Withdrawal Methods</h3>
            <Button type="button" onClick={() => addPayment('withdrawal')} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Withdrawal Method
            </Button>
          </div>

          <div className="space-y-4">
            {withdrawalMethods.map((payment, index) => {
              const globalIndex = effectivePayments.indexOf(payment);
              return (
                <Card key={globalIndex} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Payment Method</Label>
                      <Select
                        value={payment.payment_method}
                        onValueChange={(value) => updatePayment(globalIndex, { payment_method: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Processing Time</Label>
                      <Input
                        value={payment.processing_time || ''}
                        onChange={(e) => updatePayment(globalIndex, { processing_time: e.target.value })}
                        placeholder="e.g., Instant, 1-24 hours"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={payment.is_available}
                          onCheckedChange={(checked) => updatePayment(globalIndex, { is_available: checked })}
                        />
                        <Label>Available</Label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePayment(globalIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Button type="button" onClick={handleSave} className="w-full" disabled={disabled}>
          {isTemporaryOperator ? 'Save Locally' : 'Save Payment Methods'}
        </Button>
      </CardContent>
    </Card>
  );
}