import { create } from 'zustand';

interface PublishingLock {
  locks: Set<string>;
  isLocked: (operatorId: string) => boolean;
  lock: (operatorId: string) => void;
  unlock: (operatorId: string) => void;
  clearAllLocks: () => void;
}

export const usePublishingLock = create<PublishingLock>((set, get) => ({
  locks: new Set(),
  
  isLocked: (operatorId: string) => {
    return get().locks.has(operatorId);
  },
  
  lock: (operatorId: string) => {
    set(state => {
      const newLocks = new Set(state.locks);
      newLocks.add(operatorId);
      return { locks: newLocks };
    });
  },
  
  unlock: (operatorId: string) => {
    set(state => {
      const newLocks = new Set(state.locks);
      newLocks.delete(operatorId);
      return { locks: newLocks };
    });
  },
  
  clearAllLocks: () => {
    set({ locks: new Set() });
  }
}));