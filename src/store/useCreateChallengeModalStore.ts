import { create } from 'zustand';

interface CreateChallengeModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreateChallengeModalStore = create<CreateChallengeModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
