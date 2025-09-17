import React from 'react';
import { Loader2, Globe, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePublishingState } from '@/hooks/usePublishingState';
import { usePublishingLock } from '@/hooks/usePublishingLock';
import { usePublishingQueue } from '@/hooks/usePublishingQueue';

interface PublishingStatusIndicatorProps {
  operatorId: string;
  className?: string;
}

export function PublishingStatusIndicator({ operatorId, className = "" }: PublishingStatusIndicatorProps) {
  const { isPublishing, operatorId: publishingOperatorId } = usePublishingState();
  const { isLocked } = usePublishingLock();
  const { isInQueue } = usePublishingQueue();

  const isCurrentOperatorPublishing = isPublishing && publishingOperatorId === operatorId;
  const isCurrentOperatorLocked = isLocked(operatorId);
  const isCurrentOperatorInQueue = isInQueue(operatorId);

  if (!isCurrentOperatorPublishing && !isCurrentOperatorLocked && !isCurrentOperatorInQueue) {
    return null;
  }

  const getStatusContent = () => {
    if (isCurrentOperatorPublishing) {
      return {
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        text: 'Publishing...',
        variant: 'secondary' as const,
        color: 'bg-blue-100 text-blue-800'
      };
    }
    
    if (isCurrentOperatorInQueue) {
      return {
        icon: <Clock className="h-3 w-3" />,
        text: 'Queued',
        variant: 'secondary' as const,
        color: 'bg-orange-100 text-orange-800'
      };
    }
    
    if (isCurrentOperatorLocked) {
      return {
        icon: <AlertCircle className="h-3 w-3" />,
        text: 'Locked',
        variant: 'destructive' as const,
        color: 'bg-red-100 text-red-800'
      };
    }

    return null;
  };

  const status = getStatusContent();
  
  if (!status) return null;

  return (
    <Badge 
      variant={status.variant} 
      className={`flex items-center gap-1 ${status.color} ${className}`}
    >
      {status.icon}
      {status.text}
    </Badge>
  );
}