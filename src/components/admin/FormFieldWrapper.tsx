import { ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  isValid?: boolean;
  hasError?: boolean;
  description?: string;
  children: ReactNode;
}

export function FormFieldWrapper({ 
  label, 
  required = false, 
  isValid = false, 
  hasError = false,
  description,
  children 
}: FormFieldWrapperProps) {
  return (
    <FormItem>
      <FormLabel className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        {isValid && !hasError && (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
        {hasError && (
          <XCircle className="h-4 w-4 text-destructive" />
        )}
      </FormLabel>
      <FormControl>
        {children}
      </FormControl>
      {description && (
        <FormDescription>
          {description}
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}