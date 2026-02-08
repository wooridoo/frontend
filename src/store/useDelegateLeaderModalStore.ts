import { create } from 'zustand';

interface DelegateLeaderModalState {
    isOpen: boolean;
    challengeId: string | null;
    currentLeaderId: string | null;
    onOpen: (challengeId: string, currentLeaderId: string) => void;
    onClose: () => void;
}

export const useDelegateLeaderModalStore = create<DelegateLeaderModalState>((set) => ({
    isOpen: false,
    challengeId: null,
    currentLeaderId: null,
    onOpen: (challengeId, currentLeaderId) => set({ isOpen: true, challengeId, currentLeaderId }),
    onClose: () => set({ isOpen: false, challengeId: null, currentLeaderId: null }),
}));
