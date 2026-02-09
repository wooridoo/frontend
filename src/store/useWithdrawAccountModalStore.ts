import { create } from 'zustand';

interface WithdrawAccountModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useWithdrawAccountModalStore = create<WithdrawAccountModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
