import React from 'react';
import { CheckCircle, Loader2, AlertCircle, HardDrive, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExtensionSaveStatusProps {
  isTemporaryOperator: boolean;
  isSaving?: boolean;
  hasError?: boolean;
  className?: string;
}

export function ExtensionSaveStatus({ 
  isTemporaryOperator, 
  isSaving = false, 
  hasError = false,
  className = "" 
}: ExtensionSaveStatusProps) {
  if (isSaving) {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 bg-blue-100 text-blue-800 ${className}`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </Badge>
    );
  }

  if (hasError) {
    return (
      <Badge variant="destructive" className={`flex items-center gap-1 ${className}`}>
        <AlertCircle className="h-3 w-3" />
        Error
      </Badge>
    );
  }

  if (isTemporaryOperator) {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 bg-orange-100 text-orange-800 ${className}`}>
        <HardDrive className="h-3 w-3" />
        Local Storage
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={`flex items-center gap-1 bg-green-100 text-green-800 ${className}`}>
      <CheckCircle className="h-3 w-3" />
      Database
    </Badge>
  );
}