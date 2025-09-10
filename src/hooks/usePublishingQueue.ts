import { create } from 'zustand';
import { toast } from 'sonner';

interface PublishingQueue {
  publishingQueue: Set<string>;
  errorRecovery: Map<string, { retryCount: number; lastError: string }>;
  addToQueue: (operatorId: string) => void;
  removeFromQueue: (operatorId: string) => void;
  isInQueue: (operatorId: string) => boolean;
  recordError: (operatorId: string, error: string) => void;
  canRetry: (operatorId: string) => boolean;
  clearError: (operatorId: string) => void;
  getQueueStatus: () => { total: number; active: string[] };
}

export const usePublishingQueue = create<PublishingQueue>((set, get) => ({
  publishingQueue: new Set(),
  errorRecovery: new Map(),
  
  addToQueue: (operatorId: string) => {
    set(state => {
      const newQueue = new Set(state.publishingQueue);
      newQueue.add(operatorId);
      return { publishingQueue: newQueue };
    });
  },
  
  removeFromQueue: (operatorId: string) => {
    set(state => {
      const newQueue = new Set(state.publishingQueue);
      newQueue.delete(operatorId);
      return { publishingQueue: newQueue };
    });
  },
  
  isInQueue: (operatorId: string) => {
    return get().publishingQueue.has(operatorId);
  },
  
  recordError: (operatorId: string, error: string) => {
    set(state => {
      const newErrorMap = new Map(state.errorRecovery);
      const current = newErrorMap.get(operatorId) || { retryCount: 0, lastError: '' };
      newErrorMap.set(operatorId, {
        retryCount: current.retryCount + 1,
        lastError: error
      });
      return { errorRecovery: newErrorMap };
    });
  },
  
  canRetry: (operatorId: string) => {
    const errorInfo = get().errorRecovery.get(operatorId);
    return !errorInfo || errorInfo.retryCount < 3;
  },
  
  clearError: (operatorId: string) => {
    set(state => {
      const newErrorMap = new Map(state.errorRecovery);
      newErrorMap.delete(operatorId);
      return { errorRecovery: newErrorMap };
    });
  },
  
  getQueueStatus: () => {
    const state = get();
    return {
      total: state.publishingQueue.size,
      active: Array.from(state.publishingQueue)
    };
  }
}));

// Safe publishing wrapper with comprehensive error handling
export async function safePublishingOperation<T>(
  operatorId: string,
  operation: () => Promise<T>,
  operationName: string
): Promise<T | null> {
  const queue = usePublishingQueue.getState();
  
  // Check if operation can proceed
  if (queue.isInQueue(operatorId)) {
    toast.error(`Publishing already in progress for this operator`);
    return null;
  }
  
  if (!queue.canRetry(operatorId)) {
    toast.error(`Maximum retry attempts reached for ${operationName}`);
    return null;
  }
  
  // Add to queue
  queue.addToQueue(operatorId);
  
  try {
    console.log(`Starting safe publishing operation: ${operationName} for operator:`, operatorId);
    
    // Execute operation with timeout
    const result = await Promise.race([
      operation(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Publishing operation timed out')), 60000)
      )
    ]);
    
    // Clear any previous errors on success
    queue.clearError(operatorId);
    console.log(`Successfully completed ${operationName} for operator:`, operatorId);
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in ${operationName}:`, error);
    
    // Record error for retry logic
    queue.recordError(operatorId, errorMessage);
    
    // Show appropriate error message
    if (errorMessage.includes('timeout')) {
      toast.error(`${operationName} timed out. Please try again.`);
    } else if (errorMessage.includes('not a function')) {
      toast.error(`System error during ${operationName}. Refreshing may help.`);
    } else {
      toast.error(`${operationName} failed: ${errorMessage}`);
    }
    
    return null;
  } finally {
    // Always remove from queue
    queue.removeFromQueue(operatorId);
  }
}