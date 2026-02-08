import { create } from 'zustand';

interface DeleteChallengeModalState {
    isOpen: boolean;
    challengeId: string | null;
    challengeTitle: string | null;
    onOpen: (challengeId: string, title: string) => void;
    onClose: () => void;
}

export const useDeleteChallengeModalStore = create<DeleteChallengeModalState>((set) => ({
    isOpen: false,
    challengeId: null,
    challengeTitle: null,
    onOpen: (challengeId, challengeTitle) => set({ isOpen: true, challengeId, challengeTitle }),
    onClose: () => set({ isOpen: false, challengeId: null, challengeTitle: null }),
}));
