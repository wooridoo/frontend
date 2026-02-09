import { create } from 'zustand';

interface CreditChargeModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreditChargeModalStore = create<CreditChargeModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
