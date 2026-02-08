import { create } from 'zustand';

interface EditProfileModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useEditProfileModalStore = create<EditProfileModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
