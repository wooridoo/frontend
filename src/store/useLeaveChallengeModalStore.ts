import { create } from 'zustand';

interface LeaveChallengeModalState {
    isOpen: boolean;
    challengeId: string | null;
    challengeTitle: string | null;
    onOpen: (challengeId: string, title: string) => void;
    onClose: () => void;
}

export const useLeaveChallengeModalStore = create<LeaveChallengeModalState>((set) => ({
    isOpen: false,
    challengeId: null,
    challengeTitle: null,
    onOpen: (challengeId, challengeTitle) => set({ isOpen: true, challengeId, challengeTitle }),
    onClose: () => set({ isOpen: false, challengeId: null, challengeTitle: null }),
}));
