import { create } from 'zustand';

interface WithdrawModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useWithdrawModalStore = create<WithdrawModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
