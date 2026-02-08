import { create } from 'zustand';

interface PasswordResetModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const usePasswordResetModalStore = create<PasswordResetModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
