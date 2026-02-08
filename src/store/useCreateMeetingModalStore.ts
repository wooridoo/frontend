import { create } from 'zustand';

interface CreateMeetingModalState {
    isOpen: boolean;
    challengeId: string | null;
    onOpen: (challengeId: string) => void;
    onClose: () => void;
}

export const useCreateMeetingModalStore = create<CreateMeetingModalState>((set) => ({
    isOpen: false,
    challengeId: null,
    onOpen: (challengeId) => set({ isOpen: true, challengeId }),
    onClose: () => set({ isOpen: false, challengeId: null }),
}));
