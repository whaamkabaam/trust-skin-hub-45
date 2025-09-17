import React from 'react';
import { CheckCircle, Circle, AlertCircle, Loader2 } from 'lucide-react';
import { SaveState } from '@/hooks/useAutoSave';

interface SaveStatusIndicatorProps {
  saveState: SaveState;
  lastSaved: Date | null;
  className?: string;
}

export function SaveStatusIndicator({ saveState, lastSaved, className = "" }: SaveStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (saveState) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (saveState) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSaved 
          ? `Saved at ${lastSaved.toLocaleTimeString()}`
          : 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return 'Not saved';
    }
  };

  const getStatusColor = () => {
    switch (saveState) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}