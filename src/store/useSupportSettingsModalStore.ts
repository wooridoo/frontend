import { create } from 'zustand';

interface SupportSettingsModalState {
    isOpen: boolean;
    challengeId: string | null;
    onOpen: (challengeId: string) => void;
    onClose: () => void;
}

export const useSupportSettingsModalStore = create<SupportSettingsModalState>((set) => ({
    isOpen: false,
    challengeId: null,
    onOpen: (challengeId) => set({ isOpen: true, challengeId }),
    onClose: () => set({ isOpen: false, challengeId: null }),
}));
