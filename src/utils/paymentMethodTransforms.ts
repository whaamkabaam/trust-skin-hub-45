/**
 * Utility functions for transforming payment method data between database and form formats
 */

export interface PaymentMethodDetails {
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

/**
 * Sanitize payment method data from database for form usage
 * Converts null values to undefined to match Zod schema expectations
 */
export function sanitizePaymentMethodForForm(data: any): PaymentMethodDetails {
  return {
    payment_method_id: data.payment_method_id,
    method_type: data.method_type || 'both',
    minimum_amount: data.minimum_amount ?? undefined,
    maximum_amount: data.maximum_amount ?? undefined,
    fee_percentage: data.fee_percentage ?? undefined,
    fee_fixed: data.fee_fixed ?? undefined,
    processing_time: data.processing_time || 'Instant',
    is_available: data.is_available !== false
  };
}

/**
 * Transform array of payment methods from database to form format
 */
export function sanitizePaymentMethodsForForm(data: any[]): PaymentMethodDetails[] {
  return data.map(sanitizePaymentMethodForForm);
}
