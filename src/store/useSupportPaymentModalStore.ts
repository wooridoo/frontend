import { create } from 'zustand';

interface SupportPaymentModalState {
    isOpen: boolean;
    challengeId: string | null;
    amount: number;
    onOpen: (challengeId: string, amount: number) => void;
    onClose: () => void;
}

export const useSupportPaymentModalStore = create<SupportPaymentModalState>((set) => ({
    isOpen: false,
    challengeId: null,
    amount: 0,
    onOpen: (challengeId, amount) => set({ isOpen: true, challengeId, amount }),
    onClose: () => set({ isOpen: false, challengeId: null, amount: 0 }),
}));
