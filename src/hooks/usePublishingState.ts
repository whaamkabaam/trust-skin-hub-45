import { create } from 'zustand';

interface PublishingState {
  isPublishing: boolean;
  operatorId: string | null;
  setPublishing: (operatorId: string) => void;
  clearPublishing: () => void;
}

export const usePublishingState = create<PublishingState>((set) => ({
  isPublishing: false,
  operatorId: null,
  setPublishing: (operatorId: string) => set({ isPublishing: true, operatorId }),
  clearPublishing: () => set({ isPublishing: false, operatorId: null }),
}));