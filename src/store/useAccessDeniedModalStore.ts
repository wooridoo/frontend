import { create } from 'zustand';

interface AccessDeniedModalStore {
    isOpen: boolean;
    challengeId: string | null;
    onOpen: (challengeId: string) => void;
    onClose: () => void;
}

export const useAccessDeniedModalStore = create<AccessDeniedModalStore>((set) => ({
    isOpen: false,
    challengeId: null,
    onOpen: (challengeId) => set({ isOpen: true, challengeId }),
    onClose: () => set({ isOpen: false, challengeId: null }),
}));
