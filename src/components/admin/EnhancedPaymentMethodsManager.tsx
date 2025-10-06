import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sanitizePaymentMethodsForForm } from '@/utils/paymentMethodTransforms';

interface PaymentMethodDetails {
  payment_method_id?: string; // Made optional for smart import
  payment_method?: string; // Support for custom payment method names
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
  const { paymentMethods, loading, createPaymentMethod } = usePaymentMethods();
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customMethodName, setCustomMethodName] = useState('');
  const [customMethodLogo, setCustomMethodLogo] = useState('');
  const [addMode, setAddMode] = useState<'existing' | 'custom'>('existing');

  // Sanitize incoming payment methods on mount to convert null to undefined
  useEffect(() => {
    if (selectedPaymentMethods.length > 0) {
      const sanitized = sanitizePaymentMethodsForForm(selectedPaymentMethods);
      onPaymentMethodsChange(sanitized);
    }
  }, []);

  const selectedMethodIds = selectedPaymentMethods.map(m => m.payment_method_id).filter(Boolean);
  const availableMethods = paymentMethods.filter(method => 
    !selectedMethodIds.includes(method.id)
  );

  // Debug logging
  useEffect(() => {
    console.log('💳 Payment Methods State:', {
      totalPaymentMethods: paymentMethods.length,
      selectedPaymentMethods: selectedPaymentMethods.length,
      availableMethods: availableMethods.length,
      selectedMethodIds
    });
  }, [paymentMethods, selectedPaymentMethods, availableMethods]);

  const handleAddPaymentMethod = async () => {
    if (addMode === 'existing') {
      // Handle existing payment method selection
      if (!selectedMethodId) {
        toast.error('Please select a payment method');
        return;
      }
      
      const method = paymentMethods.find(m => m.id === selectedMethodId);
      if (!method) {
        toast.error('Payment method not found');
        return;
      }

      const newMethodDetails: PaymentMethodDetails = {
        payment_method_id: selectedMethodId,
        method_type: 'both',
        minimum_amount: undefined,
        maximum_amount: undefined,
        fee_percentage: undefined,
        fee_fixed: undefined,
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
              minimum_amount: newMethodDetails.minimum_amount ?? null,
              maximum_amount: newMethodDetails.maximum_amount ?? null,
              fee_percentage: newMethodDetails.fee_percentage ?? null,
              fee_fixed: newMethodDetails.fee_fixed ?? null,
              processing_time: newMethodDetails.processing_time,
              is_available: newMethodDetails.is_available
            });
          
          if (error) throw error;
          toast.success(`Added ${method.name} payment method`);
        } catch (error) {
          console.error('Error syncing payment method to database:', error);
          toast.error('Failed to sync payment method');
        }
      } else {
        toast.success(`Added ${method.name} payment method`);
      }
    } else {
      // Handle custom payment method
      if (!customMethodName.trim()) {
        toast.error('Please enter a payment method name');
        return;
      }

      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const slug = customMethodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        
        // Check if payment method already exists
        const { data: existing } = await supabase
          .from('payment_methods')
          .select('id, name')
          .eq('slug', slug)
          .maybeSingle();

        let paymentMethodId: string;
        let methodName: string;

        if (existing) {
          paymentMethodId = existing.id;
          methodName = existing.name;
          toast.success(`Using existing payment method: ${existing.name}`);
        } else {
          // Create new payment method
          const newPaymentMethod = await createPaymentMethod({
            name: customMethodName.trim(),
            slug,
            logo_url: customMethodLogo.trim() || undefined,
            description_rich: '',
            display_order: 999,
            is_featured: false
          });

          if (!newPaymentMethod) {
            toast.error('Failed to create payment method');
            return;
          }

          paymentMethodId = newPaymentMethod.id;
          methodName = newPaymentMethod.name;
          toast.success(`Created new payment method: ${methodName}`);
        }

        // Add to operator's payment methods
        const newMethod: PaymentMethodDetails = {
          payment_method_id: paymentMethodId,
          method_type: 'both',
          minimum_amount: undefined,
          maximum_amount: undefined,
          fee_percentage: undefined,
          fee_fixed: undefined,
          processing_time: 'Instant',
          is_available: true
        };

        const updatedMethods = [...selectedPaymentMethods, newMethod];
        onPaymentMethodsChange(updatedMethods);

        // Sync to database if operatorId exists
        if (operatorId && !operatorId.startsWith('temp-')) {
          const { error } = await supabase
            .from('operator_payment_methods')
            .insert({
              operator_id: operatorId,
              payment_method_id: paymentMethodId,
              method_type: 'both',
              processing_time: 'Instant',
              is_available: true
            });

          if (error) throw error;
        }

        // Reset form
        setCustomMethodName('');
        setCustomMethodLogo('');
      } catch (error) {
        console.error('Error adding custom payment method:', error);
        toast.error('Failed to add payment method');
      }
    }
  };

  const handleRemovePaymentMethod = async (index: number) => {
    const removedMethod = selectedPaymentMethods[index];
    const method = removedMethod.payment_method_id 
      ? paymentMethods.find(m => m.id === removedMethod.payment_method_id)
      : null;
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
            minimum_amount: updatedMethod.minimum_amount ?? null,
            maximum_amount: updatedMethod.maximum_amount ?? null,
            fee_percentage: updatedMethod.fee_percentage ?? null,
            fee_fixed: updatedMethod.fee_fixed ?? null,
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

  const getPaymentMethodName = (id?: string) => {
    if (!id) return 'Unknown Method';
    const method = paymentMethods.find(m => m.id === id);
    return method?.name || 'Unknown Method';
  };

  const getPaymentMethodLogo = (id?: string) => {
    if (!id) return undefined;
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
        {/* Payment Method Selection with Tabs */}
        <Tabs value={addMode} onValueChange={(v) => setAddMode(v as 'existing' | 'custom')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Select Existing</TabsTrigger>
            <TabsTrigger value="custom">Add Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-2 mt-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Select Payment Method</Label>
                <Select 
                  value={selectedMethodId} 
                  onValueChange={setSelectedMethodId}
                  disabled={disabled}
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
            {availableMethods.length === 0 && (
              <p className="text-xs text-muted-foreground">
                All existing payment methods have been added. Use "Add Custom" to create a new one.
              </p>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="custom-method-name">Payment Method Name *</Label>
              <Input
                id="custom-method-name"
                value={customMethodName}
                onChange={(e) => setCustomMethodName(e.target.value)}
                placeholder="e.g., Stripe, PayPal, Bitcoin"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-method-logo">Logo URL (Optional)</Label>
              <Input
                id="custom-method-logo"
                value={customMethodLogo}
                onChange={(e) => setCustomMethodLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                disabled={disabled}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddPaymentMethod}
              disabled={disabled || !customMethodName.trim()}
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create & Add Payment Method
            </Button>
          </TabsContent>
        </Tabs>

        {/* Selected Payment Methods */}
        {selectedPaymentMethods.length > 0 ? (
          <div className="space-y-2">
            <Label>Configured Payment Methods</Label>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Method</TableHead>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="min-w-[140px]">Min/Max Amount</TableHead>
                    <TableHead className="min-w-[120px]">Fees</TableHead>
                    <TableHead className="min-w-[130px]">Processing Time</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
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
                              value={methodDetails.minimum_amount ?? ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                minimum_amount: e.target.value ? parseFloat(e.target.value) : undefined 
                              })}
                              placeholder="Min"
                              className="w-16 text-xs"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={methodDetails.maximum_amount ?? ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                maximum_amount: e.target.value ? parseFloat(e.target.value) : undefined 
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
                              value={methodDetails.fee_percentage ?? ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                fee_percentage: e.target.value ? parseFloat(e.target.value) : undefined 
                              })}
                              placeholder="%"
                              className="w-12 text-xs"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={methodDetails.fee_fixed ?? ''}
                              onChange={(e) => handleUpdatePaymentMethod(index, { 
                                fee_fixed: e.target.value ? parseFloat(e.target.value) : undefined 
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