import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, X, CreditCard, Database, Edit2, Trash2 } from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PaymentMethodDetails {
  payment_method_id: string;
  method_type: 'deposit' | 'withdrawal' | 'both';
  minimum_amount?: number;
  maximum_amount?: number;
  fee_percentage?: number;
  fee_fixed?: number;
  processing_time?: string;
  is_available: boolean;
}

interface EnhancedPaymentMethodsManagerProps {
  selectedPaymentMethods: PaymentMethodDetails[];
  onPaymentMethodsChange: (methods: PaymentMethodDetails[]) => void;
  operatorId?: string;
  disabled?: boolean;
}

export function EnhancedPaymentMethodsManager({ 
  selectedPaymentMethods, 
  onPaymentMethodsChange, 
  operatorId,
  disabled = false 
}: EnhancedPaymentMethodsManagerProps) {
  const { paymentMethods, loading } = usePaymentMethods();
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const selectedMethodIds = selectedPaymentMethods.map(m => m.payment_method_id);
  const availableMethods = paymentMethods.filter(method => 
    !selectedMethodIds.includes(method.id)
  );

  const handleAddPaymentMethod = async () => {
    console.log('🔍 Add Payment Method clicked', {
      selectedMethodId,
      availableMethods: availableMethods.length,
      paymentMethods: paymentMethods.length
    });
    
    if (!selectedMethodId) {
      console.warn('⚠️ No method selected');
      toast.error('Please select a payment method');
      return;
    }
    
    const method = paymentMethods.find(m => m.id === selectedMethodId);
    if (!method) {
      console.error('❌ Method not found for ID:', selectedMethodId);
      toast.error('Payment method not found');
      return;
    }

    console.log('✅ Adding payment method:', method.name);

    const newMethodDetails: PaymentMethodDetails = {
      payment_method_id: selectedMethodId,
      method_type: 'both',
      minimum_amount: 0,
      maximum_amount: undefined,
      fee_percentage: 0,
      fee_fixed: 0,
      processing_time: 'Instant',
      is_available: true
    };

    const updatedMethods = [...selectedPaymentMethods, newMethodDetails];
    onPaymentMethodsChange(updatedMethods);
    setSelectedMethodId('');
    
    // Sync to database if operator exists
    if (operatorId && !operatorId.startsWith('temp-')) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('operator_payment_methods')
          .insert({
            operator_id: operatorId,
            payment_method_id: selectedMethodId,
            method_type: newMethodDetails.method_type,
            minimum_amount: newMethodDetails.minimum_amount,
            maximum_amount: newMethodDetails.maximum_amount,
            fee_percentage: newMethodDetails.fee_percentage,
            fee_fixed: newMethodDetails.fee_fixed,
            processing_time: newMethodDetails.processing_time,
            is_available: newMethodDetails.is_available
          });
        
        if (error) {
          console.error('❌ Database error:', error);
          throw error;
        }
        
        console.log('✅ Synced to database');
        toast.success(`Added ${method.name} payment method`);
      } catch (error) {
        console.error('Error syncing payment method to database:', error);
        toast.error('Failed to sync payment method');
      }
    } else {
      console.log('📝 Temporary operator, not syncing to DB');
      toast.success(`Added ${method.name} payment method`);
    }
  };

  const handleRemovePaymentMethod = async (index: number) => {
    const removedMethod = selectedPaymentMethods[index];
    const method = paymentMethods.find(m => m.id === removedMethod.payment_method_id);
    const updatedMethods = selectedPaymentMethods.filter((_, i) => i !== index);
    onPaymentMethodsChange(updatedMethods);
    
    // Sync to database if operator exists
    if (operatorId && !operatorId.startsWith('temp-')) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase
          .from('operator_payment_methods')
          .delete()
          .eq('operator_id', operatorId)
          .eq('payment_method_id', removedMethod.payment_method_id);
        
        if (method) {
          toast.success(`Removed ${method.name} payment method`);
        }
      } catch (error) {
        console.error('Error removing payment method from database:', error);
        toast.error('Failed to remove payment method');
      }
    } else {
      if (method) {
        toast.success(`Removed ${method.name} payment method`);
      }
    }
  };

  const handleUpdatePaymentMethod = async (index: number, updates: Partial<PaymentMethodDetails>) => {
    const updatedMethods = selectedPaymentMethods.map((method, i) => 
      i === index ? { ...method, ...updates } : method
    );
    onPaymentMethodsChange(updatedMethods);
    
    // Sync to database if operator exists
    if (operatorId && !operatorId.startsWith('temp-')) {
      try {
        const updatedMethod = updatedMethods[index];
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase
          .from('operator_payment_methods')
          .update({
            method_type: updatedMethod.method_type,
            minimum_amount: updatedMethod.minimum_amount,
            maximum_amount: updatedMethod.maximum_amount,
            fee_percentage: updatedMethod.fee_percentage,
            fee_fixed: updatedMethod.fee_fixed,
            processing_time: updatedMethod.processing_time,
            is_available: updatedMethod.is_available
          })
          .eq('operator_id', operatorId)
          .eq('payment_method_id', updatedMethod.payment_method_id);
      } catch (error) {
        console.error('Error updating payment method:', error);
      }
    }
  };

  const getPaymentMethodName = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    return method?.name || 'Unknown Method';
  };

  const getPaymentMethodLogo = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    return method?.logo_url;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading payment methods...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
          <Badge variant="outline" className="ml-auto">
            {selectedPaymentMethods.length} configured
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Method Selection */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="payment-method-select">Add Payment Method</Label>
            <Select 
              value={selectedMethodId} 
              onValueChange={setSelectedMethodId}
              disabled={disabled || availableMethods.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a payment method to add" />
              </SelectTrigger>
              <SelectContent>
                {availableMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-2">
                      {method.logo_url && (
                        <img 
                          src={method.logo_url} 
                          alt={method.name}
                          className="w-4 h-4 rounded"
                        />
                      )}
                      {method.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleAddPaymentMethod}
              disabled={disabled || !selectedMethodId}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Selected Payment Methods */}
        {selectedPaymentMethods.length > 0 ? (
          <div className="space-y-4">
            <Label>Configured Payment Methods</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Min/Max Amount</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPaymentMethods.map((methodDetails, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodLogo(methodDetails.payment_method_id) && (
                            <img 
                              src={getPaymentMethodLogo(methodDetails.payment_method_id)} 
                              alt={getPaymentMethodName(methodDetails.payment_method_id)}
                              className="w-6 h-6 rounded"
                            />
                          )}
                          <span className="font-medium">
                            {getPaymentMethodName(methodDetails.payment_method_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Select
                            value={methodDetails.method_type}
                            onValueChange={(value) => handleUpdatePaymentMethod(index, { 
                              method_type: value as 'deposit' | 'withdrawal' | 'both'
                            })}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="deposit">Deposit</SelectItem>
                              <SelectItem value="withdrawal">Withdrawal</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="capitalize">
                            {methodDetails.method_type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <div className="flex gap-1">
                            <Input
                              type="number"
                              step="0.01"
                              value={methodDetails.minimum_amount || ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                minimum_amount: parseFloat(e.target.value) || 0 
                              })}
                              placeholder="Min"
                              className="w-16 text-xs"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={methodDetails.maximum_amount || ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                maximum_amount: parseFloat(e.target.value) || undefined 
                              })}
                              placeholder="Max"
                              className="w-16 text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-sm">
                            ${methodDetails.minimum_amount || 0} - ${methodDetails.maximum_amount || '∞'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <div className="flex gap-1">
                            <Input
                              type="number"
                              step="0.01"
                              value={methodDetails.fee_percentage || ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                fee_percentage: parseFloat(e.target.value) || 0 
                              })}
                              placeholder="%"
                              className="w-12 text-xs"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={methodDetails.fee_fixed || ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                fee_fixed: parseFloat(e.target.value) || 0 
                              })}
                              placeholder="$"
                              className="w-12 text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-sm">
                            {methodDetails.fee_percentage || 0}% + ${methodDetails.fee_fixed || 0}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={methodDetails.processing_time || ''}
                            onChange={(e) => handleUpdatePaymentMethod(index, { 
                              processing_time: e.target.value 
                            })}
                            placeholder="Processing time"
                            className="w-24 text-xs"
                          />
                        ) : (
                          <span className="text-sm">{methodDetails.processing_time || 'N/A'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={methodDetails.is_available ? 'default' : 'secondary'}>
                          {methodDetails.is_available ? 'Available' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {editingIndex === index ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingIndex(null)}
                              disabled={disabled}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingIndex(index)}
                              disabled={disabled}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePaymentMethod(index)}
                            disabled={disabled}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              No payment methods configured. Add payment methods to show users how they can deposit and withdraw funds.
            </AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <div className="text-sm text-muted-foreground">
          Configure payment methods with their specific limits, fees, and processing times for accurate user information.
        </div>
      </CardContent>
    </Card>
  );
}