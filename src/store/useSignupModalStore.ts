import { create } from 'zustand';

interface SignupModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useSignupModalStore = create<SignupModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
