import { Check, Save, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { SaveState } from '@/types/save';

interface SaveStateIndicatorProps {
  saveState: SaveState;
  lastSaved?: Date | null;
  className?: string;
  isDraft?: boolean;
}

export function SaveStateIndicator({ saveState, lastSaved, className, isDraft = false }: SaveStateIndicatorProps) {
  if (isDraft) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <Badge variant="secondary" className="text-blue-600">
          <Clock className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      </div>
    );
  }

  const getStateConfig = () => {
    switch (saveState) {
      case 'saving':
        return {
          icon: <Save className="h-4 w-4 animate-pulse" />,
          text: 'Saving...',
          className: 'text-muted-foreground'
        };
      case 'saved':
        return {
          icon: <Check className="h-4 w-4" />,
          text: 'Saved',
          className: 'text-green-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Save failed',
          className: 'text-destructive'
        };
      default:
        return null;
    }
  };

  const stateConfig = getStateConfig();

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {stateConfig && (
        <>
          <span className={stateConfig.className}>
            {stateConfig.icon}
          </span>
          <span className={stateConfig.className}>
            {stateConfig.text}
          </span>
        </>
      )}
      {lastSaved && saveState === 'idle' && (
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Clock className="h-3 w-3" />
          <span>
            Last saved {lastSaved.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}