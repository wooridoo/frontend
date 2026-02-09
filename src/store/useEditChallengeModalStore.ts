import { create } from 'zustand';
import type { ChallengeInfo } from '@/lib/api/challenge';

interface EditChallengeModalState {
    isOpen: boolean;
    challenge: ChallengeInfo | null;
    onOpen: (challenge: ChallengeInfo) => void;
    onClose: () => void;
}

export const useEditChallengeModalStore = create<EditChallengeModalState>((set) => ({
    isOpen: false,
    challenge: null,
    onOpen: (challenge) => set({ isOpen: true, challenge }),
    onClose: () => set({ isOpen: false, challenge: null }),
}));
