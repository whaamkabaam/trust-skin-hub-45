import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ValidationSummaryProps {
  errors: Record<string, any>;
  totalFields: number;
  completedFields: number;
}

export function ValidationSummary({ errors, totalFields, completedFields }: ValidationSummaryProps) {
  const errorCount = Object.keys(errors).length;
  
  if (errorCount === 0) return null;

  return (
    <Alert className="mb-4 border-destructive/50 bg-destructive/10">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertDescription className="text-destructive">
        <div className="flex items-center justify-between mb-2">
          <strong>Please fix the following errors:</strong>
          <div className="text-sm">
            {completedFields}/{totalFields} fields completed
          </div>
        </div>
        <ul className="space-y-1">
          {Object.entries(errors).map(([field, error]) => (
            <li key={field} className="text-sm flex items-center gap-2">
              <XCircle className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium">{field}:</span>
              <span>{error?.message}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}