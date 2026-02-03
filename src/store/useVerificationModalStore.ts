import { create } from 'zustand';

interface VerificationModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useVerificationModalStore = create<VerificationModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
