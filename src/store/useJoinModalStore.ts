import { create } from 'zustand';

interface JoinModalStore {
  isOpen: boolean;
  challengeId: string | null;
  onOpen: (id?: string) => void;
  onClose: () => void;
}

export const useJoinModalStore = create<JoinModalStore>((set) => ({
  isOpen: false,
  challengeId: null,
  onOpen: (id) => set({ isOpen: true, challengeId: id || null }),
  onClose: () => set({ isOpen: false, challengeId: null }),
}));
